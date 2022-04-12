import http from "http";
import {Server} from "socket.io"
import express from "express"

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);


const httpServer = http.createServer(app)
const wsServer = new Server(httpServer)

function countUser(room){
    return wsServer.sockets.adapter.rooms.get(room)?.size
}

wsServer.on("connection", (socket) => {
    var ip = require("ip")
    socket["ip"] = ip.address()

    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`)
    })

    socket.on("enter", (room) => {
        socket.join(room)
        wsServer.to(room).emit('welcome', socket.ip, countUser(room))
    })

    socket.on('message', (msg) => {
        socket.broadcast.emit('update', `${socket.ip}: ${msg}`);
    })
    
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
            wsServer.to(room).emit("bye", socket.ip, (countUser(room) - 1))
        )
    })
    
})

  
httpServer.listen(3000, handleListen);