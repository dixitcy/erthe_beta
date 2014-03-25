#!/usr/bin/env node

var express = require('express');
var mongo   = require('mongoskin');
var ObjectId = mongo.ObjectID;
var http = require('http');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');

var PORT = 5000;
var DB   = 'localhost:27017/msgdb'
var COLL = 'messages'

var app = express();
app.configure(function() {
	app.use(express.logger());                    // Logging middleware
	app.use(express.bodyParser());                // Used to parse body from post request
	app.use(express.static(__dirname+'/static'))  // Normally we would use a http server like Nginx to server static files but this is fine for now.
});

msgColl = mongo.db(DB, { safe: true }).collection(COLL)

app.get('/messages.json', function(req, res) {
	msgColl.find({}, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		console.log(items.msg);
		res.json(items);
	});
});


app.get('/getplaceposts/:placeid/:place', function(req, res) {
	
	id =req.params.placeid;
	var place = req.params.place;
	

  	console.log("YOLO MOFO  "+ id+' '+place);

			if(id == 5){
  	msgColl.find({ "country" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		
		res.json(items);
	});
  	} else if(id == 4){
  		msgColl.find({ "state" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		
		res.json(items);
	});
  	}else if(id == 3){
  	msgColl.find({ "state_district" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		
		res.json(items);
	});

  	}else if(id == 2){
  	msgColl.find({ "county" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		
		res.json(items);
	});

  	}else if(id == 1){
  		msgColl.find({ "city" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		res.json(items);
	});
  	}else{
  		msgColl.find({}, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		
		res.json(items);
	});
  	}
  	
  	
	
});



app.post('/getlocation',function(req, res){
	console.log("FUCK YEAH !");
	console.log(req.body);
	var mystring = PostCode(req.body.lati,req.body.longi);
	console.log("mystring: " + mystring);
	res.send({msg:''});
});




app.post( '/likeupdate' , function (req, res){
	
	body = req.body;
	likey = body.likeornot;
	id = body.myid;
	o_id = ObjectId(id);
	console.log("likes is" +likey);

	if(likey === 1 ){
	 msgColl.update({ "_id" : o_id },{ $inc : { "likes" : 1}},{}, function(err,obj){
		if (err)
		{
			res.send("Error"+err);  // returns error if no matching object found
		}  else 
		{
			res.send("Inserted");
		}
	 });
	}else{
		msgColl.update({ "_id" : o_id },{ $inc : { "likes" : -1}},{}, function(err,obj){
		if (err)
		{
			res.send("Error"+err);  // returns error if no matching object found
		}  else 
		{
			res.send("Inserted");
		}
	 });

	}
	 
});


app.post('/messages', function (req, res) {
	body = req.body;
	console.log(body);
	msg  = body.msg; date = body.date;
	country = body.country;
	state = body.state;
	city = body.city;
	likes = body.likes;
	url = body.url;

	if( msg && date) {
		msg = {
			country: country,
			state: state,
			city: city,
			msg:  msg,
			url: url,
			likes: likes,
			date: +date
		} 

		msgColl.insert(msg, {}, function() {
			res.send("Inserted message!"); 
		});
	} else {
		res.send("Invalid message");
	}
});


function  PostCode ( lati, longi ) {
	var str = '';

	codestring= http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat='+lati+'&lon='+longi+'&zoom=18&addressdetails=1', function(res){
	 
		console.log('Response is '+res.statusCode);
		res.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
			str += chunk;
		 });

		res.on('end', function () {
			str = JSON.parse(str);
			console.log(str);
		});
		return str;
	});
}

app.listen(PORT, function() {
	console.log("Listening on " + PORT);
});
