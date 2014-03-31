/**
 * Simple Angular.js app to get started learning and working with the framework.
 */

// Define controller

var lati;
var longi;
var post_length;
angular.module('msgboardApp', ['ngRoute','igTruncate'])




.service('locationAPI', function($http) {

	// Bangalore lat = 12.966509 and longi = 77.593689. For testing
	this.getPlaces = function() {
		return $http({
			method: 'JSONP', 
			url: 'http://nominatim.openstreetmap.org/reverse?format=json&json_callback=JSON_CALLBACK&lat='+lati+'&lon='+longi+'&zoom=18&addressdetails=1'
		});
	}
})


.controller('MsgListCtrl',[ '$scope','$http','$window','locationAPI', function ($scope, $http, $window, locationAPI){
	
	$scope.placesList = [];
	$scope.myplacesList = [];
	$scope.myplaceHierarchy = [];
	$scope.current_place = "Erthe";
	$scope.numLimit = 2;

	var set_markpermission;
	getPosition();
	

  $scope.changeLength = function(wine) {
  	console.log("coming here" + wine.length);
    wine.length = 9999;
}


	/////////////////// Automatic location generator function 
	function getPosition(){
		navigator.geolocation.getCurrentPosition(success, fail,{
				enableHighAccuracy:true,
				timeout:10000,
				maximumAge:Infinity
		});    
	}   

	function success(position) 
	{
		lati = position.coords.latitude;
		longi = position.coords.longitude;
		 console.log("Finally here"+ lati);
		 locationAPI.getPlaces().success(function(response){
			var btr = response.display_name;
			var str = [];
			str = btr.split(", ");
			
			$scope.placesList = response;
			$scope.myplacesList.push('Erthe');
			$scope.myplaceHierarchy.push('');
			$scope.myplacesList.push(response.address.country);
			$scope.myplaceHierarchy.push('country');
			$scope.myplacesList.push(response.address.state);
			$scope.myplaceHierarchy.push('state');
			$scope.myplacesList.push(response.address.state_district);
			$scope.myplaceHierarchy.push('district');
			$scope.myplacesList.push(response.address.city);
			$scope.myplaceHierarchy.push('city');
			$scope.myplacesList.push(response.address.road);
			$scope.myplaceHierarchy.push('road');
			console.log(str[1]);
		});
	}

	function fail(e)
	{
		alert("Your position cannot be found"+e.code+" => "+e.message);
	}
	//////////////////////////////////////////////////////////////////



	
	/////////// Get data with HTTP get request and bind to scope which is seen in the HTML
		$http.get('/messages.json').success(function(data) {
			$scope.msgs = data.map(function(item) {
				item.date = new Date(item.date).toLocaleString(); 
				return item;
			});
		});
	////////////////////////////////////////////////////////////////////////////////
 
 
	////////Function called when submit button is pressed to send data///////////
	$scope.sendMsg = function(depth,list) {
		
		if ($scope.msgUrl) {
			console.log("URL success" + $scope.msgUrl);
		} else{
			url = "#"
		};
		loc = list.address.state;
		console.log('Yoo HOO'+ loc);
		currTime = new Date();
		if(depth === 3){
			mycountry = list.address.country;
			mystate = list.address.state;
			mycity = list.address.city;
		}
		else if(depth === 2){
			mycountry = list.address.country;
			mystate = list.address.state;
			mycity = 'unavailable';
		}
		else{
			mycountry = list.address.country;
			mystate = 'unavailable';
			mycity = 'unavailable';
		}
		
		// Create payload from msg and add date
		payload = {
			date: currTime.valueOf(), // milliseconds since epoch
			msg:  $scope.currMsg,
			url: $scope.msgUrl,
			likes: 0,
			country: mycountry,
			state: mystate,
			city: mycity
		}
		// Send post request to server to insert into mongodb
		$http.post('messages', payload).success(function() {
			payload.date = currTime.toLocaleString();
			// Add to current array of msgs for pseudo live update
			$scope.msgs.unshift(payload); 

		});
		$scope.currMsg = "";
		
	}
	////////////////////////////////////////////////////////////

	$scope.Viewposts = function(id){
		console.log("Current index is   "+$scope.myplacesList[id]);
		$scope.current_place = $scope.myplacesList[id];
		my_id = $scope.myplaceHierarchy[id];
		if (my_id === 'country') {
			my_id = 5;
		} else if (my_id === 'state') {
			my_id = 4;
		}else if (my_id === 'state_district') {
			my_id = 3;
		}else if (my_id === 'county') {
			my_id = 2;
		}else if (my_id === 'city') {
			my_id = 1;
		}else if (my_id === '') {
			my_id = 0;
		}
		myplace = $scope.myplacesList[id];
		console.log('/getplaceposts/'+my_id+'/'+myplace);
		$http.get('/getplaceposts/'+my_id+'/'+myplace).success(function(data){
			console.log('success 2');
			$scope.msgs = data.map(function(item) {
				item.date = new Date(item.date).toLocaleString(); 
				return item;
			});
		})
	}	
	//////Method for asynchronously updating likes ////////////
	$scope.check_url = function(msg){
		if(msg.url){
			console.log("my url is "+ msg.url);
		}else{
			console.log("No url");
		}
		return true;
	}
		


	//////Method for asynchronously updating likes ////////////
	$scope.likeMsg = function(likey,msg){

		console.log("likey " + msg._id);
		
		payload = {
			myid: msg._id,
			likeornot: likey
		}
		$http.post('likeupdate',payload).success(function (){
			if(likey === 1){
				msg.likes += 1;
			}else{
				msg.likes -= 1;
			}  
		});
	}
	///////////////////////////////////////////////////////////////
	
	

  	// create a map in the "map" div, set the view to a given place and zoom
  	var map = L.map('map', {
			    center: [22.505, 85.09],
			    zoom: 4
			});
  	//Alternative more pretty version of map using mapbox
//	var map = L.mapbox.map('map', 'examples.map-9ijuk24y')
 //   .setView([40, -74.50], 3);
  
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		 maxZoom: 18,
		 minZoom: 2
	}).addTo(map);


	var popup = L.popup();

	function onMapClick(e) {
		lati = e.latlng.lat;
		longi = e.latlng.lng;
		
		if (set_markpermission === true) {
			var marker = L.marker([lati, longi]).addTo(map);
			set_markpermission = false;
			get_hype(lati,longi);
		} else{
			console.log("Fuck you , marker doesn't work");
		};


		 locationAPI.getPlaces().success(function(response){
		 	$scope.myplacesList = [];
			$scope.myplaceHierarchy = [];
		 	$scope.myplacesList.push('Erthe');
			$scope.myplaceHierarchy.push('');
			console.log(Object.keys(response.address));
			if(response.address.country){

				$scope.myplacesList.push( response.address.country);
				$scope.myplaceHierarchy.push('country');
			}else{
				console.log("no country");	
			}
			if(response.address.state){
				$scope.myplacesList.push( response.address.state);
				$scope.myplaceHierarchy.push('state');
			}else{
				console.log("no state");	
			}
			if(response.address.state_district){
				$scope.myplacesList.push( response.address.state_district);
				$scope.myplaceHierarchy.push('district');
			}else{
				console.log("no state_district");	
			}
			if(response.address.county ){
				if(response.address.state_district && response.address.state_district !== response.address.county){
					$scope.myplacesList.push( response.address.county);
					$scope.myplaceHierarchy.push('county');
					
				}
			}else{
				console.log("no county");
			}
			if(response.address.city){
				$scope.myplacesList.push( response.address.city);
				$scope.myplaceHierarchy.push('city');
			}else{
				console.log("no city");	
			}
			if(response.address.town){
				$scope.myplacesList.push( response.address.town);
				$scope.myplaceHierarchy.push('town');
			}else{
				console.log("no town");	
			}
			if(response.address.suburb){
				$scope.myplacesList.push( response.address.suburb);
				$scope.myplaceHierarchy.push('suburb');
			}else{
				console.log("no suburb");	
			}
			if(response.address.village){
				$scope.myplacesList.push( response.address.village);
				$scope.myplaceHierarchy.push('village');
			}else{
				console.log("no village");	
			}
			if(response.address.road){
				$scope.myplacesList.push( response.address.road);
				$scope.myplaceHierarchy.push('road');
			}else{
				console.log("no road");	
			}
			$scope.placesList = response;
			console.log("response is" + response.address.country);
		
				
		});
		




				
		console.log('WORKSSSSS'+ $scope.placesList);
		
		console.log(e.latlng.lat);
	   
	}

	map.on('click', onMapClick);
	
	$scope.set_marker = function(){
		set_markpermission = true;
	}
	
	$scope.show_more = function(bool,msg){
		console.log(msg + "at show_more function");
	if (bool=== 1) {
		if (msg.length <= 100) {
			return msg.length;
		} else{
			return 100;
		};

	} else{
		return msg.length;
	};	
	}

	$scope.show_all = function(msg){
		console.log(msg.length + " at show_all function");
		
		return msg.length;
	}

}])

.controller('BookController', function ($scope, $routeParams) {
	$scope.name = "BookController";
	$scope.post = $scope.msgs[$routeParams.index];
})

.config(function ($routeProvider,$locationProvider){
	$routeProvider
		.when('/',{
			templateUrl:'/view_posts.html'
		})
		.when('/posts/:index',{
			templateUrl:'/post.html',
			controller: 'BookController',
			 
		})

	$locationProvider.html5Mode(true);
})
	
 angular.module('igTruncate', []).filter('truncate', function (){
  return function (text, length, end){
    if (text != undefined){
      if (isNaN(length)){
      	post_length = 20;
        length = post_length;
      }

      if (end === undefined){
        end = "... ";
      }
      
      if (text.length <= length || text.length - end.length <= length){
        return text;
      }else{
        return String(text).substring(0, length - end.length) + end ;
      }
    }
  };
});

//Paging stuff I think
ListController = function($scope, itemService) {
    var pagesShown = 1;
    var pageSize = 5;
    $scope.items = itemService.getAll();
    $scope.itemsLimit = function() {
        return pageSize * pagesShown;
    };
    $scope.hasMoreItemsToShow = function() {
        return pagesShown < ($scope.items.length / pageSize);
    };
    $scope.showMoreItems = function() {
        pagesShown = pagesShown + 1;         
    };
};
