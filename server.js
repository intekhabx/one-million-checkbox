import 'dotenv/config'
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { publisher, subscriber, redis } from './redis-connection.js';

const PORT = process.env.PORT ?? 8000;

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


  //we can also store in redis
  const stateArray = [];
  const ACTIVE_USER_KEY = "internal-server:active:user";


  await subscriber.subscribe("internal-server:checkbox:click", "internal-server:active:user");
  subscriber.on("message", async(channel, message)=>{
    if(channel === "internal-server:checkbox:click"){
      const {id, isChecked} = JSON.parse(message)

      if(isChecked){
        stateArray.push(id);
      }
      else{
        const index = stateArray.indexOf(id);
        stateArray.splice(index, 1);
      }
      io.emit('server:update', JSON.parse(message));
    }

    if(channel === ACTIVE_USER_KEY){
      const userCount = await redis.get(ACTIVE_USER_KEY);
      io.emit('server:active', userCount);
    }
  } )

  io.on("connection", async (socket)=>{
    console.log("Connection opened", socket.id);
    const activeUserCount = await redis.get(ACTIVE_USER_KEY);
    if(!activeUserCount){
      await redis.set(ACTIVE_USER_KEY, 0);
    }
    let count = await redis.incr(ACTIVE_USER_KEY);
    await publisher.publish(ACTIVE_USER_KEY, count);


    socket.on('user:click', async (data)=>{
      // console.log(data);
      await publisher.publish("internal-server:checkbox:click", JSON.stringify(data));
    })


    socket.on('disconnect', async()=>{
      count = await redis.decr(ACTIVE_USER_KEY);
      await publisher.publish(ACTIVE_USER_KEY, count);
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