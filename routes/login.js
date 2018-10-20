var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();

var Usuario = require('../models/usuario');

var SEDD = require('../config/config').SEDD;

// google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// =====================================================
// Autenticacion Google
// =====================================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }

}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mesaje: 'token no valido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error el buscar Usuarios',
                errors: err
            });
        }


        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mesaje: 'Debe de usar su Autenticacion normal',

                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEDD, { expiresIn: 14400 }); //4 Horas

                res.status(200).json({
                    ok: true,
                    id: usuarioDB._id,
                    token: token,
                    usuario: usuarioDB
                });
            }

        } else {
            // usuario no existe lo crea

            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioDB }, SEDD, { expiresIn: 14400 }); //4 Horas

                res.status(200).json({
                    ok: true,
                    token: token,
                    usuario: usuarioDB,
                    id: usuarioDB._id
                });

            });
        }
    });




    // return res.status(200).json({
    //     ok: true,
    //     mesaje: 'OK',
    //     googleUser: googleUser
    // });


});

// =====================================================
// Autenticacion Normal
// =====================================================
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