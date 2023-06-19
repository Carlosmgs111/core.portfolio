import { Server, Socket } from "socket.io";
import io from "socket.io-client";
import { Mapfy, UnMapfy } from "../../utils";

export class SocketService {
  server: Server = new Server(7081, {
    cors: {
      origin: "*",
    },
  });
  sockets: any = {};
  clients: any = {};
  events: any = [];

  constructor(
    clients: any = [{ alias: "imageService", address: "http://127.0.0.1:8765" }]
  ) {
    this.server.on("connection", (socket: Socket) => {
      console.log(`${socket.id} Connected!`.green);
      this.sockets[socket.id] = socket;
      this.setEvents(socket);

      socket.on("disconnect", () => {
        console.log(`${socket.id} Disconnected!`.red);
        const newSockets = Mapfy(this.sockets);
        newSockets.delete(socket.id);
        this.sockets = UnMapfy(newSockets);
      });
    });
    if (clients) {
      for (let client of clients) {
        this.clients[client.alias] = io(client.address);
      }
    }
    console.log({ clients: this.clients });
  }

  addClient = (client: any) =>
    (this.clients[client.alias] = io(client.address));

  addEvent = (event: any) => this.events.push(event);

  sendMessage = (payload: any, receiverFunc: any) => {
    const [service, _params] = Mapfy(payload).entries().next().value;
    const [sendTo, ...params] = Mapfy(_params).entries().next().value;
    console.log({ service, sendTo, params });
    let responseName = "receiver_function_not_provided";
    if (receiverFunc) {
      responseName = receiverFunc.name;
      this.clients[service].on(responseName, receiverFunc);
    }
    this.clients[service].emit(sendTo, { [responseName]: [...params] });
  };

  private setEvents = (socket: any) => {
    this.events.forEach((event: any) => {
      const [name, cb] = Mapfy(event).entries().next().value;
      socket.addListener(name, (payload: any) => {
        const [response, data] = Mapfy(payload).entries().next().value;
        if (Array.isArray(data)) {
          cb(...data, (result: any) => {
            socket.emit(response, result);
          });
          return;
        }
        cb(data, (result: any) => {
          socket.emit(response, result);
        });
      });
    });
  };
}
