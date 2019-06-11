const express = require('express')
const $db = require('../db')

const router = express.Router()

router.get('/:idcarrera', (req, res) => {
  const idcarrera = req.params.idcarrera
  const query = "SELECT * FROM inducciones where idcarrera = ?";
  $db.query(query, [idcarrera], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for inducciones: " + err);
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
  $db.query(`INSERT INTO inducciones (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
    if (err) {
      console.log("Error insertando induccion:", err);
      res.sendStatus(500)
      return
    }
    res.json(results)
  })
})

router.put("/:idcarrera/:idinduccion", (req, res) => {

  const idcarrera = req.params.idcarrera
  const idinduccion = req.params.idinduccion

  delete req.body.idcarrera
  delete req.body.idinduccion
  let campos = [];
  for (const key in req.body) {
    campos.push(`${key} = '${req.body[key]}'`)
  }

  $db.query(`UPDATE inducciones SET ${campos.join()} WHERE idcarrera = ? AND idinduccion = ?`, [idcarrera, idinduccion], (err, results, _fields) => {
    if (err) {
      console.log("Error actualizando induccion:", err);
      res.sendStatus(500)
      return
    }
    res.json(results)
  })
})

router.delete("/:idcarrera/:idinduccion", (req, res) => {
  const idcarrera = req.params.idcarrera
  const idinduccion = req.params.idinduccion

  $db.query(`DELETE from inducciones WHERE idcarrera = ? AND idinduccion = ?`, [idcarrera, idinduccion], (err, results, _fields) => {
    if (err) {
      console.log("Error eliminando induccion:", err);
      res.sendStatus(500)
      return
    }
    res.json(results)
  })
})

router.post("/terms/:idestudiante", (req, res) => {
  const idestudiante = req.params.idestudiante
  const comentario = "<p><b>Inducción de practicas</b></p><p>Acepta las condiciones de las practicas</p>";
  let buff = new Buffer(comentario);

  $db.query(`INSERT INTO evolucion (idestudiante, idautor, comentario, stars) VALUES (?, ?, ?, ?)`, [idestudiante, 0, buff.toString('base64'), 5], (err, results, _fields) => {
    if (err) {
      console.log("Error insertando evolucion:", err);
      res.sendStatus(500)
      return
    }
    res.json(results)
  })
})


module.exports = router;