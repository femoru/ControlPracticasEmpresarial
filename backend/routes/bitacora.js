const express = require('express')
const $db = require('../db')

const router = express.Router()

router.get('/:idestudiante', (req, res) => {
  const idestudiante = req.params.idestudiante;
  $db.query("SELECT * FROM evolucion WHERE idestudiante = ? order by fecha desc", [idestudiante], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for rols: " + err);
      res.sendStatus(500).send(err)
      res.end()
      return
    }
    res.json(rows)
  })
})

router.post("/", (req, res) => {
    
  let campos = [], valores = [];
  for (const key in req.body) {
      campos.push(key)
      valores.push(req.body[key])
  }
  $db.query(`INSERT INTO evolucion (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
      if (err) {
          console.log("Error insertando evolucion:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

router.put("/:idevolucion", (req, res) => {

  const idevolucion = req.params.idevolucion
  let campos = [];
  for (const key in req.body) {
      campos.push(`${key} = '${req.body[key]}'`)
  }

  $db.query(`UPDATE evolucion SET ${campos.join()} WHERE idevolucion = ?`, [idevolucion], (err, results, _fields) => {
      if (err) {
          console.log("Error actualizando evolucion:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

module.exports = router;