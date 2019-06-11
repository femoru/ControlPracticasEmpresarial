const app = require("./server")
const $config = require('./config.module')

/** Configuracion de rutas */
app.use("/rest/auth", require('./routes/auth'));
app.use("/rest/user", require('./routes/users'));
app.use("/rest/universidad", require('./routes/universidad'));
app.use("/rest/rols", require('./routes/rols'));
app.use("/rest/carrera", require('./routes/carrera'));
app.use("/rest/students", require('./routes/estudiante'));
app.use("/rest/inducciones", require('./routes/inducciones'));
app.use("/rest/actainicio", require('./routes/actainicio'));
app.use("/rest/fichaproblema", require('./routes/fichaproblema'));
app.use("/rest/actividades", require('./routes/actividades'));
app.use("/rest/bitacora", require('./routes/bitacora'));
app.use("/rest/evaluacion", require('./routes/evaluacion'));

const PORT = $config.server_port
app.listen(PORT, () => {
    console.log("Server is up and listening on", PORT, "...");
})