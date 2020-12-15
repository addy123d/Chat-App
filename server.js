// Dependency - Express 
// In C - #include <stdio.h>
// In javascript (JS) - require("")
// Variable types - let, const
const express = require("express");
const ip = '127.0.0.1';
const port = 5500;

let app = express();

// Handle get request to /
app.get("/home",function(request,response){
    response.send("Welcome to my home page !");
});


// Listen
app.listen(port,ip,function(){
    console.log("Server is running....");
});