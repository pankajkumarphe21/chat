import express from "express";
const app=express()
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

app.use(cors());
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"https://chat-client-one-sable.vercel.app/",
        methods:["GET","POST"],
    }
})

io.on("connection",(socket)=>{
    socket.on("join_room",(data)=>{
        socket.join(data);
    })
    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })
})

app.get('/',(req,res)=>{
    res.send('Hello');
})

server.listen(process.env.PORT || 3001)