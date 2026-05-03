# 🧩 One Million Checkbox

A real-time, large-scale interactive web app where users across the world can check/uncheck boxes — and see updates instantly.

This project demonstrates how to efficiently handle **millions of DOM elements**, **real-time communication**, and **scalable backend architecture** using modern web technologies.

---

## 🚀 Features

* ⚡ Real-time updates using WebSockets (Socket.IO)
* 👥 Live active user count
* ✅ Global checkbox state sync across all users
* 📦 Batch rendering for performance optimization
* 👀 Infinite scroll using Intersection Observer
* ⏱️ Rate limiting (frontend + backend)
* 🧠 State persistence using Redis
* 🌐 Scalable Pub/Sub architecture

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Intersection Observer API
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* Redis (for state + Pub/Sub)
* CORS

---

## 📁 Project Structure

```
root/
│
├── public/
│   ├── index.html
│   └── style.css
│
├── redis/
│   ├── redis-connection.js
│   └── pub-sub.redis.js
│
├── server.js
├── .env
└── README.md
```

---

## ⚙️ How It Works

### 1. Checkbox Rendering

* Total checkboxes: **10,000,000**
* Loaded in batches of **2000**
* Uses **Intersection Observer** to load more when scrolling

### 2. Real-Time Sync

* When a user clicks a checkbox:

  * Event is emitted via Socket.IO
  * Backend updates Redis
  * Broadcast sent to all clients
  * UI updates instantly everywhere

### 3. State Management

* Redis stores checked checkbox IDs in a list
* New users fetch initial state using `/checked-box` API

### 4. Rate Limiting

* Users can only click once every **5 seconds**
* Prevents spam and server overload

---

## 🔌 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/one-million-checkbox.git
cd one-million-checkbox
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in root:

```env
PORT=8000
REDIS_HOST = redis_host
REDIS_PORT = redis_port
REDIS_USERNAME = your_redis_username
REDIS_PASSWORD = your_redis_password
```

---

### 4. Run the Server

```bash
npm run dev
```

or

```bash
node server.js
```

---

## 🌐 API Endpoints

### Get All Checked Boxes

```
GET /checked-box
```

Returns:

```json
[1, 45, 200, 9999]
```

---

## 🔄 Socket Events

### Client → Server

* `user:click`

```js
{
  id: "123",
  isChecked: true
}
```

---

### Server → Client

* `server:update`

```js
{
  id: "123",
  isChecked: true
}
```

* `server:active`

```js
number
```

* `server:error`

```js
"Rate limit exceeded"
```

---

## 🧠 Performance Optimizations

* ✅ DocumentFragment for batch DOM updates
* ✅ Lazy loading via Intersection Observer
* ✅ Minimal reflows & repaints
* ✅ Redis for fast in-memory operations
* ✅ Pub/Sub for horizontal scalability

---

## 📸 Demo

👉 Live: https://one-million-checkbox.onrender.com

---

## 🧑‍💻 Author

Made with ❤️ by
**intekhabx**
GitHub: https://github.com/intekhabx

---

## 📌 Future Improvements

* 🔐 Authentication system
* 📊 Analytics dashboard
* 🧵 Web Workers for heavy computation
* 🌍 Geo-based interaction insights
* 📱 Mobile UI optimization

---

## ⭐ Contribute

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make changes
4. Submit a PR 🚀


---

**If you like this project, don't forget to ⭐ the repo!**