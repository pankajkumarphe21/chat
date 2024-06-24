import express from "express";
const app=express()
import http from "http";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';
import {Server} from "socket.io";

app.use(cors({
    origin: '*',
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

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