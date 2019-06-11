const express = require('express')
const $db = require('../db')

const router = express.Router()

router.get('/',(req,res)=>{
  $db.query("SELECT * FROM ROLES", (err, rows, fields) => {
    if (err) {
        console.log("Failed to query for rols: " + err);
        res.sendStatus(500).send(err) 
        res.end()
        return
    }
    res.json(rows)
})
})


module.exports = router;