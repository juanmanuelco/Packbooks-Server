express = require('express');
router = express.Router();
var User = require('../modelos/user');

Libro = require('../modelos/libros');


router.get('/libro',ensureAuthenticated, (req,res)=>{
    Libro.find({}, function (err, libros) {
		res.render('libro', { libro: libros });
	});
});

router.post('/deleteUsuario', ensureAuthenticated,User.deleteUsuario)
router.post('/editUsuario', ensureAuthenticated,User.editUsuario)
router.post('/deleteLibreria', ensureAuthenticated, (req,res)=>{
    var nombre= req.body.nombre;
	var query = { 'nombre': nombre };
	console.log(query)
//si le pongo {} en vez de query  si salen datos y elimina pero no se si todos 
//
    Libro.findOneAndRemove(query, function (err, LibUpdate) {
        
        console.log(LibUpdate)
		console.log(err)
        if (err) {
			res.render('500', { error: "Error al borrar el libro" });
			console.log('error')
        } else {
            if (!LibUpdate) {
				//res.render('500', {error: "No se ha podido borrar el libro"});
                console.log('no se pudo')
                res.redirect('/libro');
            } else {
				req.session['success_client'] = 'Libro eliminado con éxito';
				console.log('exito')
                res.redirect('/libro');
            }
        }
	});
})

router.get('/',ensureAuthenticated, (req,res)=>{
    User.find().where({esadmin:false}).exec((error, usuarios)=>{
        if(error)
            res.render('500',{error:error})
        else    
            res.render('index', {usuario:usuarios})
    })
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
        return next();
        console.log('logeado')
	} else {
        //req.flash('error_msg','You are not logged in');
        console.log('no logeastes')
		res.redirect('/users/loginadmin');
	}
}



module.exports = router;