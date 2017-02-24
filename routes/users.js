var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');

function cadenaAleatoria(longitud, caracteres) {
    longitud = longitud || 16; 
    caracteres = caracteres || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";     
	var cadena = "",
     max = caracteres.length-1; 
     for (var i = 0; i<longitud; i++) {
         cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
        }
    return cadena; 
}

router.get('/login',function(req,res){res.send('Inicia sesión')});

router.get('/registrarse',function(req,res){res.send('Registrate')});

router.post('/login',function(req,res){
    var usernme=req.body.username,password=req.body.password;
    User.findOne().where({username:usernme}).exec(function(err,resp){
        if(err){res.send('Error 1')}else{
            if(resp){
            bcrypt.compare(password, resp.password, function(err, isMatch) {
                    if(isMatch){res.send(resp)}
                    else{res.send('Error 2')}//Contraseña incorrecta
                });
            }else{
                res.send('Error 3');
            }
            
        }
    });
});


router.post('/registrarse',function(req,res){
	if(req.body.password!=req.body.reppass){res.send('Error 1');
	}else{
		User.findOne({$or:[{'username': req.body.username},{'email':req.body.email},{'telefono':req.body.telefono}]},
		'username email telefono', function (err, resultado) {
			if (err){res.send('Error 1')}else{
                if(resultado!=null){
				res.send('Error 2');
                }else{
                    var newUser = new User({
                    nombre:req.body.nombre,
                    ape:req.body.ape,
                    username:req.body.username,
                    correo:req.body.email,
                    telefono:req.body.telefono,
                    password:req.body.password,
                    token:cadenaAleatoria(),
                    confirmado:false,
                    fecha:Date.now()
                    });
                    User.createUser(newUser, function(err, user){
                        if(err){res.send('Error 1')}else{res.send('ok');}   
                    });
                }
            }			
		});	
	}
});

module.exports = router;