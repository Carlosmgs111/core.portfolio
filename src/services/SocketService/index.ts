import { Server, Socket } from "socket.io";
import { connect } from "socket.io-client";
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

  constructor(clients: any = [{ imageService: "http://127.0.0.1:8765" }]) {
    this.server.on("connection", (socket: Socket) => {
      // console.log(`${socket.id} Connected!`.green);
      this.sockets[socket.id] = socket;
      this.setEvents(socket);

      socket.on("disconnect", () => {
        // console.log(`${socket.id} Disconnected!`.red);
        const newSockets = Mapfy(this.sockets);
        newSockets.delete(socket.id);
        this.sockets = UnMapfy(newSockets);
      });
    });
    if (clients) {
      for (let client of clients) {
        this.addClient(client);
      }
    }
    return this;
  }

  addClient = (client: any) => {
    const [alias, address]: any = Mapfy(client).entries().next().value;

    this.clients[alias] = connect(address);
    this.clients[alias].on("connect", () => {
      console.log("Conexión establecida con el servidor.");
    });
    this.clients[alias].on("disconnect", () => {
      console.log("Conexión perdida con el servidor.");
    });
    this.clients[alias].on("message", (message: any) => {
      console.log(`Mensaje recibido del servidor: ${message.payload}`);
    });
    this.clients[alias].on("connect_error", (error: any) => {
      console.error("Error de conexión:", error);
    });
    return this;
  };

  addEvent = (event: any) => this.events.push(event);

  sendMessage = (payload: any, receiverFunc: any) => {
    const [service, _params] = Mapfy(payload).entries().next().value;
    const [sendTo, params] = Mapfy(_params).entries().next().value;

    let responseName = "receiver_function_not_provided";
    if (receiverFunc) {
      responseName = receiverFunc.name;
      this.clients[service].on(responseName, receiverFunc);
    }
    this.clients[service].emit(sendTo, { [responseName]: params });
  };

  private setEvents = (socket: any) => {
    this.events.forEach((event: any) => {
      const [name, cb] = Mapfy(event).entries().next().value;
      console.log({ name });
      socket.addListener(name, (payload: any) => {
        console.log({ payload });
        const [response, data] = Mapfy(payload).entries().next().value;
        console.log({ response });
        if (Array.isArray(data))
          cb(...data)
            .then((result: any) => {
              console.log({ result });
              socket.emit(response, result);
              return result;
            })
            .catch((e: any) => console.log(e.message.bgRed))
            .finally(() => console.log("Solved!".green));
        else
          cb(data)
            .then((result: any) => {
              socket.emit(response, result);
              return result;
            })
            .finally(() => console.log("Solved!".green));
      });
    });
  };

  close = async () => {
    const { server } = this;
    const clients = Mapfy(this.clients);
    const sockets = Mapfy(this.sockets);

    clients.forEach((client: any) => {
      client.close();
    });

    await server.disconnectSockets();
    await server.close();
  };
}
