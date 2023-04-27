import { Server, Socket } from "socket.io";
import { Mapfy, UnMapfy } from "../../utils";

export class SocketService {
  server: Server = new Server(7081, {
    cors: {
      origin: "*",
    },
  });
  sockets: any = {};
  events: any = [];

  constructor() {
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
  }

  addEvent = (event: any) => this.events.push(event);

  private setEvents = (socket: any) => {
    this.events.forEach((event: any) => {
      const [name, cb] = Mapfy(event).entries().next().value;
      socket.addListener(name, (data: any) => {
        cb(data, (r: any) => {
          const [response, result] = Mapfy(r).entries().next().value;
          socket.emit(response, result);
        });
      });
    });
  };
}
