express = require('express');
router = express.Router();
multer = require('multer'),
cloudinary = require('cloudinary'),
original="";
Libro = require('../modelos/libros');


cloudinary.config({cloud_name: 'packbooks', api_key: '422278622363686', api_secret: 'JCX3Zpg0p8LkG-h6IiBpRZqZOjo'});

function revisarNulo(busqueda){return (busqueda==undefined || busqueda==null || busqueda=='');}

router.post('/subida', (req, res) => {
    storage = multer.diskStorage({
        destination: (req, file, cb) => { cb(null, 'recursos/'+req.body.tipo) },
        filename: (req, file, cb) => { cb(null, 'usuario'+req.body.por+'usuario'+req.body.nombre + '-' + req.body.autor + '-' + req.body.publicacion+'.pdf') }
    });
    upload = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            if(file.mimetype=='application/pdf'){cb(null, true);}else{cb(null, false);}
        }
    }).single('book');
    upload(req, res, (err) => {
        if (err){
            res.send('Error')   
        }                 
        else {
            var libroSchema=new Libro({
                nombre: req.body.nombre,
                autor:req.body.autor,
                editorial:req.body.editorial,
                fechaPub:req.body.publicacion,
                fechaSub:new Date(),
                categoria:req.body.categoria,
                subidoPor:req.body.por,
                libro:'/'+req.body.tipo+'/'+req.body.nombre + '-' + req.body.autor + '-' + req.body.publicacion+'.pdf',
                tipo:req.body.tipo
            });
            libroSchema.save((err)=>{
                if(err)
                    res.send('Error 1')
                else
                    res.send('Libro subido')
            })
        }
    })
})

router.post('/buscador',function(req,res){
    usuario=req.body.por;
    tipo='privado';
    query;
    datoaBuscar=req.body.busqueda;
    if(revisarNulo(usuario)) 
        tipo='publico'
    nuevoArray=new Array();
    if(!revisarNulo(datoaBuscar)){
        var palabras=datoaBuscar.split(" ");
        for(var i=0;i<palabras.length;i++){
            if(palabras[i]!='')
                nuevoArray.push(new RegExp (palabras[i],'i'))
        }
    }
    if(nuevoArray.length<1){
        if(tipo=='publico')
            query={'tipo':'publico'}
        else
            query={'tipo':'privado','subidoPor':usuario}
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
    listaResultados=new Array();
    Libro.find().where(query).exec((err,resp)=>{
        if(err)
            res.send('Error 1')
        else{
            if(resp=='')
                res.send("nada")
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
            res.send(listaResultados);
            }
        }
	});
});

router.post('/categoria',(req,res)=>{
    categoria=req.body.categoria;
    Libro.find().where({$and:[{'categoria':categoria},{tipo:'Publico'}]}).exec((err,resp)=>{
        if(err)
            res.send('Error 1')
        else{
            if(resp){
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
                res.send(listaResultados);
            }else
                res.send('nada')           
        }
    });
});
module.exports = router;