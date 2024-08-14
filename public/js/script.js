const socket = io(); //initialize socket.io, due to it, connection requet is send to backend server

//naviagtor is installed default in window object
if (navigator.geolocation) {
  //navigator.geolocation.watchPosition  had accepted 3 things of information about the user's location. which are function, error handling, and options object/setting
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords; //fetch latitude and longitude from position.coords
      socket.emit("send-location", { latitude, longitude }); //emit the location to server
    },
    (error) => {
      console.log(error);
    },
    //watchPosition offers variety of settings for accuracy, timeout etc.
    {
      enableHighAccuracy: true, //set high accuracy for better location accuracy
      timeout: 5000, // check location after 5 seconds
      maximumAge: 0, // disable caching of location data to get most recent location
    }
  );
}

// L.map("map"); ask request for location of the map
const map = L.map("map").setView([0, 0], 15); // initialize map with 0,0 coordinates and zoom level 10
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
//L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"): Defines the URL template for the map tiles. {s} is a subdomain, {z} is the zoom level, {x} is the tile column, and {y} is the tile row.

const markers = {};
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16); //view map to the location of the user

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // update the marker location
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map); // add a new marker for the user
    // markers[id].bindPopup(`User ${id}`); // bind a popup to the marker with user id
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // remove the marker from the map when a user
    delete markers[id]; // remove the marker key value from the markers object
  }
});
