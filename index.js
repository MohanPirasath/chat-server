
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
// import {userRoute} from "./routes/userRoutes.js"
import { Server } from "socket.io"
import User from "./model/userModel.js";
import { createServer } from "http";
import Message from "./model/Messages.js"

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;
const rooms = ["General","Education","Medical"]

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())



const httpServer = createServer(app);

// const server = require('http').createServer(app);
// const io = new Server( {
//   cors: {
//           origin: 'http://localhost:3000',
//           methods: ['GET', 'POST']
//         }
//   });

// const io = require('socket.io')(app, {
//     cors: {
//       origin: 'http://localhost:3000',
//       methods: ['GET', 'POST']
//     }
//   })


app.use("/users",userRoutes)

mongoose.connect(process.env.MONGO,{useNewUrlParser:true,useUnifiedTopology:true,}).then(()=>{
    console.log("Mongoose connected successfully")
}).catch((error)=>{console.log(error , "in connection of db")})


app.get("/rooms",(req,res)=>{
  res.json(rooms)
})

const io = new Server( httpServer,{
  cors: {
          origin: 'https://chat-with-me-app.netlify.app',
          methods: ['GET', 'POST']
        }
    
});
async function getLastMessagesFromRoom(room){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages){
  return messages.sort(function(a, b){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}


io.on("connection",(socket)=>{


socket.on('new-user',async()=>{
  const members = await User.find()
  io.emit("new-user",members)
})


socket.on("join-room",async(room)=>{
  socket.join(room);
let roomMessages = await getLastMessagesFromRoom(room)
roomMessages = sortRoomMessagesByDate(roomMessages)
socket.emit("room-message",roomMessages)
})


socket.on('message-room', async(room, content, sender, time, date) => {
  // console.log(content,"tis is mes")
  const newMessage = await Message.create({content, from: sender, time, date, to: room});
  let roomMessages = await getLastMessagesFromRoom(room);
  roomMessages = sortRoomMessagesByDate(roomMessages);
  // sending message to room
  io.to(room).emit('room-messages', roomMessages);
  socket.broadcast.emit('notifications', room)
})



app.delete("/logout",async(req,res)=>{
  try {
    const {_id, newMessages} = req.body;
    const user = await User.findById(_id);
    user.status = "offline";
    user.newMessages = newMessages;
    await user.save();
    const members = await User.find();
    socket.broadcast.emit('new-user', members);
    res.status(200).send();
  } catch (e) {
    console.log("err on logout",e);
    res.status(400).send()
  }
})

})

httpServer.listen(PORT, () => console.log(`App started in ${PORT}`));
