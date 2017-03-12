var express = require('express');
var router = express.Router();
var multer = require('multer'),
	cloudinary = require('cloudinary'),
    original="";
    var Libro = require('../models/libros');

cloudinary.config({cloud_name: 'packbooks', api_key: '422278622363686', api_secret: 'JCX3Zpg0p8LkG-h6IiBpRZqZOjo'});

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
        if(err){res.send(err)}
        else{
            cloudinary.uploader.upload(
                "public/"+req.body.tipo+"/"+req.body.por+".pdf",
                function(result) { 
                     var libroSchema=new Libro({
                        id:req.body.nombre+'-'+req.body.por+'-'+ new Date(),
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

router.get('/obtener-publicos',function(req,res){
    Libro.find().exec(function(err,resp){
        res.send(resp);
    });
});

module.exports = router;