const express = require('express')
const router = express.Router()
const $db = require("../db")

router.get("/", (_req, res) => {
    $db.query("SELECT * FROM UNIVERSIDADES", (err, rows, _fields) => {
        if (err) {
            res.sendStatus(500);
            return
        }
        res.json(rows)
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    $db.query("SELECT * FROM UNIVERSIDADES WHERE ID_UNIVERSIDAD = ?", [id], (err, rows, _fields) => {
        if (err) {
            res.sendStatus(500);
            return
        }
        if (!rows.length) {
            res.sendStatus(404);
            return
        }
        res.json(rows[0])
    })
})

router.post("/", (req, res) => {
    let campos = [], valores = [];
    for (const key in req.body) {
        campos.push(key)
        valores.push(req.body[key])
    }

    $db.query(`INSERT INTO UNIVERSIDADES (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
        if (err) {
            console.log("Error insertando universidad:", err);
            res.sendStatus(500)
            return
        }
        res.json(results)
    })
})

router.put("/:id", (req, res) => {
    const id = req.params.id
    let campos = [];
    for (const key in req.body) {
        campos.push(`${key} = '${req.body[key]}'`)
    }

    $db.query(`UPDATE UNIVERSIDADES SET ${campos.join()} WHERE ID_UNIVERSIDAD = ?`, [id], (err, results, _fields) => {
        if (err) {
            console.log("Error actualizando universidad:", err);
            res.sendStatus(500)
            return
        }
        res.json(results)
    })
})

module.exports = router;