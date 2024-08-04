const express = require("express");
const app = express();
const path = require("path");
//socketio run on http server
const http = require("http");
const socketio = require("socket.io"); //function

const server = http.createServer(app);
const io = socketio(server); //io -> socket.io server

app.set("view engine","ejs");
// app.set(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) { //send-location received script.js (8)
        io.emit("receive-location", { id:socket.id, ...data });  // send to frontend, each user have unique id, script.js(31)
    });

    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    })
    console.log("connected"); 
});

app.get("/", function (req,res){
    res.render("index.ejs");
});

server.listen(3000);