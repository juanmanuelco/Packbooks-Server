
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../modelos/user');
var nodemailer = require('nodemailer');




router.get('/loginadmin', function(req, res){
	res.render('loginadmin');
});



function cadenaAleatoria() {
    longitud = 16
    caracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    cadena = ""
    max = caracteres.length - 1
    for (var i = 0; i < longitud; i++) { cadena += caracteres[Math.floor(Math.random() * (max + 1))]; }
    return cadena;
}

var smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: { user: 'packbooksecuador@gmail.com', pass: 'abc123.....' }
});

router.post('/login',(req,res)=>{
    usernme=req.body.username
    password=req.body.password
    User.findOne().where({username:usernme},{confirmado:true}).exec((err,resp)=>{
        if(err)
            res.send('Error 1')
        else{
            if(resp){
                if(resp.confirmado){
                    bcrypt.compare(password, resp.password, (err, isMatch)=> {
                        if(isMatch){
                            usuarioLogeado=req.body.username; 
                            res.send(resp)
                        }else
                            res.send('Error 2')
                    });
                }
                else
                    res.send('Error 4')
            }else
                res.send('Error 3');           
        }
    });
});
router.post('/registrarse',(req,res)=>{
	if(req.body.password!=req.body.reppass)
        res.send('Error 2')
    else{ 
        User.findOne({$or:[{'username': req.body.username},{'email':req.body.correo},{'telefono':req.body.telefono}]},
		'username correo telefono', (err, resultado)=> {
			if (err)
                res.send('Error 1')
            else{
                if(resultado!=null)
				    res.send('Error 3')
                else{
                    var newUser = new User({
                        nombre:req.body.nombre,
                        ape:req.body.ape,
                        username:req.body.username,
                        correo:req.body.correo,
                        telefono:req.body.telefono,
                        password:req.body.password,
                        token:cadenaAleatoria(),
                        confirmado:false,
                        fecha:Date.now(),
                        esadmin:false
                    });
                    User.createUser(newUser, (err, user)=>{
                        if(err)
                            res.send('Error 1')
                        else{
                            var mailOptions = {
                                from: 'Packbooks',to: user.correo,
                                subject: 'Token de confirmación de su cuenta',
                                text: 'Para terminar de crear su cuenta ingrese este token : ' + user.token
                            }
                            smtpTransport.sendMail(mailOptions, (err, resp)=> {
                                if (err)
                                    res.send('Error 1')
                                else
                                    res.send('ok')                                
                            });
                        }
                    });
                }
            }			
		});		
	}
});
router.post('/confirmar',(req,res)=>{
    User.findOne().where({correo:req.body.correo}).exec((err,resp)=>{
        if(err)
            res.send('Error 1')       
        else{
            if (resp){
                if(resp.confirmado)
                    res.send('Error 5');
                else{
                    if(resp.token==req.body.token){
                        User.findOneAndUpdate({username: resp.username }, { confirmado: true, token: cadenaAleatoria()},(err)=>{
                            if (err)
                                res.send('Error 1')
                            else
                                res.send('ok')
                        });              
                    }else
                        res.send('Error 3');
                }
            }else
                res.send('Error 2');
        }
    });
});

router.post('/olvido',(req, res)=>{
    User.findOne().where({correo:req.body.correo}).select('username correo token').exec((err,resp)=>{
        if(err)
            res.send('Error 1')
        else{
            if(resp){
                var mailOptions = {
                    from: 'Packbooks',
                    to: req.body.correo,
                    subject: 'Token para la recuperación de su cuenta',
                    text: 'Para recuperar su cuenta ingrese este token : ' + resp.token
			    }
                smtpTransport.sendMail(mailOptions, function (err, resp) {
                    if (err) 
                        res.send('Error 1') 
                    else
                        res.send('ok')
                });
            }else
                res.send('Error 2')
        }
    });
});

router.post('/recuperar',(req,res)=>{
    User.findOne().where({correo:req.body.correo}).select('username correo token').exec((err,resp)=>{
        if(err){res.send('Error 1')}
        else{
            if(resp){
                if(req.body.token==resp.token){
                    if(req.body.password==req.body.password2){
                        bcrypt.genSalt(10, (err, salt)=> {
                            if(err)
                                res.send('Error 1')
                            else{
                                bcrypt.hash(req.body.password, salt, function (err, hash) {
                                    if(err)
                                        res.send('Error 1')
                                    else{
                                        User.findOneAndUpdate({ username: resp.username }, {password: hash,	token: cadenaAleatoria()
                                        }, (err)=> {
                                            if (err)
                                                res.send('Error 1')
                                            else
                                                res.send('ok');                                       
                                        });
                                    }
                                });
                            }
                        });
                    }else
                        res.send('Error 3');                   
                }
            }else
                res.send('Error 2')
        }
    });
});
router.post('/eliminar',(req,res)=>{
    User.findOneAndRemove().where({'username':req.body.user}).exec((err)=>{
        if(err)
            res.send('Error 1')
        else
            res.send('ok');       
    });
});

router.post('/cambiar_contra',(req,res)=>{
    var pass1=req.body.pass;
    var pass2=req.body.pass2;
    var user=req.body.user;
    if(pass1==pass2){
        bcrypt.genSalt(10,  (err, salt)=> {
            if(err)
                res.send('Error 1')
            else{
                bcrypt.hash(req.body.pass, salt,  (err, hash) =>{
                    if(err)
                        res.send('Error 1')
                    else{
                        User.findOneAndUpdate({ username: user }, {password: hash,	token: cadenaAleatoria()
                        },  (err)=> {
                            if (err)
                                res.send('Error 1')
                            else
                                res.send('ok');                           
                        });
                    }
                });
            }
        });
    }else
        res.send('Error 2');
});

passport.use(new LocalStrategy(
	function(username, password, done) {
	 User.getUserByUsername(username, function(err, user){
		 if(err) throw err;
		 if(!user){
			 return done(null, false, {message: 'Unknown User'});
		 }
  
		 User.comparePassword(password, user.password, function(err, isMatch){
			 if(err) throw err;
			 if(isMatch){
				 return done(null, user);
			 } else {
				 return done(null, false, {message: 'Invalid password'});
			 }
		 });
	 });
}));
  
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
	  done(err, user);
	});
});
  
router.post('/loginadmin',
	passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/loginadmin',failureFlash: true}),
	function(req, res) {
	  res.redirect('/');
});
  
router.get('/logoutadmin', function(req, res){
	  req.logout();
      console.log('salistes')  
	  req.flash('success_msg', 'You are logged out');
  
	  res.redirect('/users/loginadmin');
});

module.exports = router;