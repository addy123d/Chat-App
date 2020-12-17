// Dependency - Express 
// In C - #include <stdio.h>
// In javascript (JS) - require("")
// Variable types - let, const
const express = require("express");
const WebSocket = require("ws");
const ip = '127.0.0.1';
const port = 5500;

let app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/",express.static(__dirname+"/public"));

// Handle get request to /
app.get("/home",function(request,response){
    response.send("Welcome to my home page !");
});

// Register Page !
app.get("/register",function(request,response){
    response.send(`<form action="/registerDetails" method="POST">
                    <input type="text" name="name" placeholder="Enter your name" autocomplete="off">
                    <input type="email" name="email" placeholder="Enter Email" autocomplete="off">
                    <input type="password" name="password" placeholder="Choose Password" autocomplete="off">
                    <button>Submit</button>
                    </form>`);
});

// Collect user details !
app.post("/registerDetails",function(request,response){
    console.log(request.body);

    response.send("Data came !");
});


// Listen
const http_server = app.listen(port,ip,function(){
    console.log("Server is running....");
});

const wss = new WebSocket.Server({ server : http_server});

wss.on("connection",function(client){

    // Collect messages from client !
    client.on("message",function(data){

        // Convert string data to original object form !
        const parsed_data = JSON.parse(data);
        console.log("Parsed Data : ",parsed_data);

        // Send this recieved message to client again !
        const server_data = {
            data : parsed_data.message,
            name : parsed_data.client_name
        };

        // Broadcast message to each client !
        wss.clients.forEach(function(ws){
            ws.send(JSON.stringify(server_data));
        });

     
    });

    console.log("Connected with client !");
});

