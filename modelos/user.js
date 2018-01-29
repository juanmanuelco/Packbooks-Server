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

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

//funcionn de editar usuarios
module.exports.editUsuario=function(req,res){
	//extrae los valores de los inputs del formulario de modificar
	var nombre = req.body.nombre;
    var username = req.body.username;
	var telefono = req.body.telefono;
	var correo = req.body.correo;
	var password = req.body.password;
	//encriptacion de la contraseña ya que el sistema funciona con la contraseña encriptada
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(password,salt,function(err,hash){
			//contraseña encriptada
			password=hash;
			//console.log(password);
			//los guarda
			var objeto = {
				username:username,
				password: password,
				telefono: telefono,
				correo: correo
			}
			//limpia la contrasena o la elimina para la nueva contrasena
			if(password && password.trim()===""){delete (objeto['password'])}
			//console.log(password);
			var query = {'nombre':nombre}
			console.log(query)
			//actualiza los datos
			User.findOneAndUpdate(query,objeto, { new: false }, function (err, userUpdated) {
				//console.log(userUpdated['password'])
				if (err) {
					res.render('500', { error: 'Error al actualizar el cliente'})
				} else {
					//console.log(userUpdated); //para saber si recibe algo
					if (!userUpdated) {
						res.render('404', {error: "No se ha podido actualizar el usuario (Error 404)"});
					} else {
						req.session['success'] = 'Usuario actualizado con exito';
						res.redirect('/');
					}
				}
			})
		})
	})
	
}

//funcion para eliminar los usuarios
module.exports.deleteUsuario=function(req,res){
	// es para sabir si recibe lago el body console.log(req.body)
	//asi mismo extrae los valores
	
	var nombre= req.body.nombre;
	var query = { 'nombre': nombre };
	console.log(query)
	//eimina al usuario dependiendo del username o el nombre de usuario
    User.findOneAndRemove(query, function (err, userUpdated) {
		console.log(userUpdated)
        if (err) {
			res.render('500', { error: "Error al borrar el cliente" });
			console.log('error')
        } else {
            if (!userUpdated) {
				res.render('500', {error: "No se ha podido borrar el cliente"});
				console.log('no se pudo')
            } else {
				req.session['success_client'] = 'Cliente eliminado con éxito';
				console.log('exito')
                res.redirect('/');
            }
        }
	});
}