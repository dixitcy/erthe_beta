/**
 * Simple Angular.js app to get started learning and working with the framework.
 */

// Define controller

var lati;
var longi;
var post_length;
angular.module('msgboardApp', ['ngRoute','igTruncate','ui.bootstrap'])




.service('locationAPI', function($http) {

	// Bangalore lat = 12.966509 and longi = 77.593689. For testing
	this.getPlaces = function(lati,longi) {
		return $http({
			method: 'JSONP', 
			url: 'http://nominatim.openstreetmap.org/reverse?format=json&json_callback=JSON_CALLBACK&lat='+lati+'&lon='+longi+'&zoom=18&addressdetails=1'
		});
	}
})

.service('searchMap', function($http){

	this.getsearch = function(query) {
		return $http({
			method: 'JSONP',
			url: 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=4&json_callback=JSON_CALLBACK&q='+query
		})
	}
})



.controller('MsgListCtrl',[ '$scope','$http','$window','locationAPI', '$modal','searchMap', function ($scope, $http, $window, locationAPI, $modal, searchMap){
	
	$scope.placesList = [];
	$scope.myplacesList = [];
	$scope.myplaceHierarchy = [];
	$scope.searchResults = [];
	$scope.current_place = "Erthe";
	$scope.numLimit = 2;
	$scope.show_searchresults = false;
	$scope.displayWidth ='col-md-1';
	$scope.mapWidth = 'col-md-11';

	var set_markpermission;
	getPosition();
	// ---------------- SEARCH BAR AND RESULTS STUFF ------------------------//
	$scope.search = function(){
		$scope.searchResults = [];
		if($scope.criteria !== ''){
			searchMap.getsearch($scope.criteria).success(function(response){
				if(response.length === 0){
					console.log("response search length is zero");
					$scope.showsearchAlert=true;
				}
				else{
					for (var i = 0; i < response.length; i++) {
						$scope.searchResults.push(response[i]);
					};
					console.log("Nominatim search check " + response);
					$scope.show_searchresults = true;
					
				}


				
			}).error(function(){
				$scope.searchResults.push([{"display_name":"No matches found"}]);
			})
			
		}else{

		}
	};

	$scope.close_search = function(){
		$scope.show_searchresults = false;
		$scope.searchResults = [];
		
	}

	$scope.goto_map = function(index){
		console.log("going to lat "+ $scope.searchResults[index].lat +" going to lon "+  $scope.searchResults[index].lon);
	map.setView([$scope.searchResults[index].lat, $scope.searchResults[index].lon], 15);
		 locationAPI.getPlaces($scope.searchResults[index].lat,$scope.searchResults[index].lon).success(function(response){
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
		
		
		});


	}
  	// ---------------- SEARCH BAR AND RESULTS STUFF ------------------------//


	// ---------------- GEO-LOCATION STUFF ------------------------//
	function getPosition(){
		navigator.geolocation.getCurrentPosition(mysuccess, fail,{
				enableHighAccuracy:true,
				timeout:100000,
				maximumAge:Infinity
		});    
	}   

	function mysuccess(position) {
		lati = position.coords.latitude;
		longi = position.coords.longitude;
		 console.log("Finally here"+ lati);
		 locationAPI.getPlaces(position.coords.latitude,position.coords.longitude).success(function(response){
						
			$scope.placesList = response;
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
			
		});
	}

	function fail(e)
	{
		alert("Your position cannot be found"+e.code+" => "+e.message);
	}
	// ---------------- GEO-LOCATION STUFF ------------------------//


	// ----------------  VIEWING AND POST INTERACTION STUFF ------------------------//
	
	/////////// Get data with HTTP get request and bind to scope which is seen in the HTML
		$http.get('/messages.json').success(function(data) {
			$scope.msgs = data.map(function(item) {
				//item.date = new Date(item.date).toLocaleString(); 
				return item;
			});
		});
	
	


	$scope.Viewposts = function(id){
		console.log("Current index is   "+$scope.myplacesList[id]);
		$scope.current_place = $scope.myplacesList[id];
		my_id = $scope.myplaceHierarchy[id];
		console.log(my_id);
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
			console.log('success 1' + data);
			if(data.length === 0 || data === null){
				console.log('success 2' + data);
				$scope.msgs = data;
			}else{
			$scope.msgs = data.map(function(item) {
				item.date = new Date(item.date).toLocaleString(); 
				return item;
			});
				
			}

		})
	}	
		



	//////Method for asynchronously updating likes ////////////
	$scope.likeMsg = function(likey,msg){

		if(likey === 1){
				msg.likes += 1;
			}else{
				msg.likes -= 1;
			} 
		
		payload = {
			myid: msg._id,
			likeornot: likey
		}
		$http.post('likeupdate',payload).success(function (){
			
		});
	}
	// ----------------  VIEWING AND POST INTERACTION STUFF ------------------------//
	
	
	// ---------------- RENDERING MAP STUFF ------------------------//
  	// create a map in the "map" div, set the view to a given place and zoom
  	//var map = L.map('map', {
	//		    center: [22.505, 85.09],
	//			    zoom: 4
	//		});
  	//Alternative more pretty version of map using mapbox
	
  
	// add an OpenStreetMap tile layer


  /* map settings */
  var map = new L.Map('map');
  var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/f1376bb0c116495e8cb9121360802fb0/997/256/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
  });
  map.addLayer(cloudmade).setView(new L.LatLng(20.52, 94.09), 4);



	
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


		 locationAPI.getPlaces(e.latlng.lat,e.latlng.lng).success(function(response){
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
		
		
		});
		
		console.log('WORKSSSSS');
		console.log(e.latlng.lat);
		
		   
	}
				

	map.on('click', onMapClick);
	
	$scope.set_marker = function(){
		set_markpermission = true;
	}
	// ---------------- RENDERING MAP STUFF ------------------------//

	$scope.show_more = function(msg){
		
	
		if (msg.length <= 100) {
			return msg.length;
		} else{
			return 100;
		};

	 	
	}
	 $scope.loginData = true;
	$scope.toggle_map = function(){
		if ($scope.displayWidth==='col-md-11') {
			$scope.displayWidth='col-md-1';
			$scope.mapWidth='col-md-11';
		} else{

		 $scope.displayWidth='col-md-11';
		 $scope.mapWidth='col-md-1';
		};
	}
	
	// ---------------- POSTING STUFF ------------------------//
	$scope.openPostmodal = function () {
  
		console.log('placesList scope ' + $scope.placesList.address.country);

	    var modalInstance = $modal.open({
	    	templateUrl: 'partials/post_modal.html',
	    	controller: 'ModalInstanceCtrl',
	    	resolve: {
	    		places: function () {
	        		return $scope.placesList;
	        	},
	        	msgs: function() {
	        		return $scope.msgs
	        	}
	      	}
	    });

	    modalInstance.result.then(function (mysuccess) {
	    
	    	if (mysuccess === 1) {
	    		console.log("in success");
	    		$scope.showsuccessAlert=true;
	    	} else{
	    		console.log("in failure");
	    		$scope.showfailureAlert=true;
	    	};
	      
	    }, function () {
	      	console.log('Modal dismissed at: ' + new Date());
	    });
	};


	$scope.openlogin = function () {
  
		

	    var modalInstance = $modal.open({
	    	templateUrl: 'partials/login_modal.html',
	    	controller: 'loginModalInstanceCtrl',
	    	

	    });

	    modalInstance.result.then(function () {
	    

	    }, function () {
	      	console.log('Modal dismissed at: ' + new Date());
	    });
	};

  	 $scope.closeAlert = function() {
    	$scope.showAlert = false;
	};

	
	$scope.check_url = function(msg){
		if(msg.url){
			console.log("my url is "+ msg.url);
		}else{
			console.log("No url");
		}
		return true;
	}
	  	// ---------------- POSTING STUFF ------------------------//


}])

.controller('individualPostView', function ($scope, $routeParams, $http) {
	$scope.name = "individualPostView";
	$scope.post = $scope.msgs[$routeParams.index];
	$scope.likeMsg = function(likey,msg){

		if(likey === 1){
				msg.likes += 1;
			}else{
				msg.likes -= 1;
			} 

		payload = {
			myid: msg._id,
			likeornot: likey
		}
		$http.post('likeupdate',payload).success(function (){
			 
		});
	}
})

.config(function ($routeProvider,$locationProvider){
	$routeProvider
		.when('/',{
			templateUrl:'/partials/mapview_posts.html'
		})
		.when('/posts/:index',{
			templateUrl:'/partials/post.html',
			controller: 'individualPostView',
			 
		})

	$locationProvider.html5Mode(true);
})



// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var loginModalInstanceCtrl = function ($scope, $http, $modalInstance) {
	}

var ModalInstanceCtrl = function ($scope, $http, $modalInstance, places,msgs) {

	var tagverify;
	var tagunverify;
	var tagpolitics;
	var tagbreaking;
	var tagother;
  $scope.placesList = places;
  $scope.addTag = function(tag){
    if (tag===1) {
    	tagverify = 1;
    } 
    if(tag===2){
    	tagunverify = 1;
    }
    if(tag===3){
    	tagbreaking = 1;
    }
    if(tag===4){
    	tagpolitics = 1;
    }
    if(tag===5){
    	tagother = 1;
    }
  };

  $scope.sendMsg = function(depth,list) {
  	console.log("show_selectednews is " + $scope.show_selectednews);
		console.log('Yoo HOO'+ list.address.country);
		var mysuccess = 0;
		if ($scope.msgUrl) {
			console.log("URL success" + $scope.msgUrl);
		} else{
			url = "";
		};
		
		console.log('Yoo HOO'+ $scope.currMsg);
		currTime = new Date();
		if(depth === 5){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			}
			if(list.address.state){
				mystate = list.address.state;
			}else{
				mystate = 'unavailable';
			}
			if(list.address.state_district){
				mystate_district = list.address.state_district;
			}else{
				mystate_district = 'unavailable';
			}
			if(list.address.county){
				mycounty = list.address.county;
			}else{
				mycounty = 'unavailable';
			}
			if(list.address.city){
				mycity = list.address.city;
			}else{
				mycity = 'unavailable';
			}
			myroad = 'unavailable';
		}
		else if(depth === 1){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			};
			mystate ='unavailable' ;
			mystate_district ='unavailable' ;
			mycounty ='unavailable' ;
			mycity ='unavailable' ;
			myroad = 'unavailable';

		}
		else if(depth === 2){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			}
			if(list.address.state){
				mystate = list.address.state;
			}else{
				mystate = 'unavailable';
			}
			mystate_district ='unavailable' ;
			mycounty ='unavailable' ;
			mycity ='unavailable' ;
			myroad = 'unavailable';

		}
		else if(depth === 3){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			}
			if(list.address.state){
				mystate = list.address.state;
			}else{
				mystate = 'unavailable';
			}
			if(list.address.state_district){
				mystate_district = list.address.state_district;
			}else{
				mystate_district = 'unavailable';
			}
			mycounty ='unavailable' ;
			mycity ='unavailable' ;
			myroad = 'unavailable';

		}
		else if(depth === 4){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			}
			if(list.address.state){
				mystate = list.address.state;
			}else{
				mystate = 'unavailable';
			}
			if(list.address.state_district){
				mystate_district = list.address.state_district;
			}else{
				mystate_district = 'unavailable';
			}
			if(list.address.county){
				mycounty = list.address.county;
			}else{
				mycounty = 'unavailable';
			}
			
			mycity ='unavailable' ;
			myroad = 'unavailable';

		}
		else if(depth === 7){
			if(list.address.country){
				mycountry = list.address.country;
			}else{
				mycountry = 'unavailable';
			}
			if(list.address.state){
				mystate = list.address.state;
			}else{
				mystate = 'unavailable';
			}
			if(list.address.state_district){
				mystate_district = list.address.state_district;
			}else{
				mystate_district = 'unavailable';
			}
			if(list.address.county){
				mycounty = list.address.county;
			}else{
				mycounty = 'unavailable';
			}
			if(list.address.city){
				mycity = list.address.city;
			}else{
				mycity = 'unavailable';
			}
			if(list.address.road){
				myroad = list.address.road;
			}else{
				myroad = 'unavailable';
			}
		}
		else{
			mycountry = list.address.country;
			mystate ='unavailable' ;
			mystate_district ='unavailable' ;
			mycounty ='unavailable' ;
			mycity ='unavailable' ;
			myroad = 'unavailable';
		}
		
		// Create payload from msg and add date
		payload = {
			date: currTime.valueOf(), // milliseconds since epoch
			msg:  $scope.currMsg,
			url: $scope.msgUrl,
			likes: 0,
			country: mycountry,
			state: mystate,
			state_district: mystate_district,
			county: mycounty,
			city: mycity,
			road: myroad,
			verified: tagverify,
			unverified: tagunverify,
			politics: tagpolitics,
			other: tagother,
			breaking: tagbreaking
		}
		// Send post request to server to insert into mongodb
		$http.post('messages', payload).success(function() {
			payload.date = currTime.toLocaleString();
			// Add to current array of msgs for pseudo live update
			msgs.push(payload);
			console.log(msgs[0].msg);
			mysuccess = 1;
			console.log("result " + mysuccess)
			$modalInstance.close(1);
		}).error(function(){
			$modalInstance.close(0)
		})
		$scope.currMsg = "";
		
	}
};	




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
})



