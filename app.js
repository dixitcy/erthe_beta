
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo   = require('mongoskin');
var passport = require('passport');
var flash 	 = require('connect-flash');




var PORT = 5000;
var DB   = 'localhost:27017/msgdb'
var COLL = 'messages'

msgColl = mongo.db(DB, { safe: true }).collection(COLL)


var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'static'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());


app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'jade');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Cookie testing
app.get('/name/:name', function (req, res){
	req.session.name = req.params.name;
	res.send('<p>To see the session in action, <a href="/name">Go here</a></p>');
});
app.get('/name', function (req, res){
	res.send(req.session.name);
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/messages.json', routes.messages(msgColl));
app.get('/getplaceposts/:placeid/:place', routes.getplaceposts(msgColl));

app.post('/likeupdate', routes.likeupdate(msgColl));
app.post('/messages', routes.postmessage(msgColl));

app.listen(PORT, function() {
	console.log("Listening on " + PORT);
});
