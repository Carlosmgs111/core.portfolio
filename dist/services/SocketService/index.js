"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const socket_io_client_1 = require("socket.io-client");
const utils_1 = require("../../utils");
class SocketService {
    constructor(clients = [{ imageService: "http://127.0.0.1:8765" }]) {
        this.server = new socket_io_1.Server(7081, {
            cors: {
                origin: "*",
            },
        });
        this.sockets = {};
        this.clients = {};
        this.events = [];
        this.addClient = (client) => {
            const [alias, address] = (0, utils_1.Mapfy)(client).entries().next().value;
            this.clients[alias] = (0, socket_io_client_1.connect)(address);
            this.clients[alias].on("connect", () => {
                console.log("Conexión establecida con el servidor.");
            });
            this.clients[alias].on("disconnect", () => {
                console.log("Conexión perdida con el servidor.");
            });
            this.clients[alias].on("message", (message) => {
                console.log(`Mensaje recibido del servidor: ${message.payload}`);
            });
            this.clients[alias].on("connect_error", (error) => {
                console.error("Error de conexión:", error);
            });
            return this;
        };
        this.addEvent = (event) => this.events.push(event);
        this.sendMessage = (payload, receiverFunc) => {
            const [service, _params] = (0, utils_1.Mapfy)(payload).entries().next().value;
            const [sendTo, params] = (0, utils_1.Mapfy)(_params).entries().next().value;
            console.log({ service, sendTo, params });
            let responseName = "receiver_function_not_provided";
            if (receiverFunc) {
                responseName = receiverFunc.name;
                this.clients[service].on(responseName, receiverFunc);
            }
            this.clients[service].emit(sendTo, { [responseName]: params });
        };
        this.setEvents = (socket) => {
            this.events.forEach((event) => {
                const [name, cb] = (0, utils_1.Mapfy)(event).entries().next().value;
                socket.addListener(name, (payload) => {
                    const [response, data] = (0, utils_1.Mapfy)(payload).entries().next().value;
                    if (Array.isArray(data)) {
                        cb(...data, (result) => {
                            socket.emit(response, result);
                        });
                        return;
                    }
                    cb(data, (result) => {
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
                this.addClient(client);
            }
        }
        console.log({ clients: this.clients });
        return this;
    }
}
exports.SocketService = SocketService;
