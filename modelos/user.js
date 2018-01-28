var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    nombre:String,
    ape:String,
    username:String,
    correo:String,
    telefono:String,
    password:String,
	token:String, 
	confirmado:Boolean,
	fecha_creacion:Date,
	esadmin:Boolean
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}
