var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var fs = require('fs');

// default options
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipo de coleccion Validos

    var tipoValidos = ['usuarios', 'medicos', 'hospitales'];

    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no Valido',
            errors: { mensaje: 'Los Tipo validos son ' + tipoValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no seleccionó imagen',
            errors: { mensaje: 'Debe de seleccionar una imagen' }
        });
    }

    // optener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extenciones Aceptadas

    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no Valida',
            errors: { mensaje: 'Las Extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre de Archivo Personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    // Mover Archivo temporal al Path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover Archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            var pathOld = './uploads/usuarios/' + usuario.img;

            // si Existe Elinina la imagen Anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actulizar imgen del usuario',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizada',
                    usuarioActualizado: usuarioActualizado,

                });
            });
        });


    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            var pathOld = './uploads/medicos/' + medico.img;

            // si Existe Elinina la imagen Anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actulizar imgen del medico',
                        errors: err
                    });
                }


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Medico Actualizada',
                    medicoActualizado: medicoActualizado,

                });
            });
        });

    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            var pathOld = './uploads/hospitales/' + hospital.img;

            // si Existe Elinina la imagen Anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actulizar imgen del hospital',
                        errors: err
                    });
                }


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del Hospital Actualizada',
                    hospitalActualizado: hospitalActualizado,

                });
            });
        });

    }




}

module.exports = app;