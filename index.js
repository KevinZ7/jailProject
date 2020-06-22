const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const { resourceUsage } = require('process');
const { Console } = require('console');

var pool = new Pool({
  connectionString: 'postgres://postgres:password@localhost/ass2'
  // user:"postgres",
  // host:"localhost",
  // database:"ass2",
  // password:"password",
  // port:5432
});
var app = express();
app.use(express.json());
// app.use(express.bodyParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render('pages/main'));

app.get('/visitcriminal',(req,res) => {
  res.render('pages/visit');
})

app.post('/addcriminal', (req,res) =>{
  var data = req.body;

  var userQuery1 = 'SELECT * FROM criminal WHERE sin = $1';
  pool.query(userQuery1,[data.sin],(error,result) => {
    if (error)
      res.end(error);

    var results = {'rows':result.rows};
    if(results.rows.length  == 0){
      var userQuery = `INSERT INTO criminal(name,size,height,sin,type,image)values($1,$2,$3,$4,$5,$6)`;
      pool.query(userQuery,[data.name,data.size,data.height,data.sin,data.type,data.image],(error,result) => {
        if (error)
          res.end(error);
      })
    
      res.send();
    }
    else{
      res.send("error");
    }
  })
})






app.get('/listcriminal' , (req,res) =>{
  var userQuery = 'SELECT * FROM criminal';
  pool.query(userQuery,(error,result) => {
    if(error)
      res.end(error);
    var results = {'rows':result.rows};
    res.send(results);
  })
})

app.post('/editcriminal', (req,res) =>{
  var data = req.body;
  var oldsin = data.sin;
  


  var userQuery1 = 'SELECT * FROM criminal WHERE sin = $1';
  pool.query(userQuery1,[data.sin],(error,result) => {
    if(error)
      res.end(error);
    
    var results = {'rows':result.rows};

  
      var userQuery2 = 'UPDATE criminal SET name=($1),size=($2),height=($3),type=($4),image=($5) WHERE sin=($6)';
      pool.query(userQuery2,[data.name,parseFloat(data.size),parseFloat(data.height),data.type,data.image,oldsin.toString(10)],(error,result) => {
        if (error){
          console.log("error1");
          res.end(error);
        }

      })
      res.send();


  })
})

app.post('/geteditinfo', (req,res) =>{
  var data = req.body;
  var oldsin = data.sin;


  var userQuery1 = 'SELECT * FROM criminal WHERE sin = $1';
  pool.query(userQuery1,[String(oldsin)],(error,result) =>{

    var results = {'rows':result.rows};
    if(error)
      res.end(error);
    res.send(results.rows[0]);
  })
})

app.post('/deletecriminal', (req,res) =>{
  var data = req.body;
  var sin = data.sin;

  var userQuery1 = 'DELETE FROM criminal WHERE sin = $1';
  pool.query(userQuery1,[sin],(error,result) =>{

    var results = {'rows':result.rows};
    if(error)
      res.end(error);
    res.send();
  })
})

app.get('/visitcriminal',(req,res) => {
  res.render('pages/visit');
})

app.get('/getallcriminals',(req,res) => {
  var userQuery = 'SELECT * FROM criminal';
  pool.query(userQuery,(error,result) =>{
    var results = {'rows':result.rows};
    if(error)
      res.end(error);
    
    res.send(results.rows);
  })
})

app.post('/gettypecriminals',(req,res) => {
  var data = req.body;
  var userQuery = "SELECT * FROM criminal WHERE type = $1";
  pool.query(userQuery,[String(data.type)],(error,result) =>{
    var results = {'rows':result.rows};
    if(error)
      res.end(error);
    res.send(results.rows);
  })
})














app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


