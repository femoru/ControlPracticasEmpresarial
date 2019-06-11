const express = require('express')
const $db = require('../db')

const router = express.Router()

router.get('/:idestudiante', (req, res) => {
  const idestudiante = req.params.idestudiante;
  $db.query("SELECT * FROM actividades WHERE idestudiante = ?", [idestudiante], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for actividades: " + err);
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
  $db.query(`INSERT INTO actividades (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
      if (err) {
          console.log("Error insertando actividades:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

router.put("/:idactividad", (req, res) => {

  const idactividad = req.params.idactividad
  let campos = [];
  for (const key in req.body) {
      campos.push(`${key} = '${req.body[key]}'`)
  }

  $db.query(`UPDATE actividades SET ${campos.join()} WHERE idactividad = ?`, [idactividad], (err, results, _fields) => {
      if (err) {
          console.log("Error actualizando actividades:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

module.exports = router;