
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
		var myarray = [];
		body = req.body;
		console.log("question tag  " + body.question);
		msg  = body.msg; date = body.date;
		country = body.country;
		state = body.state;
		state_district = body.state_district;
		county = body.county;
		city = body.city;
		road = body.road;
		likes = body.likes;
		url = body.url;
		if (body.news === 1) {
			myarray.push("news");
		} 
		if (body.question === 1) {
			myarray.push("question");
		}
		if (body.opinion === 1) {
			myarray.push("opinion");
		}
		if (body.confession === 1) {
			myarray.push("confession");
		}
		if (body.other === 1) {
			myarray.push("other");
		}
		



		if( msg && date) {
			msg = {
				country: country,
				state: state,
				state_district: state_district,
				county: county,
				city: city,
				road: road,
				msg:  msg,
				url: url,
				likes: likes,
				date: date,
				tags: myarray,
				
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

exports.signup = function(usrColl){
	return function (req, res){
		body = req.body;
		console.log("in user");
		var unique = false;
		username = body.username;
		email = body.email;
		password = body.password;
		console.log(password + " password");



		if( email && password) {
			user = {
				
				username : username,
				email : email,
				password : password,
			} 
		
		
			console.log("user saved");
		
		
				usrColl.insert(user, {}, function() {
					res.send("Inserted message!"); 
				});
		
		

	};
}
}


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

exports.gethypeposts = function(hypeColl){
	return function (req, res){

	  	hypeColl.find({ "hype" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				console.log(err);
				return res.send('err');
			}
			console.log(items);
			
			res.json(items);
		});		
	}
}


exports.getplaceposts = function(msgColl){
	return function(req, res){
		id =req.params.placeid;
		var place = req.params.place;
		

	  	console.log("YOLO MOFO  "+ id+' '+place);

				if(id == 5){
	  	msgColl.find({ "country" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				console.log(err);
				return res.send('err');
			}
			console.log(items);
			
			res.json(items);
		});
	  	} else if(id == 4){
	  		msgColl.find({ "state" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			
			res.json(items);
		});

	  	}else if(id == 6){
	  		msgColl.find({ "road" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			
			res.json(items);
		});
	  		
	  	}else if(id == 3){
	  	msgColl.find({ "state_district" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			
			res.json(items);
		});

	  	}else if(id == 2){
	  	msgColl.find({ "county" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			
			res.json(items);
		});

	  	}else if(id == 1){
	  		msgColl.find({ "city" : place }, { sort: {likes: -1}}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			res.json(items);
		});
	  	}else if(id == 0){
	  		msgColl.find().sort({likes: -1}).toArray(function(err, items) {
			if(err) {
				return res.send('err');
			}
			
			res.json(items);
		});
	  	}else{
	  		
				res.send('err');
			
			
			
	  	}
	  	
	}
};