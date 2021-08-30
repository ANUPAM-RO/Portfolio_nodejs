var express = require('express')
const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))

// open the database
let db = new sqlite3.Database('/home/anupam/sqldb/portfolio.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the Portfolio database.');
});
app.use(require('./router/auth'));
// db.serialize(() => {
//   db.each(`select * from posts`, (err, row) => {
//      if (err) {
//        console.error(err.message);
//      }
//      console.log(row.id + "\t" + row.title + "\t" + row.client + "\t" + row.project_date);
//    });
// });
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

// app.get('/',function(req,res){
//     res.render("home")
// });
// Add a project
app.post('/project/add',function(req,res){
  // console.log(req.body)
  db.serialize(() => {
  db.each(`insert into posts values ('${req.body.id}','${req.body.title}','${req.body.service}','${req.body.client}','${req.body.desc}','${req.body.date}','${req.body.image}')`);
  });
  res.redirect('/admin');
});

app.get('/admin',function(req,res){
  db.serialize(() => {
    db.all(`select image, id , title, service from posts`,(err,result)=>{
      if(err) throw err;
      // console.log(result)
      const arr = [];
      result.forEach((row) => {
        arr.push(row);
        
      })
      // console.log(arr)
      res.render('admin',{data: arr});
    });
  });    
});

app.get('/',function(req,res){
  db.serialize(() => {
    db.all(`select image, title, id, client from posts`,(err,result)=>{
      if(err) throw err;
      // console.log(result)
      const arr = [];
      result.forEach((row) => {
        arr.push(row);
        
      })
      // console.log(arr)
      res.render('home',{data: arr});
    });
  });    
});

app.get('/project/:id',function(req,res){
    db.get("select * from posts where id = ?",req.params.id,(err,result)=>{
      if(err) throw err;
      // const arr = [];
      // result.forEach((row) => {
      //   arr.push(row);
      console.log(result);
      res.render('projects',{data: result});
});
    });
    //Edit a Project
      app.get('/project/edit/:id',function(req,res){
      id = req.params.id;
      const sql = "SELECT * FROM posts WHERE id = ?";
      db.get(sql, id, (err, row) => {
        res.render("edit", { data: row });
      });
    });  
    

app.post('/project/edit/:id',function(req,res){

  const post_id = req.params.id;
  const post = [req.body.title, req.body.service,req.body.client,req.body.desc,req.body.date,req.body.image , post_id];
  db.run("update posts set title = ?, service = ?,client = ?,description = ?, project_date = ?, image = ?  where (id = ?)",post,(err)=>{
    if (err) throw err; 
    res.redirect('/admin');

 });
  });
//Delete a project
app.get('/delete/:id',function(req, res){
db.run(`DELETE FROM posts WHERE id  = ?`,req.params.id,(err,rs)=> {
  if (err) throw err;
 res.redirect('/admin');
  
});
});
app.listen(4000);
