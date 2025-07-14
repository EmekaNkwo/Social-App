import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

interface User {
  username: string;
  socketId: string;
}

interface PrivateMessagePayload {
  to: string; // recipient username
  from: string; // sender username
  message: string;
}

interface TypingPayload {
  to: string;
  from: string;
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const onlineUsers: Map<string, string> = new Map(); // username → socket.id

io.on("connection", (socket: Socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins (with username)
  socket.on("user-join", (username: string) => {
    onlineUsers.set(username, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys())); // broadcast updated list
  });

  // Private message
  socket.on("private-message", (data: PrivateMessagePayload) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private-message", {
        from: data.from,
        message: data.message,
      });
    }
  });

  // Typing Indicator
  socket.on("typing", (data: TypingPayload) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user-typing", { from: data.from });
    }
  });

  socket.on("stop-typing", (data: TypingPayload) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user-stop-typing", { from: data.from });
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (const [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running at http://localhost:${PORT}`);
});
