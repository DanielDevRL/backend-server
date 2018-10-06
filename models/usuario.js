var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValido = {
    values: ['ADMIN_ROLE', 'USER_ROL'],
    message: '{VALUE} no es un rol valuido'
};


var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El Nombre es Requerido'] },
    email: { type: String, unique: true, required: [true, 'El Email es Requerido'] },
    password: { type: String, required: [true, 'El password es Requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValido },

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser Unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);