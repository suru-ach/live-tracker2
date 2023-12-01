var counter = 0;
let CoordsLog = [];

const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function reverseGeocodeAndDisplayMap(latitudeInput, longitudeInput) {
    let latitude = latitudeInput;
    let longitude = longitudeInput;
    if (latitude == undefined || longitude == undefined || latitude == null || longitude == null) {
        latitude = document.getElementById("latitudeInput").value;
        longitude = document.getElementById("longitudeInput").value;
    }

    // Make a request to the Nominatim API for reverse geocoding
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.display_name) {
                var address = data.display_name;
                document.getElementById("result").textContent = "Address: " + address;
            } else {
                document.getElementById("result").textContent = "Location not found";
            }
        });

    // Update the map's center to the specified coordinates
    map.setView([latitude, longitude], 19);

    // Add a marker to the map at the specified coordinates
    const marker = L.marker([latitude, longitude]).addTo(map);
}
const mes = document.getElementById("message");

function getCurrentLocation() {
    mes.innerHTML = "fetching...";
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                document.getElementById("latitude").textContent = latitude;
                document.getElementById("longitude").textContent = longitude;
                mes.innerHTML = "safe";
                CoordsLog.push({ lat: latitude, long: longitude });
                //console.log({ lat: latitude, long: longitude }, counter++);
            },
            function (error) {
                // Handle any errors here
                console.error("Error getting location:", error);
                mes.innerHTML = "error";
            },
            { enableHighAccuracy: true } // Request high accuracy
        );
    } else {
        alert("Geolocation is not available in your browser.");
        mes.innerHTML = "error cannot use in browser";
    }
    setTimeout(() => {
        getCurrentLocation();
        renderLog();
    }, 5000);
}

function renderLog() {
    const logHtml = CoordsLog.map(coords => `<div>latitude: ${coords.lat}</div><div>longitude: ${coords.long}</div>`).join('');
    document.getElementById("coords-log").innerHTML = logHtml;
}

async function getCoords() {
    const phonenumber = window.location.search.split('=')[1];
    await fetch('/v1/getcoords', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phonenumber })
    })
        .then((res) => { 
            console.log(res);
            return res.json();
        })
        .then(data => {
            const { x, y, isStalled, location}  = data;
            reverseGeocodeAndDisplayMap(x, y);
            console.log(data);
        })
        .catch(err => console.log(err))
        .finally(() => {
            console.log('error get coords')
        })
}
 
let maps_interval;
function start_map_counter() {
    if(maps_interval == undefined)
        maps_interval = setInterval(getCoords, 5000);
}

function end_map_counter() {
    clearInterval(maps_interval);
}

start_map_counter();
