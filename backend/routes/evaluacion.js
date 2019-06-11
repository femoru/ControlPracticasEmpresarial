const express = require('express')
const $db = require('../db')

const router = express.Router()

router.get('/:idestudiante', (req, res) => {
  const idestudiante = req.params.idestudiante;
  $db.query("SELECT e.*, a.nombreempresa, a.fechainicio, a.nombrejefe FROM evaluacion e, actainicio a WHERE a.idestudiante = e.idestudiante and e.idestudiante = ?", [idestudiante], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for evaluacion: " + err);
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
  $db.query(`INSERT INTO evaluacion (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
      if (err) {
          console.log("Error insertando evaluacion:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

router.put("/:idevaluacion", (req, res) => {

  const idevaluacion = req.params.idevaluacion
  let campos = [];
  for (const key in req.body) {
      campos.push(`${key} = '${req.body[key]}'`)
  }

  $db.query(`UPDATE evaluacion SET ${campos.join()} WHERE idevaluacion = ?`, [idevaluacion], (err, results, _fields) => {
      if (err) {
          console.log("Error actualizando evaluacion:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

module.exports = router;