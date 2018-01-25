var express = require('express');
var app = express();
var helmet = require('helmet');
app.use(helmet());

//=====================================
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
app.use(logger('dev'));
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// initialization of session middleware

app.use(session({
     name :'vibchat',
     secret: 'myAppSecret', // encryption key
     resave: true,
     httpOnly : true,
     saveUninitialized: true,
     cookie: { secure: false }
}));


//=====================================
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost/vibchatapp",{
  useMongoClient: true,
});

mongoose.connection.on('connected', () => {
     console.log('Mongoose connected to mongodb://localhost/vibchatapp');
});

mongoose.connection.on('error',(err) => {
     console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
     console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
     mongoose.connection.close(() => {
          console.log('Mongoose disconnected through app termination');
          process.exit(0);
     });
});

//=====================================
var server = app.listen(3000, () => {
     console.log("listening on port 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

//=====================================

app.use(express.static('client'));

const fs = require('fs');

fs.readdirSync('./app/model').forEach( (file) => {
     if (file.indexOf('.js')) {
          require('./app/model/'+file);
     }
});

const userRoute = require('./app/controller/user.js');
userRoute.controller(app);
const chatRoute = require('./app/controller/chatmsg.js');
chatRoute.controller(app);

const socketInstance = require('./app/socket.js');
socketInstance.controller(server);
