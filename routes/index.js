var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.send('Estas adentro');
});
module.exports = router;