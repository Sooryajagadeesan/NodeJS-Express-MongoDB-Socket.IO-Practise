const express = require("express");
const http = require("http");
const path = require("path");

const app = express(); // getting the handler function from expressjs
const server = http.createServer(app) // creating a server

const {Server} = require("socket.io");
const io = new Server(server);

let usersOnline = []

let userName = "";
app.get("/home",(req,res)=> {
    res.sendFile(path.join(__dirname,"View","home.html"));
})
app.get("/join-chat",setUserName,(req,res)=> {
    res.sendFile(path.join(__dirname,"View","chatPage.html"));
})

// sets the userName variable as the query string value
function setUserName(req,res,next) {
    userName = req.query.username;
    next();
}

io.on("connection",(socket) => {
    socket[socket.id] = userName;
    usersOnline.push({
        name: socket[socket.id],
        id: socket.id
    });


    io.emit("display-users",{
        "connectedUsers": usersOnline
    })

    io.emit("notify-connections",{
        "name": socket[socket.id],
        "id": socket.id
    })

    console.log(`'${socket[socket.id]}' connected`);

    // socket disconnection event
    socket.on("disconnect",() => {
        // getting index of disconnected user
        let disconnectedIndex = usersOnline.findIndex(user => {
            return user.id === socket.id;
        })
        
        // updating the available users array after users disconnection
        usersOnline.splice(disconnectedIndex,1);
        // display users after disconnection
        io.emit("display-users",{
            "connectedUsers": usersOnline
        });
        // give notification on disconnection
        io.emit("notify-disconnections",{
            "name": socket[socket.id],
            "id":socket.id
        });
        console.log(`'${socket[socket.id]}' disconnected`);

    })

    // chat message event
    socket.on("chat message",(messageObj) => {
        socket.userName = messageObj.username
        io.emit("chat message",{
            message: messageObj.enteredMessage,
            id: socket.id,
            name: socket[socket.id]
        });
    })
})



server.listen(3000, ()=> console.log("Server is running"));