"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                    if (Array.isArray(data))
                        cb(...data)
                            .then((result) => {
                            socket.emit(response, result);
                            return result;
                        })
                            .catch((e) => console.log(e.message.bgRed));
                    // .finally(() => console.log("Solved!".green));
                    else
                        cb(data).then((result) => {
                            socket.emit(response, result);
                            return result;
                        });
                    // .finally(() => console.log("Solved!".green));
                });
            });
        };
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            const { server } = this;
            const clients = (0, utils_1.Mapfy)(this.clients);
            const sockets = (0, utils_1.Mapfy)(this.sockets);
            clients.forEach((client) => {
                client.close();
            });
            yield server.disconnectSockets();
            yield server.close();
        });
        this.server.on("connection", (socket) => {
            // console.log(`${socket.id} Connected!`.green);
            this.sockets[socket.id] = socket;
            this.setEvents(socket);
            socket.on("disconnect", () => {
                // console.log(`${socket.id} Disconnected!`.red);
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
        return this;
    }
}
exports.SocketService = SocketService;
