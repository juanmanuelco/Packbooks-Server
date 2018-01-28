express = require('express');
router = express.Router();
var User = require('../modelos/user');
router.get('/',(req,res)=>{
    User.find().where({esadmin:false}).exec((error, usuarios)=>{
        if(error)
            res.render('500',{error:error})
        else    
            res.render('index', {usuario:usuarios})
    })
});

module.exports = router;