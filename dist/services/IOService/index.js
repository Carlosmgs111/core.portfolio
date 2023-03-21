"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
/*
export const io = new Server({
  cors: {
    origin: "*",
  },
}); */
class SocketService {
    constructor() {
        this.socketServer = new socket_io_1.Server({
            cors: {
                origin: "*",
            },
        });
        this.socketServer.on("connection", (socket) => {
            ("Connected!");
            socket.addListener("mensaje", (data) => {
                ({ data });
            });
        });
        this.socketServer.listen(7081);
    }
}
exports.SocketService = SocketService;
