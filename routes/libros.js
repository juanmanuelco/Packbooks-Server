var express = require('express');
var router = express.Router();
var multer = require('multer'),
	cloudinary = require('cloudinary'),
    original="";
    var Libro = require('../models/libros');

cloudinary.config({cloud_name: 'packbooks', api_key: '422278622363686', api_secret: 'JCX3Zpg0p8LkG-h6IiBpRZqZOjo'});

//Crea una oferta__________________________________________________________________________
router.post('/subida',function(req,res){
    console.log(req.body);
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
                        fechaSub:new Date(),
                        categoria:req.body.categoria,
                        subidoPor:req.body.por,
                        libro:result.url,
                        tipo:req.body.tipo
                    });
                    libroSchema.save(function(err){
                        if(err){res.send('Error 1')}else{res.send('Libro subido en: '+result.url)}
                    })
            },{public_id: req.body.tipo+'/'+req.body.nombre+'-'+req.body.autor+'-'+req.body.publicacion});
        }
    });
});
function revisarNulo(busqueda){return (busqueda==undefined || busqueda==null || busqueda=='');}

router.post('/buscador',function(req,res){
    var usuario=req.body.por;
    var tipo='privado';
    var query;
    var datoaBuscar=req.body.busqueda;
    if(revisarNulo(usuario)){ tipo='publico'}
    var nuevoArray=new Array();
    if(!revisarNulo(datoaBuscar)){
        var palabras=datoaBuscar.split(" ");
        for(var i=0;i<palabras.length;i++){if(palabras[i]!=''){nuevoArray.push(new RegExp (palabras[i],'i'))}}
    }
    if(nuevoArray.length<1){
        
        if(tipo=='publico'){query={'tipo':'publico'}}
        else{query={'tipo':'privado','subidoPor':usuario};}
    }else{
        if(tipo=='publico'){
            query={$and:[{'tipo':'publico'},
                    {$or:[{nombre:{$in:nuevoArray}},
                    {autor:{$in:nuevoArray}},
                    {editorial:{$in:nuevoArray}},
                    {fechaPub:{$in:nuevoArray}},
                    {categoria:{$in:nuevoArray}}
                ]}
            ]}; 
        }else{
            
            query={$and:[{'tipo':'publico'},{'subidoPor':usuario},
                {$or:[{nombre:{$in:nuevoArray}},
                {autor:{$in:nuevoArray}},
                {editorial:{$in:nuevoArray}},
                {fechaPub:{$in:nuevoArray}},
                {categoria:{$in:nuevoArray}}
            ]}
        ]}; 
        }
    }
    var listaResultados=new Array();
    Libro.find().where(query).exec(function(err,resp){
    if(resp==''){res.send("nada")}
    else{
        for(var j=0;j<resp.length;j++){
            listaResultados.push({
                'nombre':resp[j].nombre,
                'autor':resp[j].autor,
                'editorial':resp[j].editorial,
                'fechaPub':resp[j].fechaPub,
                'categoria':resp[j].categoria,
                'libro':resp[j].libro
            })
        }
        console.log(listaResultados)
        res.send(listaResultados);
		}
	});
});

module.exports = router;