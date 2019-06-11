const express = require('express')
const $db = require('../db')
const router = express.Router()

router.get("/:idUniversidad", (req, res) => {
  console.log("Fetching carreras with id: " + req.params.idUniversidad);

  const idUniversidad = req.params.idUniversidad;
  const queryString = `SELECT CARRERAS.* FROM CARRERAS WHERE CARRERAS.ID_UNIVERSIDAD = ?`
  $db.query(queryString, [idUniversidad], (err, rows, fields) => {
      if (err) {
          console.log("Failed to query for carreras: " + err);
          res.sendStatus(500)
          res.end()
          return
      }
      res.json(rows)
  })
})

router.get("/:idUniversidad/:idCarrera", (req, res) => {
  console.log("Fetching carreras with id: " + req.params.idUniversidad);

  const idUniversidad = req.params.idUniversidad;
  const idCarrera = req.params.idCarrera;
  const queryString = `SELECT CARRERAS.* FROM CARRERAS WHERE CARRERAS.ID_UNIVERSIDAD = ? AND CARRERAS.ID_CARRERA = ?`
  $db.query(queryString, [idUniversidad,idCarrera], (err, rows, fields) => {
      if (err) {
          console.log("Failed to query for carreras: " + err);
          res.sendStatus(500)
          res.end()
          return
      }
      res.json(rows)
  })
})

router.get("/:idUniversidad/tutor/:idtutor", (req, res) => {
    console.log("Fetching carreras with id: " + req.params.idUniversidad);
  
    const idUniversidad = req.params.idUniversidad;
    const idCarrera = req.params.idCarrera;
    const queryString = `SELECT CARRERAS.* FROM CARRERAS WHERE CARRERAS.ID_UNIVERSIDAD = ? AND CARRERAS.`
    $db.query(queryString, [idUniversidad,idCarrera], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for carreras: " + err);
            res.sendStatus(500)
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
  $db.query(`INSERT INTO CARRERAS (${campos.join()}) VALUES (?)`, [valores], (err, results, _fields) => {
      if (err) {
          console.log("Error insertando carrera:", err);
          res.sendStatus(500)
          return
      }
      res.json(results)
  })
})

router.put("/:idUniversidad/:idCarrera", (req, res) => {

    const idUniversidad = req.params.idUniversidad
    const idCarrera = req.params.idCarrera
    let campos = [];
    for (const key in req.body) {
        campos.push(`${key} = '${req.body[key]}'`)
    }

    $db.query(`UPDATE CARRERAS SET ${campos.join()} WHERE ID_UNIVERSIDAD = ? AND ID_CARRERA = ?`, [idUniversidad, idCarrera], (err, results, _fields) => {
        if (err) {
            console.log("Error actualizando carrera:", err);
            res.sendStatus(500)
            return
        }
        res.json(results)
    })
})

module.exports = router;