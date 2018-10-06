var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();

var Usuario = require('../models/usuario');

var SEDD = require('../config/config').SEDD;

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error el buscar Usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas- email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas- pwd',
                errors: err
            });
        }

        // crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEDD, { expiresIn: 14400 }); //4 Horas

        res.status(200).json({
            ok: true,
            id: usuarioDB.id,
            token: token,
            usurio: usuarioDB
        });
    })


});

module.exports = app;