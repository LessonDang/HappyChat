var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var chickname = "还未设置";
  if(req.cookies.chat_nickname != null || req.cookies.chat_nickname != ""){
      chickname = req.cookies.chat_nickname;
  }
  res.render('index',{
      ip:req.ip,
      chickname:req.cookies.chat_nickname
  });
});

module.exports = router;
