
/*
 * GET home page.
 */
var mongo   = require('mongoskin');
var ObjectId = mongo.ObjectID;

exports.index = function(req, res){
  res.render('index.html');
};

exports.postmessage = function(msgColl){
	return function (req, res){
		body = req.body;
		console.log("posted msg body" + body.politics);
		msg  = body.msg; date = body.date;
		country = body.country;
		state = body.state;
		city = body.city;
		likes = body.likes;
		url = body.url;
		verified = body.verified;
		unverified = body.unverified;
		other = body.other;
		politics = body.politics;
		breaking = body.breaking;



		if( msg && date) {
			msg = {
				country: country,
				state: state,
				city: city,
				msg:  msg,
				url: url,
				likes: likes,
				date: date,
				verified : verified,
				unverified : unverified,
				other : other,
				politics : politics,
				breaking : breaking,
			} 

			msgColl.insert(msg, {}, function() {
				res.send("Inserted message!"); 
			});
		} else {
			res.send("Invalid message");
		}

	};
};			

exports.messages = function(msgColl){
	return function(req, res){
		msgColl.find({}, { sort: {likes: -1}}).toArray(function(err, items) {
		if(err) {
			return res.send(err);
		}
		console.log(items.msg);
		res.json(items);
	});
};
};


exports.likeupdate = function(msgColl){
	return function (req, res){
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
	}
};

exports.getplaceposts = function(msgColl){
	return function(req, res){
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
	  	
	}
};