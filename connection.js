const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('/home/anupam/sqldb/portfolio.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

db.serialize(() => {
  db.each(`select * from posts`, (err, row) => {
     if (err) {
       console.error(err.message);
     }
     console.log(row.id + "\t" + row.title + "\t" + row.client + "\t" + row.project_date);
   });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
