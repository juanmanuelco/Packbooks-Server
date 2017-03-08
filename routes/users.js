var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var nodemailer = require('nodemailer');

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

var smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: { user: 'packbooksecuador@gmail.com', pass: 'abc123.....' }
});

router.post('/login',function(req,res){
    var usernme=req.body.username,password=req.body.password;
    User.findOne().where({username:usernme},{confirmado:true}).exec(function(err,resp){
        if(err){res.send('Error 1')}else{
            if(resp){
                if(resp.confirmado){
                    bcrypt.compare(password, resp.password, function(err, isMatch) {
                        if(isMatch){usuarioLogeado=req.body.username; res.send(resp)}//Inicia sesión
                        else{res.send('Error 2')}//Contraseña incorrecta
                    });
                }
                else{
                    res.send('Error 4')
                }
            }else{
                res.send('Error 3');
            }
            
        }
    });
});

router.post('/registrarse',function(req,res){
	if(req.body.password!=req.body.reppass){res.send('Error 2');}else{ // No coincide
        User.findOne({$or:[{'username': req.body.username},{'email':req.body.correo},{'telefono':req.body.telefono}]},
		'username correo telefono', function (err, resultado) {
			if (err){res.send('Error 1')}else{
                if(resultado!=null){
				res.send('Error 3');//Ya existe
                }else{
                    var newUser = new User({
                    nombre:req.body.nombre,
                    ape:req.body.ape,
                    username:req.body.username,
                    correo:req.body.correo,
                    telefono:req.body.telefono,
                    password:req.body.password,
                    token:cadenaAleatoria(),
                    confirmado:false,
                    fecha:Date.now()
                    });
                    User.createUser(newUser, function(err, user){
                        if(err){res.send('Error 1')}
                        else{
                            var mailOptions = {
                                from: 'Packbooks',to: user.correo,
                                subject: 'Token de confirmación de su cuenta',
                                text: 'Para terminar de crear su cuenta ingrese este token : ' + user.token
                            }
                            smtpTransport.sendMail(mailOptions, function (err, resp) {
                                if (err){res.send('Error 1')}else{
                                    console.log(resp);
                                    console.log('Correo enviado')
                                    res.send('ok')
                                }
                            });
                        }
                    });
                }
            }			
		});		
	}
});

router.post('/confirmar',function(req,res){
    User.findOne().where({correo:req.body.correo}).exec(function(err,resp){
        if(err){res.send('Error 1')}
        else{
            if (resp){
                console.log(resp)
                if(resp.confirmado){
                    res.send('Error 5');
                }else{
                    if(resp.token==req.body.token){
                        User.findOneAndUpdate({username: resp.username }, { confirmado: true, token: cadenaAleatoria()},function(err){
                            if (err){res.send('Error 1')}
                            else{res.send('ok')}
                        });              
                    }else{
                        res.send('Error 3');
                    }
                }
            }else{
                res.send('Error 2');
            }
        }
    });
});

router.post('/olvido',function(req, res){
    User.findOne().where({correo:req.body.correo}).select('username correo token').exec(function(err,resp){
        if(err){console.log('1');res.send('Error 1')}
        else{
            if(resp){
                var mailOptions = {
                    from: 'Packbooks',
                    to: req.body.correo,
                    subject: 'Token para la recuperación de su cuenta',
                    text: 'Para recuperar su cuenta ingrese este token : ' + resp.token
			    }
                smtpTransport.sendMail(mailOptions, function (err, resp) {
                    if (err) { console.log('1');res.send('Error 1') }
                    else{res.send('ok')}
                });

            }else{
                res.send('Error 2')
            }
        }
    });
});

router.post('/recuperar',function(req,res){
    User.findOne().where({correo:req.body.correo}).select('username correo token').exec(function(err,resp){
        if(err){res.send('Error 1')}
        else{
            if(resp){
                if(req.body.token==resp.token){
                    if(req.body.password==req.body.password2){
                        bcrypt.genSalt(10, function (err, salt) {
                            if(err){res.send('Error 1')}else{
                                bcrypt.hash(req.body.password, salt, function (err, hash) {
                                    if(err){res.send('Error 1')}else{
                                        User.findOneAndUpdate({ username: resp.username }, {password: hash,	token: cadenaAleatoria()
                                        }, function (err) {
                                            if (err){res.send('Error 1')}else{
                                                res.send('ok');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{res.send('Error 3');}
                }
            }else{res.send('Error 2');}
        }
    });
});



module.exports = router;