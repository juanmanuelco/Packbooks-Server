var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    nombre:{type:String},
    ape:{type:String},
    username:{type:String, index:true, id:true},
    correo:{type:String},
    telefono:{type:String},
    password:{type:String},
	token:{type:String}, 
	confirmado:{type:Boolean},
	fecha_creacion:{type: Date, default: Date.now}
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
