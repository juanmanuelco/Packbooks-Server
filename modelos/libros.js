var mongoose = require('mongoose');

var LibroSchema=mongoose.Schema({
    id:String,
    nombre:String,
    autor:String,
    editorial:String,
    fechaPub:String,
    fechaSub:Date,
    categoria:String,
    subidoPor:String,
    libro:String,
    tipo:String
});

var Libro = module.exports = mongoose.model('Libro', LibroSchema);