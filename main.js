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

app.get('/',function(req,res){
    res.render("home")
});
app.get('/project',function(req,res){
  res.render("projects")
});
app.get('/add',function(req,res){
    res.render("add")
});
app.get('/edit',function(req,res){
    res.render("edit")
});
app.get('/admin',function(req,res){
    res.render("admin")
});
app.post('/project/add',function(req,res){
  console.log(req.body)
  db.serialize(() => {
  db.each(`insert into posts values (null,'${req.body.title}','${req.body.service}','${req.body.client}','${req.body.desc}','${req.body.date}','${req.body.file}')`);
  });
  res.send("data send");
});
app.listen(5000);
