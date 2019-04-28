// Dating App Server file

// Create server-express app

const express = require('express');
const app = express();

// variable declaration
var routes = require('./api');
var user = require('./api/user'); 
var connection  = require('express-myconnection'); 
const mysql = require('mysql');

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true,parameterLimit: 1000000 }));

var expressValidator = require('express-validator');
app.use(expressValidator());
var session = require('express-session');
var flash = require('connect-flash');
app.use(session({ secret: 'parkingtips123@123' }));
app.use(flash());
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
var define = require("node-constants")(exports);
var multipart = require('connect-multiparty');

var multipartobj = multipart();
global.maindir=__dirname;

// Define all constants
global.API_KEY = "Dt1@1#2";

//database connectivity

// local
/*
app.use( 
   connection(mysql,{   
    host: 'localhost',
    user: 'root',
    //~ port:'3306',
    password: '',
    database: 'dating'
    },'pool') //or single
);
*/ 
 
// Server
 app.use(
    connection(mysql,{
	host: 'hostel9685.czqufacnwj4v.us-east-2.rds.amazonaws.com',
    user: 'hostel9685',
    port:3306,
    password: 'hostel9685',
    database: 'datingdb'
    },'pool') //or single
);

// default route
app.get('/', function (req, res){
    return res.send({ error: true, message: 'hello' })
});
app.post('/access_token', user.access_token);
app.post('/registartion', user.registartion);
app.post('/login', user.login);
app.post('/myprofile', user.myprofile);
app.post('/delete_ac', user.delete_ac);
app.post('/pause_ac', user.pause_ac);
app.post('/enable_discovery', user.enable_discovery);
app.post('/privacy', user.privacy);
app.post('/setting', user.setting);
app.post('/logout', user.logout);
app.post('/report_user', user.report_user);
app.post('/viewprofile', user.viewprofile); // view another user profile
app.post('/swipe', user.swipe); 
app.post('/searching', user.searching); 
app.post('/update_prof',multipartobj, user.update_prof);
app.post('/get_language', user.get_language); 
app.post('/question_list', user.question_list); 
app.post('/sendmsg', user.sendmsg); 
app.post('/getchat', user.getchat); 
app.post('/page_content', user.page_content); 
app.post('/chat_list', user.chat_list); 
app.post('/submit_answer', user.submit_answer); 
app.post('/new_dating', user.new_dating); 
app.post('/date_accept', user.date_accept); 
app.post('/date_decline', user.date_decline); 
app.post('/date_cancel', user.date_cancel); 
app.post('/my_dating_list', user.my_dating_list); 
app.post('/dating_specific', user.dating_specific); 

// all other requests redirect to 404
app.all("/link", function (req, res) {
    return res.status(404).send('page not found')
});
 

app.listen(4000, function () {
    console.log('Dating app is running on port 4000');
});
