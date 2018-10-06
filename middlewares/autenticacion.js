var jwt = require('jsonwebtoken');

var SEDD = require('../config/config').SEDD;

// =====================================================
// Verificar Token
// =====================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEDD, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
}