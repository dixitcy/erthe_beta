
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo   = require('mongoskin');





var PORT = 5000;
var DB   = 'localhost:27017/msgdb'
var COLL = 'messages'
var UCOLL = 'users'
var HYPCOLL = 'hypes'
var HYPMARKCOLL = 'hypemarkers'

msgColl = mongo.db(DB, { safe: true }).collection(COLL)
usrColl = mongo.db(DB, { safe: true }).collection(UCOLL)
hypeColl = mongo.db(DB, { safe: true }).collection(HYPCOLL)
hypemarkersColl = mongo.db(DB, { safe: true }).collection(HYPMARKCOLL)


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
app.get('/getplaceposts/:placeid/:place', routes.getplaceposts(msgColl));
app.get('/gethypeposts/:name', routes.gethypeposts(hypeColl));
app.get('/markers', routes.markers(hypemarkersColl));

app.post('/likeupdate', routes.likeupdate(msgColl));
app.post('/messages', routes.postmessage(msgColl));
app.post('/signup', routes.signup(usrColl));
app.post('/sethype', routes.sethype(hypeColl,hypemarkersColl));
app.post('/posttohype', routes.posttohype(hypeColl));

app.listen(PORT, function() {
	console.log("Listening on " + PORT);
});
