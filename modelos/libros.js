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

module.exports.deleteLibreria=function(req,res){
	// es para sabir si recibe lago el body console.log(req.body)
	//asi mismo extrae los valores
	
	var nombre= req.body.nombre;
	var query = { 'nombre': nombre };
	console.log(query)

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
}