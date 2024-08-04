const socket = io(); //connection request send to backend

console.log("JK");
// navigator windows object me install hota he(inbuilt)
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude } = position.coords;
        socket.emit("send-location", {latitude, longitude}); //access by app.js in io.on 
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0,0], 20);

// [0,0] => latitude, longitude , 10 => zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "JK"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]) {
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    } 
})