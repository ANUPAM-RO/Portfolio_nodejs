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
app.post('/project/add',function(req,res){
  console.log(req.body)
  db.serialize(() => {
  db.each(`insert into posts values ('${req.body.id}','${req.body.title}','${req.body.service}','${req.body.client}','${req.body.desc}','${req.body.date}','${req.body.image}')`);
  });
  res.render('admin');
});

app.post('/project/edit',function(req,res){
  console.log(req.body)
  db.serialize(() => {
  db.run(`update posts set title = '${req.body.title}', service = '${req.body.service}',client = '${req.body.client}',description = '${req.body.desc}', project_date = '${req.body.date}', image = '${req.body.image}'  where id = '${req.body.id}'`,(err,result)=>{
    if (err) throw err; 

 });
 res.render('admin',{data: result});
  });
  
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
    console.log(arr)
      res.render('admin',{data: arr});
    });
    });    
});
app.get('/',function(req,res){
  db.serialize(() => {
    db.all(`select image, title, client from posts`,(err,result)=>{
      if(err) throw err;
      // console.log(result)
      const arr = [];
      result.forEach((row) => {
        arr.push(row);

    })
    console.log(arr)
      res.render('home',{data: arr});
    });
    });    
});

app.get('/project/:id',function(req,res){
  db.serialize(() => {
    db.all(`select image from posts where id = '${req.body.id}'`,(err,result)=>{
      if(err) throw err;
      // console.log(result)
      const arr = [];
      result.forEach((row) => {
        arr.push(row);

    })
    console.log(arr)
      res.render('projects',{data: arr});
    });
    });    
});
app.get('/delete',function(req, res){
db.all(`DELETE FROM posts WHERE id='${req.body.id}`,req.body.id,(err,rs)=> {
  if (err) throw err;
  else{
    res.redirect('admin',{data: rs});
  }
});
});
app.listen(4000);
