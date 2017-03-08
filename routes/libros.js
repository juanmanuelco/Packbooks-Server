var express = require('express');
var router = express.Router();
var multer = require('multer'),
	cloudinary = require('cloudinary'),
    original="";
    var Libro = require('../models/libros');

cloudinary.config({cloud_name: 'packbooks', api_key: '422278622363686', api_secret: 'JCX3Zpg0p8LkG-h6IiBpRZqZOjo'});

router.post('/subida',function(req,res){
    var nombre=req.body.nombre;
    var autor=req.body.autor;
    var editorial=req.body.editorial;
    var publicacion=req.body.publicacion;
    var categoria=req.body.categoria;
    var por=req.body.subidoPor;
    var tipo=req.body.tipo;
    console.log(req.body)
    var storage = multer.diskStorage({
	destination: function (req, file, cb) {cb(null, 'public/'+tipo)},
        filename: function (req, file, cb) { cb(null, por+'.pdf');}
    });

    var upload = multer({ storage: storage, fileFilter:function(req, file, cb){
            if(file.mimetype=='application/pdf'){cb(null, true);}else{cb(null, false);}
        }}).single('book');
    upload(req, res, function (err) {
        if(err){res.send('Error 1')}     
        else{
            cloudinary.uploader.upload('public/'+tipo+'/'+por+'.pdf',
                function(result) {
                    var libroSchema=new Libro({
                        id:nombre+'-'+por+'-'+Date.now(),
                        nombre: nombre,
                        autor:autor,
                        editorial:editorial,
                        fechaPub:publicacion,
                        fechaSub:Date.now(),
                        categoria:categoria,
                        subidoPor:por,
                        libro:result.url,
                        tipo:tipo
                    });
                    libroSchema.save(function(err){
                        if(err){res.send('Error 1')}else{res.send('ok')}
                    })
                },{public_id: tipo+'/'+nombre+'-'+por+'-'+Date.now()+'.pdf'} 
            )
        } 
    });
});


module.exports = router;