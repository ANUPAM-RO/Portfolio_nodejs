const express = require('express');
const router = express.Router();

// router.get('/',function(req,res){
//     res.render("home");
// });
// router.get('/project',function(req,res){
//     res.render("projects")
//   });
  router.get('/add',function(req,res){
      res.render("add")
  });


module.exports = router;
