const express = require('express')
const $db = require('../db')
var uuid = require('uuid')
var nJwt = require('njwt')



const router = express.Router()

router.post('/login', (req, res) => {
    const user = JSON.parse(new Buffer(req.body.user, 'base64').toString('ascii'))

    const crypto = require('crypto');
    const username = user.usuario;
    const password = crypto.createHash('sha256').update(user.password).digest('hex');

    const queryString = "SELECT * FROM USUARIOS U, ROLES R WHERE R.ID_ROL = U.ID_ROL AND  USUARIO = ? AND PASSWORD = ?";
    $db.query(queryString, [username, password], (err, rows, _fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500)
            res.end()
            return
        }
        if (!rows.length) {
            console.log("No user founded");
            res.sendStatus(401)
            res.end()
            return
        }
        const users = rows.map((row) => {
            delete row.PASSWORD;
            return row
        })
        let user = users[0];
        let claims = {
            "jti": uuid(),
            "sub": user.USUARIO,
            "name": user.NOMBRE,
            "rol": user.ID_ROL,
        }
        let token = nJwt.create(claims, "secret", "HS256").compact()
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) })
            .json({
                user: users[0],
                token: "Bearer " + token
            })
    });
})

router.post("/recover", (req, res) => {
    const username = req.body.username;

    const queryString = "SELECT CORREO, ESTADO, NOMBRE FROM USUARIOS WHERE USUARIO = ?"
    $db.query(queryString, [username], (err, rows, _fields) => {
        if (err) {
            console.log("Failed to query for user: " + err);
            res.sendStatus(500)
            res.end()
            return
        }
        if (!rows.length) {
            console.log("No user founded");
            res.sendStatus(404)
            res.end()
            return
        }
        const est = rows[0]
        if (est.ESTADO && est.CORREO) {
            var crypto = require("crypto");
            const sendmail = require('../modules/sendmail')
            var password = crypto.randomBytes(12).toString('hex');

            const mensaje = {
                from: 'PRACTICAS UNICATOLICA <practicas@unicatolica.edu.co>',
                to: `${est.NOMBRE} <${est.CORREO}>`,
                subject: 'Recuperación de contraseña',
                html: `Su contraseña temporal es: <b> ${password} </b> `
            }
            const pass = crypto.createHash('sha256').update(String(password)).digest("hex");
            $db.query("UPDATE USUARIOS SET PASSWORD = ? WHERE CORREO = ? AND ESTADO = 1", [pass, est.CORREO],
                (err, results, fields) => {
                    if(err){
                        console.log("Failed to query for user: " + err);
                        res.sendStatus(500)
                        res.end()
                        return
                    }
                    sendmail(mensaje)
                })
        }
        res.sendStatus(202)


    })
})

module.exports = router;