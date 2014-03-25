	 var map;
	var myCenter=new google.maps.LatLng(20.293028,85.833435);

				function initialize()
				{
				var mapProp = {
					center:myCenter,
					zoom:12,
					mapTypeId:google.maps.MapTypeId.ROADMAP
					};

					map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

					google.maps.event.addListener(map, 'click', function(event) {
						placeMarker(event.latLng);
						postLocation(event.latLng);
					});
				}

				function postLocation(location){
					console.log("FUCKING HERE FUCKING ASSHOLE" + location.lat());
					 mylat = location.lat();
						mylong = location.lng();
						var locdata = {
							'lati': location.lat(),
							'longi': location.lng()
						}
					 $.ajax({
								type: 'POST',
								data: locdata,
								url: '/getlocation',
								dataType: 'JSON'
							}).done(function(response){

								//check if response is successfull blank msg
								if(response.msg ===''){

								}
								else{

									alert('Error:');

								}
							});
				}



				function placeMarker(location) {
					 
							var image = new google.maps.MarkerImage("http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png", null, null, null, new google.maps.Size(40,52)); // Create a variable for our marker image.
					var marker = new google.maps.Marker({
						position: location,
						icon: image,
						draggable:true,
						map: map,
					});
					var infowindow = new google.maps.InfoWindow({
						content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
					});
					infowindow.open(map,marker);
				}

				google.maps.event.addDomListener(window, 'load', initialize);