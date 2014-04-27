

var lati;
var longi;
var mylati;
var mylongi;
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



.controller('MsgListCtrl',[ '$scope','$http','$window','locationAPI', '$modal','searchMap','$timeout','$location', function ($scope, $http, $window, locationAPI, $modal, searchMap, $timeout, $location){
	
	$scope.placesList = [];
	$scope.myplacesList = [];
	$scope.myplaceHierarchy = [];
	$scope.searchResults = [];
	$scope.current_place = "Erthe";
	$scope.numLimit = 2;
	$scope.show_searchresults = false;
	$scope.displayWidth ='col-md-1';
	$scope.mapWidth = 'col-md-11';

	getPosition();
	// ---------------- SEARCH BAR AND RESULTS STUFF ------------------------//
	$scope.search = function(){
		$scope.searchResults = [];
		if($scope.criteria !== ''){
			searchMap.getsearch($scope.criteria)
			.success(function(response){
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
			})
			.error(function(){
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
				$scope.myplaceHierarchy.push('state_district');
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
		mylati = position.coords.latitude;
		mylongi = position.coords.longitude;
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
				$scope.myplaceHierarchy.push('state_district');
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

			$scope.Viewposts(0);
			$('#myModal').modal('show');
		});
	}

	function fail(e)
	{
		alert("Your position cannot be found"+e.code+" => "+e.message);
	}
	// ---------------- GEO-LOCATION STUFF ------------------------//


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
		}else if (my_id === 'road') {
			my_id = 6;
		}else if (my_id === '') {
			my_id = 0;
		}
		myplace = $scope.myplacesList[id];
		console.log('/getplaceposts/'+my_id+'/'+myplace);
		$http.get('/getplaceposts/'+my_id+'/'+myplace).success(function(data){
			console.log('success 1' + data);
			if(data.length === 0 || data === 'err'){
				console.log('success 2' + data);
				$scope.msgs = '';
				$('#myModal').modal('show');
			}else{
			$scope.msgs = data.map(function(item) {
				item.date = new Date(item.date).toLocaleString(); 
				return item;
			});
			$('#myModal').modal('show');
				
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

  	$scope.openlink = function(url){
  		 window.open(url);
  	}

	$scope.create_hype = function(){
		console.log("hype is " + $scope.hype-name);
		map.setView([lati, longi], 18);
		L.marker([lati, longi], {
            icon: L.mapbox.marker.icon({'marker-size': 'small', 'marker-color': '0044FF'}),
            title: title,
            iconSize: [38, 95],
        }).addTo(map)
    	.bindPopup('')
    	.openPopup();
	
		
	}



  var map = L.mapbox.map('map')
 var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/f1376bb0c116495e8cb9121360802fb0/997/256/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
  });
  map.addLayer(cloudmade).setView(new L.LatLng(20.52, 34.09), 2);



// Since featureLayer is an asynchronous method, we use the `.on('ready'`
// call to only use its marker data once we know it is actually loaded.
var myLayer =  L.mapbox.featureLayer("/markers")

myLayer.on('ready', function(e) {
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
    });
    map.addLayer(clusterGroup);
});
   

	var geoJson = {
	    type: 'FeatureCollection',
	    features: [{
	        type: 'Feature',
	        properties: {
	            title: 'Washington, D.C.',
	            'marker-color': '#f00',
	            'marker-size': 'small',
	             url: '/hype'
	        },
	        geometry: {
	            type: 'Point',
	            coordinates: [85.86201, 20.30065]
	        }
	    },
	    {
	        type: 'Feature',
	        properties: {
	            title: 'Baltimore, MD',
	            'marker-color': '#f00',
	            'marker-size': 'small',
	             url: '/hype'
	        },
	        geometry: {
	            type: 'Point',
	            coordinates: [86.60767, 20.28755]
	        }
	    }]
	};
		console.log(geoJson.features[0].properties.title);
		
		

		myLayer.on('mouseover', function(e) {
		    e.layer.openPopup();
		});
		myLayer.on('mouseout', function(e) {
		    e.layer.closePopup();
		});		  

		myLayer.on('click', function(e) {
		    
		    console.log(e.layer.feature.properties.title);
		    hypeposts(e.layer.feature.properties.title,getDistanceFromLatLonInKm(mylati,mylongi,e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0]));
		    

		});

	

    




    $scope.openhypemodal = function(){
		
		
	    var modalInstance = $modal.open({
	    	templateUrl: 'partials/hype_modal.html',
	    	controller: 'hypeInstanceCtrl',
	    	
	    });

	    	    modalInstance.result.then(function (mysuccess) {
	    
	    	    
				map.setView([lati, longi], 18);
			geoJson.features.push({
		        type: 'Feature',
		        properties: {
		            title: mysuccess,
		            'marker-color': '#f00',
		            'marker-size': 'small',
		            },
		        geometry: {
		            type: 'Point',
		            coordinates: [longi, lati]
		        }
		    })

		    console.log(geoJson.features);
  			myLayer.setGeoJSON(geoJson);
  			myLayer.addTo(map);
			
	    	payload = {
	    		hypename: mysuccess,
	    		latitude:lati,
	    		longitude:longi
	    	}
	    	$http.post('sethype',payload).success(function(){})
		    	
		    	
		    	
	    }, function () {
	    	$location.url('/');
	      	console.log('hypeModal dismissed at: ' + new Date());
	    });

	   	
    }

    $scope.dismiss_modal = function(){
	    
	  		$location.url('/')
		
    	
    }

    $scope.distancecheck = function(){

    	return false;
    }

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

    $scope.posttohype = function(){
    	console.log($scope.hypemsg);
    	console.log($scope.current_place);
    	
    	payload = {
    		msg: $scope.hypemsg,
    		name: $scope.current_place
    	}
    	$http.post('posttohype',payload).success(function(){

    		$scope.msgs.push(payload);
    	})
    }

  
	function hypeposts(name,urdistance){
		
		$location.url('/hype')
		$scope.distance = urdistance;
		$http.get('/gethypeposts/'+name).success(function(data){
			if(data.length === 0 || data === 'err'){
				console.log('success 2' + data);
				$scope.msgs = '';
				$scope.current_place = name;
				$('#hypeModal').modal('show');
			}else{
				data = JSON.stringify(data);
				var mydata = data.substring(1, data.length-1)
				mydata = JSON.parse(mydata);
				console.log('success 1' + mydata.msgs[0].msg);
					$scope.current_place = mydata.name;
					$scope.msgs = mydata.msgs;
					$('#hypeModal').modal('show');
				}

		})
	}


	


	function onMapClick(e) {
		lati = e.latlng.lat;
		longi = e.latlng.lng;
		


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
				$scope.myplaceHierarchy.push('state_district');
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
	
	

	$scope.show_more = function(msg){
		
	
		if (msg.length <= 100) {
			return msg.length;
		} else{
			return 100;
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
              	$scope.showsuccessAlert = true;
	    		$timeout(function() {
	    			$scope.showsuccessAlert = false;
            	}, 1000)
	    		
	    	} else{
	    		console.log("in failure");
              	$scope.showfailureAlert = true;
	    		$timeout(function() {
	    			$scope.showfailureAlert = false;
            	}, 1000)
	    	};
	      
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
		.when('/hype',{
			templateUrl:'/partials/hypeview_modal.html'
		})
		.when('/posts/:index',{
			templateUrl:'/partials/post.html',
			controller: 'individualPostView',
			 
		}).otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
})


var hypeInstanceCtrl = function ($scope, $http, $modalInstance) {

	$scope.makehype = function(){
		console.log("the hype title is " + $scope.hypetitle);
		$modalInstance.close($scope.hypetitle)
	}
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
    	tagnews = 1;
    } 
    if(tag===2){
    	tagquestion = 1;
    }
    if(tag===3){
    	tagconfession = 1;
    }
    if(tag===4){
    	tagopinion = 1;
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
			news: tagnews,
			question: tagquestion,
			opinion: tagopinion,
			other: tagother,
			confession: tagconfession
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
