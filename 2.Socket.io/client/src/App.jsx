import React from 'react'
import { useEffect } from 'react';
import { io } from "socket.io-client"
import { Button, Container, Stack, TextField, Typography } from "@mui/material"
import { useState } from 'react';
import { useMemo } from 'react';

function App() {

  const socket = useMemo(() => io("http://localhost:8000",{
    withCredentials:true
  }), []); // 

  const [messages, setMessages] = useState(['']);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socketid, setSocketid] = useState('');
  const [roomName,setRoomname]= useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room }); // send message to server
    setMessage('')
  }

  const joinRoomHandler = (e) => {
     e.preventDefault();
     socket.emit('join-room',roomName);
    setRoomname("");
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketid(socket.id);
      console.log('connected socket', socket.id)
    });

    //  recevie a message from server 
    socket.on("receive-message", (data) => {
      setMessages(messages => [...messages, data])
    })

    socket.on('welcome', (s) => {
      console.log(s);
    })

    return () => {
      socket.disconnect();
    };
  },[]);

  return (
    <Container>
      <Typography variant='h6' component='div' gutterBottom>
        welcome to socket.io
      </Typography>
      <br />
      <Typography variant='h3' component='div' gutterBottom>
        {socket.id}
      </Typography>


      <form action="" onSubmit={joinRoomHandler}>
        <h5>JoinRoom</h5>
        <TextField value={roomName} onChange={e => setRoomname(e.target.value)} id='outlined-basic' label='RoomName' variant='outlined' />
        <Button type='submit' variant='contained' color='primary'>Join</Button>
      </form>

      <form action="" onSubmit={handleSubmit}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined' />

        <TextField value={room} onChange={e => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' />

        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>


      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant='h3' component='div' gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

    </Container>
  )
}

export default App