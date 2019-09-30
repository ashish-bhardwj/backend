var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var http=require('http');
var cors=require('cors');
var passport=require('passport');

const {mongoose}=require('../config/db.js')


var booksController=require('../controllers/bookController.js');
var userController=require('../controllers/userController.js');

var app=express();

app.use(bodyParser.json());
app.use(cors({origin:'http://localhost:4200'}));

app.use(passport.initialize());
app.use(passport.session());
require('../config/passport')(passport);

app.use(express.static(path.join(__dirname,'dist')));

app.listen(3000,()=> console.log('server started at port:3000'));

app.use('/books',booksController);

app.use('/users',userController);

// heroku test

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
