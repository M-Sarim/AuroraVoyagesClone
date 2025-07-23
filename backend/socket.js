import { Server } from "socket.io";

// Map to store active user connections
const userSockets = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Get user ID from query parameters
    const userId = socket.handshake.query.userId;

    if (userId) {
      // Store user's socket connection
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);

      console.log(`User ${userId} connected with socket ${socket.id}`);
      console.log(`Active users: ${userSockets.size}`);
    }

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      if (userId) {
        // Remove socket from user's connections
        const userSocketSet = userSockets.get(userId);
        if (userSocketSet) {
          userSocketSet.delete(socket.id);

          // If user has no more active connections, remove from map
          if (userSocketSet.size === 0) {
            userSockets.delete(userId);
          }

          console.log(`User ${userId} disconnected socket ${socket.id}`);
          console.log(`Active users: ${userSockets.size}`);
        }
      }
    });
  });

  return io;
};

// Send notification to a specific user
const sendNotificationToUser = (io, userId, notification) => {
  if (userSockets.has(userId)) {
    const socketIds = userSockets.get(userId);

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("notification", notification);
    });

    console.log(`Notification sent to user ${userId}`);
    return true;
  }

  console.log(`User ${userId} not connected, notification not sent`);
  return false;
};

// Send booking update to a user
const sendBookingUpdate = (io, userId, booking) => {
  if (userSockets.has(userId)) {
    const socketIds = userSockets.get(userId);

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("booking_update", booking);
    });

    console.log(`Booking update sent to user ${userId}`);
    return true;
  }

  console.log(`User ${userId} not connected, booking update not sent`);
  return false;
};

// Send tour guide application update
const sendTourGuideUpdate = (io, userId, data) => {
  if (userSockets.has(userId)) {
    const socketIds = userSockets.get(userId);

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("tour_guide_update", data);
    });

    console.log(`Tour guide update sent to user ${userId}`);
    return true;
  }

  console.log(`User ${userId} not connected, tour guide update not sent`);
  return false;
};

// Send vacation package update
const sendPackageUpdate = (io, userId, data) => {
  if (userSockets.has(userId)) {
    const socketIds = userSockets.get(userId);

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("package_update", data);
    });

    console.log(`Package update sent to user ${userId}`);
    return true;
  }

  console.log(`User ${userId} not connected, package update not sent`);
  return false;
};

// Broadcast notification to all connected users
const broadcastNotification = (io, notification) => {
  io.emit("notification", notification);
  console.log("Broadcast notification sent to all users");
};

export {
  initializeSocket,
  sendNotificationToUser,
  sendBookingUpdate,
  sendTourGuideUpdate,
  sendPackageUpdate,
  broadcastNotification,
};
