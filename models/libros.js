var mongoose = require('mongoose');

var LibroSchema=mongoose.Schema({
    id:{type:String},
    nombre:{type:String},
    autor:{type:String},
    editorial:{type:String},
    fechaPub:{type:Date},
    fechaSub:{type:Date},
    categoria:{type:String},
    subidoPor:{type:String},
    libro:{type:String},
    tipo:{type:String}
});

var Libro = module.exports = mongoose.model('Libro', LibroSchema);