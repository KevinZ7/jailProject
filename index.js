const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');

var pool = new Pool({
  connectionString: 'postgres://postgres:password@localhost/users'
});
var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render('pages/main'));














app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


