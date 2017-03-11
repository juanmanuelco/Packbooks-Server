var express = require('express');
var router = express.Router();
var multer = require('multer'),
	cloudinary = require('cloudinary'),
    original="";
    var Libro = require('../models/libros');

cloudinary.config({cloud_name: 'packbooks', api_key: '422278622363686', api_secret: 'JCX3Zpg0p8LkG-h6IiBpRZqZOjo'});
/*
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
*/
//Crea una oferta__________________________________________________________________________
router.post('/subida',function(req,res){
    var storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, 'public/'+req.body.tipo)},
        filename: function (req, file, cb) {cb(null, req.body.por+'.pdf')}
    });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='application/pdf'){cb(null, true);}else{cb(null, false);}
    }}).single('book');
    upload(req, res, function (err) {
        if(err){res.render('500',{error:err})}
        else{
            cloudinary.uploader.upload(
                "public/"+req.body.tipo+"/"+req.body.por+".pdf",
                function(result) { 
                    console.log(result);
                    var imagenOferta=result.url;
                    console.log(req.body)
                     var libroSchema=new Libro({
                        id:req.body.nombre+'-'+req.body.por,
                        nombre: req.body.nombre,
                        autor:req.body.autor,
                        editorial:req.body.editorial,
                        fechaPub:req.body.publicacion,
                        fechaSub:Date.now(),
                        categoria:req.body.categoria,
                        subidoPor:req.body.por,
                        libro:result.url,
                        tipo:req.body.tipo
                    });
                    libroSchema.save(function(err){
                        if(err){res.send('Error 1')}else{res.send('Libro subido en: '+result.url)}
                    })
            },{public_id: req.body.tipo+'/'+req.body.por});
        }
    });
});

module.exports = router;