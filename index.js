import express from "express";
const app=express()
import http from "http";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';
import {Server} from "socket.io";

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use('/socket.io', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
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
    app.get('/:name',(req,res)=>{
        res.send(req.params.name)
    })
})

app.get('/',(req,res)=>{
    res.send('Hello');
})

server.listen(process.env.PORT || 3001)