// Dependency - Express 
// In C - #include <stdio.h>
// In javascript (JS) - require("")
// Variable types - let, const
const express = require("express");
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
app.listen(port,ip,function(){
    console.log("Server is running....");
});