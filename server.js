import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';

const PORT = 8000;

(async function () {
  const app = express();
  app.use(express.static('public'));
  app.use(cors({
    origin: '*',
    credentials: true,
  }))


  const server = http.createServer(app);

  const io = new Server(server, {
    serveClient: true
  });
  // io.attach(server);


  const stateArray = [];
  let activeUser = 0;


  io.on("connection", (socket)=>{
    console.log("Connection opened", socket.id);
    activeUser++;
    io.emit('server:active', activeUser);

    socket.on('user:click', (data)=>{
      // console.log(data);
      const {isChecked, id} = data;
      if(isChecked){
        stateArray.push(id);
      }
      else{
        const index = stateArray.indexOf(id);
        stateArray.splice(index, 1);
      }
      io.emit('server:update', data);
    })


    socket.on('disconnect', ()=>{
      activeUser--;
      io.emit("server:active", activeUser);
    })

  })


  //route for finding the total checked box
  app.get('/checked-box', (req, res)=>{
    return res.status(200).send(stateArray)
  })


  server.listen(PORT, ()=>{
    console.log(`server is listening on ${PORT}`);
  })
})();