"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const utils_1 = require("../../utils");
class SocketService {
    constructor(clients = [{ alias: "imageService", address: "http://127.0.0.1:8765" }]) {
        this.server = new socket_io_1.Server(7081, {
            cors: {
                origin: "*",
            },
        });
        this.sockets = {};
        this.clients = {};
        this.events = [];
        this.addClient = (client) => (this.clients[client.alias] = (0, socket_io_client_1.default)(client.address));
        this.addEvent = (event) => this.events.push(event);
        this.sendMessage = (event, payload) => {
            this.clients[event.alias].emit(event.event, payload);
            const [name, cb] = (0, utils_1.Mapfy)(event).entries().next().value;
        };
        this.setEvents = (socket) => {
            this.events.forEach((event) => {
                const [name, cb] = (0, utils_1.Mapfy)(event).entries().next().value;
                socket.addListener(name, (data) => {
                    cb(data, (_result) => {
                        const [response, result] = (0, utils_1.Mapfy)(_result).entries().next().value;
                        socket.emit(response, result);
                    });
                });
            });
        };
        this.server.on("connection", (socket) => {
            console.log(`${socket.id} Connected!`.green);
            this.sockets[socket.id] = socket;
            this.setEvents(socket);
            socket.on("disconnect", () => {
                console.log(`${socket.id} Disconnected!`.red);
                const newSockets = (0, utils_1.Mapfy)(this.sockets);
                newSockets.delete(socket.id);
                this.sockets = (0, utils_1.UnMapfy)(newSockets);
            });
        });
        if (clients) {
            for (let client of clients) {
                this.clients[client.alias] = (0, socket_io_client_1.default)(client.address);
            }
        }
        console.log({ clients: this.clients });
    }
}
exports.SocketService = SocketService;
