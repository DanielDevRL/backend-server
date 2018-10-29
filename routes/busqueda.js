var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// =====================================================
// Busqueda por coleccion
// =====================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i')
    var promesa

    switch (tabla) {
        case 'usuarios':
            promesa = BuscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = BuscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = BuscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mesaje: 'Los Tipos de Busqueda solo son usuarios Medicos y Hospitales',
                error: { message: 'Tipo de table/coleccion no valida' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data

        });
    });



});

// =====================================================
// Busqueda General
// =====================================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([BuscarHospitales(busqueda, regex),
            BuscarMedicos(busqueda, regex),
            BuscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });
        });
});

function BuscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar Hospitales');
                } else {
                    resolve(hospitales)
                }
            });
    })
}

function BuscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });

    });
}

function BuscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error cargando usuarios', err)
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;