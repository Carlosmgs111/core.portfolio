"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const utils_1 = require("../../utils");
class SocketService {
    constructor() {
        this.server = new socket_io_1.Server(7081, {
            cors: {
                origin: "*",
            },
        });
        this.sockets = {};
        this.events = [];
        this.addEvent = (event) => this.events.push(event);
        this.setEvents = (socket) => {
            this.events.forEach((event) => {
                const [name, cb] = (0, utils_1.Mapfy)(event).entries().next().value;
                socket.addListener(name, (data) => {
                    cb(data, (r) => {
                        const [response, result] = (0, utils_1.Mapfy)(r).entries().next().value;
                        socket.emit(response, result);
                    });
                });
            });
        };
        this.server.on("connection", (socket) => {
            ("Connected!");
            this.sockets[socket.id] = socket;
            this.setEvents(socket);
            socket.on("disconnect", () => {
                (socket.id.bgRed);
                const newSockets = (0, utils_1.Mapfy)(this.sockets);
                newSockets.delete(socket.id);
                this.sockets = (0, utils_1.UnMapfy)(newSockets);
            });
        });
    }
}
exports.SocketService = SocketService;
