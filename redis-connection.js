import Redis from "ioredis";

// export const publisher = new Redis({
//   host: 'localhost',
//   port: 6379
// })

// export const subscriber = new Redis({
//   host: 'localhost',
//   port: 6379
// })


function createRedisConnection(){
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD
  })
}


export const publisher = createRedisConnection(); //to pushlish something
export const subscriber = createRedisConnection(); //to listen events
export const redis = createRedisConnection(); // to read and write