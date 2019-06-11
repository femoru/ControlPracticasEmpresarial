const express = require('express')
const $db = require('../db')
const router = express.Router()
const sendmail = require('../modules/sendmail')

router.get("/", (req, res) => {
    console.log("Fetching user with id: " + req.params.id);

    const userId = req.params.id;
    const queryString = `SELECT USUARIOS.*, ROLES.ROL FROM USUARIOS, ROLES WHERE ROLES.ID_ROL = USUARIOS.ID_ROL`
    $db.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500)
            res.end()
            return
        }
        const users = rows.map((row) => {
            delete row.PASSWORD;
            return row
        })
        res.json(users)
    })
})

router.get("/tutors/:universidad", (req, res) => {
    console.log("Fetching tutors with id: " + req.params.id);

    const universidad = req.params.universidad;
    const queryString = `SELECT ID_USUARIO, NOMBRE, USUARIO
            FROM USUARIOS WHERE ID_ROL = 3 AND ID_UNIVERSIDAD = ?`
    $db.query(queryString, [universidad], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500)
            res.end()
            return
        }
        const users = rows.map((row) => {
            delete row.PASSWORD;
            return row
        })
        res.json(users)
    })
})



router.post("/", (req, res) => {

    let user = req.body

    let campos = [], valores = [];
    for (const campo in user) {
        campos.push(campo)
        valores.push(user[campo])
    }
    
    
    $db.query(`INSERT INTO USUARIOS (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
        if (err) {
            console.log("Error insertando usuario:", err);
            res.sendStatus(500)
            return
        }
        if (user.ID_ROL == 4 && user.CORREO) {
            let est = user;
            const mensaje = {
                from: 'PRACTICAS UNICATOLICA <practicas@unicatolica.edu.co>',
                to: `${est.NOMBRE} <${est.CORREO}>`,
                subject: 'Inscripción en el programa de practicas',
                text: `Bienvenido ha sido suscrito al sistema de practicas de la Fundación Universitaria Catolica Lumen Gentium
                para ingresar su usuario es ${est.CODIGO} y su contraseña corresponde a su documento de identificación`
            }
            sendmail(mensaje)
                .catch((reason) => {
                    console.error(reason)
                    res.sendStatus(500);
                    return
                })
                .then((info) => {
                    res.json(Object.assign({},results, info))
                })
        } else {
            res.json(results)
        }
    })
})


router.put("/:idUsuario", (req, res) => {

    const idUsuario = req.params.idUsuario
    let campos = [];
    for (const key in req.body) {
        campos.push(`${key} = '${req.body[key]}'`)
    }

    $db.query(`UPDATE USUARIOS SET ${campos.join()} WHERE ID_USUARIO = ?`, [idUsuario], (err, results, _fields) => {
        if (err) {
            console.log("Error actualizando USUARIO:", err);
            res.sendStatus(500)
            return
        }
        res.json(results)
    })
})

router.get("/:id", (req, res) => {
    console.log("Fetching user with id: " + req.params.id);

    const userId = req.params.id;
    const queryString = `SELECT USUARIOS.*, ROLES.ROL FROM USUARIOS,ROLES where USUARIOS.ID_ROL = ROLES.ID_ROL AND ID_USUARIO = ?`
    $db.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500)
            res.end()
            return
        }
        const users = rows.map((row) => {
            delete row.PASSWORD;
            return row
        })
        res.json(users)
    })
})


module.exports = router;