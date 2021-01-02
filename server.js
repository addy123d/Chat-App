// Dependency - Express 
// In C - #include <stdio.h>
// In javascript (JS) - require("")
// Variable types - let, const
const express = require("express");
const WebSocket = require("ws");
const socket = require("socket.io");
const ejs = require("ejs");
const ip = '127.0.0.1';
const port = 5500;

let app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine","ejs");


// Handle get request to /
app.get("/",function(request,response){
    response.render("room");
});

app.get("/chat",function(request,response){
    response.render("chat");
});

// Register Page !
// app.get("/register",function(request,response){
//     response.send(`<form action="/registerDetails" method="POST">
//                     <input type="text" name="name" placeholder="Enter your name" autocomplete="off">
//                     <input type="email" name="email" placeholder="Enter Email" autocomplete="off">
//                     <input type="password" name="password" placeholder="Choose Password" autocomplete="off">
//                     <button>Submit</button>
//                     </form>`);
// });

// // Collect user details !
// app.post("/registerDetails",function(request,response){
//     console.log(request.body);

//     response.send("Data came !");
// });


// Listen
// Functions
// To add room

function addRoom(id,group_title,name,client_id){
    const room = {
        id : id,
        group_title: group_title,
        names : [{
            id : client_id,
            name : name,
            status : "Admin"
        }]
    };

    rooms.push(room);

    console.log("Rooms array : ",rooms);

    return room;
}

// To add participants

function addParticipant(id,name,client_id){
    const getIndex = rooms.findIndex((room)=>room.id === id);

    const user = {
        id : client_id,
        name : name,
        status : "Participant"
    };

    rooms[getIndex].names.push(user);

    console.log("Rooms Array : ",rooms[getIndex]);
    console.log("Names Array : ",rooms[getIndex].names);
    console.log("User Added !");

    return rooms[getIndex];
}


// Delete User !

function deleteUser(group_id,client_id){

    // Search your room !
    const getIndex = rooms.findIndex((user)=>user.id === group_id);

    const userIndex = rooms[getIndex].names.findIndex((user)=> user.id === client_id);

    if(userIndex != -1){

        // Delete user from names array with the help of splice method !
        rooms[getIndex].names.splice(userIndex,1);

        console.log("Room : ",rooms[getIndex].names);
        return true;
    }


}



const rooms = [];

const http_server = app.listen(port,ip,function(){
    console.log("Server is running....");
});

const wss = socket(http_server)

wss.on("connection",function(client){

    // On connection with client !
    client.emit("onconnect",JSON.stringify({
        type : "connection",
        message : "Connected !"
    }));

    // Collect entry data
    client.on("entry_data",function(data){
        console.log(data);

        // Parse the string data !
        const parsed_data = JSON.parse(data);

        const {id, name, group_title} = parsed_data;

        // Check if room exists or not !
       const getIndex = rooms.findIndex((room)=>room.id === id);

       if(getIndex < 0){

            const room = addRoom(id,group_title,name,client.id);

            client.join(room.id);
            
       }else{
            const room  = addParticipant(id,name,client.id);
            console.log("Room : ",room);
            client.join(room.id);

            // Entry message object !
            const message = {
                type : "enter",
                text : `${name} has entered the chat !`,
                time : new Date().toLocaleTimeString()
            }

            // Send entry message to other users !
            client.to(room.id).broadcast.emit("server_msg",JSON.stringify(message));
       };

     

    });

    // Collect messages from client !
    client.on("input_message",function(data){
        console.log(data);

        // Convert string data to original object form !
        const parsed_data = JSON.parse(data);
        console.log("Parsed Data : ",parsed_data);

        // Send this recieved message to client again !
        const server_data = {
            type : "server",
            data : parsed_data.message,
            name : parsed_data.client_name,
            time : new Date().toLocaleTimeString()
        };

        // Broadcast to all the clients !
        client.to(parsed_data.id).broadcast.emit("server_message",JSON.stringify(server_data));
    });

    // Collect typing requests from client !
    client.on("client_typing",function(data){
        
        // Convert string data to original object form !
        const parsed_data = JSON.parse(data);

        client.to(parsed_data.id).broadcast.emit("server_typing",JSON.stringify(parsed_data));
    });

    // Collect Exit messages from client !

    client.on("exit",function(data){
        console.log(data);

        // Parsing    string -> object
        const parsed_data = JSON.parse(data);

        const {id, name} = parsed_data;

        // Send exit message to other clients !

        const exit = {
            type : "left",
            message : `${name} has left the chat !`,
            time : new Date().toLocaleTimeString()
        }

        client.to(id).broadcast.emit("exit_message",JSON.stringify(exit));

        // Call deleteUser Function to delete user from the array !
        deleteUser(id,client.id);
    });

    console.log("Connected with client !");
});



// const wss = new WebSocket.Server({ server : http_server});

// wss.on("connection",function(client){

//     // Collect messages from client !
//     client.on("message",function(data){

//         // Convert string data to original object form !
//         const parsed_data = JSON.parse(data);
//         console.log("Parsed Data : ",parsed_data);

//         // Send this recieved message to client again !
//         const server_data = {
//             data : parsed_data.message,
//             name : parsed_data.client_name
//         };

//         // Broadcast message to each client !
//         wss.clients.forEach(function(ws){
//             ws.send(JSON.stringify(server_data));
//         });

     
//     });

//     console.log("Connected with client !");
// });

