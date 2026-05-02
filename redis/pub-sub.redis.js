import { publisher, subscriber, redis } from './redis-connection.js';


export const STATE_ARRAY_KEY = "redis-state-array";


async function initRedisPubSub(io){

  const ACTIVE_USER_KEY = "internal-server:active:user";
  const timeGap = 5 * 1000; //5sec


  await subscriber.subscribe("internal-server:checkbox:click", "internal-server:active:user");
  subscriber.on("message", async(channel, message)=>{
    if(channel === "internal-server:checkbox:click"){
      const {id, isChecked} = JSON.parse(message)

      if(isChecked){
        await redis.rpush(STATE_ARRAY_KEY, id); //auto array creation and insert id
      }
      else{
        await redis.lrem(STATE_ARRAY_KEY, 1, id); //remove first id -leftremove
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
      // rate limiting
      const RATE_LIMIT_KEY = `rate-limiting-${socket.id}`;

      const isAllowed = await redis.set(RATE_LIMIT_KEY,"1",
              "NX", //creae if not exists
              "PX", //ttl in milisecond
              timeGap //remove after 5 sec
              );

      if(isAllowed){
        await publisher.publish("internal-server:checkbox:click", JSON.stringify(data));
      }
      else{
        socket.emit("server:error", `next click will be available ${timeGap/1000} sec after previous click`);
      }
      // rate limiting--
      // const prevClickTime = await redis.get(RATE_LIMIT_KEY);
      // if(prevClickTime){
      //   const currClickTime = Date.now();
      //   if(currClickTime - prevClickTime > timeGap){
      //     await redis.set(RATE_LIMIT_KEY, currClickTime);
      //     await publisher.publish("internal-server:checkbox:click", JSON.stringify(data));
      //     return;
      //   }
      //   socket.emit("server:error", `next click will be available ${timeGap/1000} sec after previous click`);
      // }
      // else{
      //   await redis.set(RATE_LIMIT_KEY, Date.now())
      //   await publisher.publish("internal-server:checkbox:click", JSON.stringify(data));
      // }
    })


    socket.on('disconnect', async()=>{
      count = await redis.decr(ACTIVE_USER_KEY);
      await publisher.publish(ACTIVE_USER_KEY, count);
    })

  })
}


export default initRedisPubSub;
