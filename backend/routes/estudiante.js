const express = require('express')
const os = require('os')
const path = require('path');
const $db = require('../db')
const sendmail = require('../modules/sendmail')
const router = express.Router()
const fs = require('fs');


const pathTmp = os.tmpdir() //path.join(os.tmpdir(), 'practicas', 'uploads')
console.log("tmpPath:", pathTmp)

const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathTmp)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

//moves the $file to $dir2
var moveFile = (file, dir2) => {
  //include the fs, path modules


  //gets file name and adds it to dir2
  if (!fs.existsSync(path.dirname(dir2)))
    fs.mkdirSync(path.dirname(dir2))
  var dest = path.resolve(dir2);

  return new Promise((resolve, reject) => {
    fs.copyFile(file, dest, (err) => {
      if (err) reject(err);
      else resolve();
    });
  })

};


const upload = multer({ storage: storage })

router.get("/:universidad", (req, res) => {
  console.log("Fetching estudiantes with id: " + req.params.id);

  const universidad = req.params.universidad;
  const queryString = `SELECT USUARIOS.*, CARRERAS.CARRERA, CARRERAS.TUTOR
          FROM USUARIOS, CARRERAS WHERE CARRERAS.ID_CARRERA = USUARIOS.ID_CARRERA AND USUARIOS.ID_ROL = 4 AND USUARIOS.ID_UNIVERSIDAD = ?`
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

router.get("/:universidad/tutor/:idtutor", (req, res) => {
  console.log("Fetching estudiantes with id: " + req.params.id);

  const universidad = req.params.universidad;
  const idtutor = req.params.idtutor;
  const queryString = `SELECT USUARIOS.*, CARRERAS.CARRERA,  CARRERAS.TUTOR
          FROM USUARIOS, CARRERAS 
          WHERE CARRERAS.ID_CARRERA = USUARIOS.ID_CARRERA 
          AND USUARIOS.ID_ROL = 4 
          AND USUARIOS.ID_UNIVERSIDAD = ?
          AND CARRERAS.TUTOR = ?`
  $db.query(queryString, [universidad, idtutor], (err, rows, fields) => {
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
router.get("/:universidad/estudiante/:idestudiante", (req, res) => {
  console.log("Fetching estudiantes with id: " + req.params.id);

  const universidad = req.params.universidad;
  const idestudiante = req.params.idestudiante;
  const queryString = `SELECT USUARIOS.*, CARRERAS.CARRERA,  CARRERAS.TUTOR
          FROM USUARIOS, CARRERAS 
          WHERE CARRERAS.ID_CARRERA = USUARIOS.ID_CARRERA 
          AND USUARIOS.ID_ROL = 4 
          AND USUARIOS.ID_UNIVERSIDAD = ?
          AND USUARIOS.ID_USUARIO = ?`
  $db.query(queryString, [universidad, idestudiante], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for estudiante: " + err);
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


router.post("/:idUniversidad/cargar", upload.single('file'), (req, res, next) => {

  const XLSX = require('xlsx');
  const crypto = require('crypto');

  const idUniversidad = req.params.idUniversidad
  const idcarrera = req.body.ID_CARRERA


  const wb = XLSX.readFile(req.file.path)
  let ws = wb.Sheets[wb.SheetNames[0]];

  const arrayEstudiantes = XLSX.utils.sheet_to_json(ws);

  let insertValues = arrayEstudiantes.map((est) => {
    var pass = crypto.createHash('sha256').update(String(est.NRODOCUMENTO)).digest("hex");
    return [
      String(est.CODIGO).padStart(9, '0'), pass, 4, est.NOMBRE, 1, est.CORREO, idUniversidad, String(est.CODIGO).padStart(9, '0'), est.TIPODOCUMENTO,
      est.NRODOCUMENTO, est.TELEFONO, idcarrera, est.SEMESTRE, est.PERIODO
    ];
  })

  const sqlQuery = `INSERT INTO USUARIOS
  (USUARIO,  PASSWORD,  ID_ROL,  NOMBRE,  ESTADO,  CORREO,  ID_UNIVERSIDAD,  CODIGO,  TIPODOCUMENTO,
  NRODOCUMENTO,  TELEFONO,  ID_CARRERA,  SEMESTRE, PERIODO)  VALUES ?`;

  $db.query(sqlQuery, [insertValues], (err, results, _fields) => {
    if (err) {
      console.log("Error insertando usuarios:", err);
      res.status(500).send(err)
      return
    }

    arrayEstudiantes.forEach(async (est) => {
      const mensaje = {
        from: 'PRACTICAS UNICATOLICA <practicas@unicatolica.edu.co>',
        to: `${est.NOMBRE} <${est.CORREO}>`,
        subject: 'Inscripción en el programa de practicas',
        text: `Bienvenido ha sido suscrito al sistema de practicas de la Fundación Universitaria Catolica Lumen Gentium
        para ingresar su usuario es ${est.CODIGO} y su contraseña corresponde a su documento de identificación`
      }
      await sendmail(mensaje)
    });

    res.json(results)
  })
})

router.post('/subirdocumentos', upload.any(), (req, res, next) => {

  let idestudiante = req.body.ID_ESTUDIANTE
  req.files.forEach((f) => {
    let filename = '';
    const sepIndex = f.filename.indexOf('-');
    filename = f.filename.substr(4, sepIndex - 4) + path.extname(f.originalname)
    moveFile(f.path, path.join('uploads', idestudiante, filename)).then(() => {
      console.log(filename)
    })
  })
  res.sendStatus(200);
})

router.get("/documentos/:idestudiante/:nombredoc", (req, res, next) => {
  const idestudiante = req.params.idestudiante;
  const nombredoc = req.params.nombredoc;
  const filePath = path.join("uploads", idestudiante, nombredoc);

  if (fs.existsSync(filePath))
    res.sendFile(path.resolve(filePath))
  else
    res.status(404).send("No se encontro el archivo")
})
router.delete("/documentos/:idestudiante/:nombredoc", (req, res, next) => {
  const idestudiante = req.params.idestudiante;
  const nombredoc = req.params.nombredoc;
  const filePath = path.join("uploads", idestudiante, nombredoc);

  try {
    fs.unlinkSync(filePath)
    res.sendStatus(200);
  } catch (e) {
    res.status(404).send("No se encontro el archivo")
  }
})


router.post("/agendarvisita", (req, res, next) => {

  const fecha = req.body.fecha.split('-');
  const hora = req.body.hora.split(":");
  const lugar = req.body.lugar;
  const texto = req.body.mensaje
  const estudiante = req.body.estudiante
  const jefe = req.body.jefe
  const usuario = req.body.usuario

  const fechacita = new Date(`${req.body.fecha} ${req.body.hora}`);

  const ics = require('ics')
  const { error, value } = ics.createEvent(
    {
      title: 'Visita de practicas ' + estudiante.NOMBRE,
      description: 'Visita de practicas ' + estudiante.NOMBRE,
      start: [fechacita.getUTCFullYear(), fechacita.getUTCMonth() + 1, fechacita.getUTCDate(), fechacita.getUTCHours(), fechacita.getUTCMinutes()],
      duration: { minutes: 45 },
      location: lugar.name,
      status: 'CONFIRMED',
      organizer: { name: usuario.NOMBRE, email: usuario.CORREO },
      attendees: [
        { name: estudiante.NOMBRE, email: estudiante.CORREO },
        { name: usuario.NOMBRE, email: usuario.CORREO },
        { name: jefe.NOMBRE, email: jefe.CORREO },
      ]
    },
  )

  const comentario = "<p><b>Agendamiento de visita de practicas</b></p>" + texto;
  let buff = new Buffer(comentario);

  $db.query(`INSERT INTO evolucion (idestudiante, idautor, comentario, stars) VALUES (?, ?, ?, ?)`, [estudiante.ID_USUARIO, 0, buff.toString('base64'), 5], (err, results, _fields) => {
    if (err) {
      console.log("Error insertando evolucion:", err);
      res.sendStatus(500)
      return
    }

    const mensaje = {
      from: 'PRACTICAS UNICATOLICA <practicas@unicatolica.edu.co>',
      to: [
        `${estudiante.NOMBRE} <${estudiante.CORREO}>`,
        `${jefe.NOMBRE} <${jefe.CORREO}>`,
        `${usuario.NOMBRE} <${usuario.CORREO}>`
      ],
      subject: 'Visita practicas',
      html: texto,
      alternatives: [{
        contentType: "text/calendar",
        content: new Buffer(value)
      }]
    }


    sendmail(mensaje)

    res.sendStatus(200);
  })
})

module.exports = router;