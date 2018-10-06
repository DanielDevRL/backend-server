var express = require('express');
var Usuario = require('../models/usuario');

var app = express();

// =====================================================
// Obtener todos los usuarios
// =====================================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Errro Cargando usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});

// =====================================================
// Crear Nuevo Usuario
// =====================================================

app.post('/', (req, res) => {

    var body = req.body

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Errro Creando usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuarios: usuarioGuardado
        });
    });

});

module.exports = app;