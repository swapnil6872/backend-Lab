import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http'
import cors from "cors"
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser';


const secretKeyJWT ="sdffesgffdsgfgd";
const port = 8000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }));


app.get('/', (req, res) => {
    res.send('hello world');
})

app.get('/login', (req, res) => {

   const token = jwt.sign({_id:"sdfdfdsfs"},secretKeyJWT);

   res.cookie('token',token ,{httpOnly:true,secure:true,sameSite:"none"})
   .json({message:"login Success"})
})

io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{

        if(err) return next(err)
        const token = socket.request.cookies.token;
        if(!token) return next(new Error("Authentication Erro"));

        const decoded = jwt.verify(token ,secretKeyJWT);
        next();
    });
})

io.on("connection", (socket) => {
    console.log("user connected", socket.id)
    //    socket.emit("welcome",`welcome to the server`)
    //    socket.broadcast.emit("welcome",`${socket.id} joined the server,`);

    socket.on('message', ({room,message}) => {
        console.log({message,room});
        // socket.broadcast.emit("receive-message", data);
         socket.to(room).emit("receive-message", message);
    })

    socket.on('join-room',(room)=>{
      socket.join(room)
      console.log(`user joined room ${room}`);
      
    })

    socket.on('disconnect', () => {
        console.log('user Disconnected ', socket.id);
    })
})

server.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})

