import 'dotenv/config'
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import initRedisPubSub from './redis/pub-sub.redis.js';

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


  initRedisPubSub(io);

  //route for finding the total checked box
  app.get('/checked-box', (req, res)=>{
    return res.status(200).send(stateArray)
  })


  server.listen(PORT, ()=>{
    console.log(`server is listening on ${PORT}`);
  })
})();