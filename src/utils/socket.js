import { Server } from "socket.io";
let connectedUsers = 0;
let stores = {};
const initializSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            // allowedHeaders: ["Content-Type", "Authorization", "authorization"],
            // credentials: true
        }
    })
    // console.log(io.sockets.connected)
    io.on("connection", (socket) => {
        connectedUsers += 1
        socket.on("count-me", (data) => {
            console.log(data)
            if (stores[data.store] > 0) {
                stores[data.store] += 1
            } else {
                stores[data.store] = 1;
            }
        })

        socket.on("disconnect-me", (data) => {
            stores[data.store] += -1
        })
        io.emit("live-users", stores);
        // io.emit("live-users", ({ count: connectedUsers }))
        socket.on("disconnect", () => {
            connectedUsers += -1
            io.emit("live-users", ({ count: connectedUsers }))
        });
    })

}
export default initializSocket;