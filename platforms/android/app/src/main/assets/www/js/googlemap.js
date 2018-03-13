var currentLocationMap;
var directionsDisplay;
var directionsService;
var currentLocationMap;

var CONTENT = 0;
var LATITUDE = 1;
var LONGITUDE = 2;
var locations;
var mapWindow;
var lat = 0.0;
var long = 0.0;
var loc;
window.onload = onAllAssetsLoaded;
function onAllAssetsLoaded()
{
    // Wait for Cordova to connect with the device

    document.getElementById('loadingMessage').style.visibility = "hidden";
    document.addEventListener("deviceready", onDeviceReady, false);
}

// Cordova is ready to be used!
function onDeviceReady()
{
    // note, it takes a few seconds for the gps to work, so you need to give a high timeout value
    var options = {maximumAge: 1000, timeout: 50000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, options);
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    loc = new google.maps.LatLng(lat, long);
    directionsService = new google.maps.DirectionsService();
    // route planner
    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {zoom: 12, center: loc};
    currentLocationMap = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);
    directionsDisplay.setMap(currentLocationMap);
    directionsDisplay.setPanel(document.getElementById('directions'));

    var marker = new google.maps.Marker({
        position: loc,
        map: currentLocationMap,
        title: "u r here"
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('destination');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    currentLocationMap.addListener('bounds_changed', function () {
        searchBox.setBounds(currentLocationMap.getBounds());
    });

    marker.setMap(currentLocationMap);
    var infowindow = new google.maps.InfoWindow({
        content: " Your Location Detected<br>\n\latitude:" + lat + "<br> longitude:" + long
    });
    infowindow.open(currentLocationMap, marker);

}

function init()
{
    getLocation();

}

function calculateRoute()
{
    var end = document.getElementById('destination').value;
    var request = {
        origin: loc,
        destination: end,
        travelMode: google.maps.TravelMode["WALKING"]};

    directionsService.route(request, function (response, status)
    {
        if (status == google.maps.DirectionsStatus.OK)
        {
            directionsDisplay.setDirections(response);
        }
    });
}
function trace_open() {
    //document.getElementById("sidebar").style.display = "block";
    document.getElementById('controlPanel').style.top = "0px";
    document.getElementById('controlPanel').style.opacity = "1";
    document.getElementById('trace_open').style.top = "-60px";
}
function trace_close() {
    // document.getElementById("sidebar").style.display = "none";
    document.getElementById('controlPanel').style.top = "-1000px";
    document.getElementById('controlPanel').style.opacity = "0";
    document.getElementById('trace_open').style.top = "0px";
}

function trace() {
    if (document.getElementById('controlPanel').style.top === "0px") {
        trace_close();
    }
    else {
        trace_open();
    }
}