// Requires
var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

// Inicializar Variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var appRoutes = require('./routes/app');


// Conexion Base de Datos
mongoose.connection.openUri('mongodb://localhost:27017/hopitalDB', (err, res) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/', appRoutes);


// Ecuchar Peticiones
app.listen(3000, () => {

    console.log('Express Server Puesto 3000: \x1b[32m%s\x1b[0m', 'online');

});