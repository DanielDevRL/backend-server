var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');


var Usuario = require('../models/usuario');
// =====================================================
// Obtener todos los usuarios
// =====================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Errro Cargando usuarios',
                        errors: err
                    });
                }

                Usuario.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });
});



// =====================================================
// Actualizar Usuario
// =====================================================
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_o_MismoUsuario], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Errro al Buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El asuario con el id' + id + 'no Existe',
                errors: { messge: "No Existe un usuario con ese Id" }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Erro al actualizar Usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ":)";

            res.status(200).json({
                ok: true,
                usuarios: usuarioGuardado
            });

        });

    });


})

// =====================================================
// Crear Nuevo Usuario
// =====================================================

app.post('/', (req, res) => {

    var body = req.body

    var usuario = new Usuario({
        id: body.id,
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Errro Creando usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuarios: usuarioGuardado,
            usurioToken: req.usuario
        });
    });

});

// =====================================================
// Emimar Usurio by Id
// =====================================================
app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_o_MismoUsuario], (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Errro al borrar usuarios',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe Usuario con ese id',
                errors: { messge: 'No existe Usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarioBorrado
        });

    })
});

module.exports = app;