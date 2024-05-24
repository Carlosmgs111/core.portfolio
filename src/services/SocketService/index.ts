import { Server, Socket } from "socket.io";
import { connect } from "socket.io-client";
import { Mapfy, UnMapfy } from "../../utils";
import config from "../../config";

export class SocketService {
  server: Server = new Server(config.socketServicePort, {
    cors: {
      origin: "*",
    },
  });
  sockets: any = {};
  clients: any = {};
  events: any = [];

  constructor(clients: any = []) {
    this.server.on("connection", (socket: Socket) => {
      this.sockets[socket.id] = socket;
      this.setEvents(socket);

      socket.on("disconnect", () => {
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
    const [client, sendTo, params, receiverFunctionName] =
      this.extractRemoteHandlersSpecs(payload, receiverFunc);
    if (Mapfy(this.clients).size && this.clients[client]) {
      this.clients[client].emit(sendTo, { [receiverFunctionName]: params });
      if (receiverFunc) {
        return this.receiveMessage({
          [client]: receiverFunc,
        });
      }
    }
    return this;
  };

  receiveMessage = (payload: any) => {
    let [client, receiveIn, callback] =
      this.extractRemoteHandlersSpecs(payload);
    return new Promise((resolve, reject) => {
      this.clients[client].on(receiveIn, (data: any) => {
        let proccesedData = null;
        const { payload, error } = data;
        if (payload) proccesedData = payload;
        resolve(callback(proccesedData));
      });
    });
  };

  extractRemoteHandlersSpecs = (object: any, receiverFunc: any = null) => {
    let specs = <Array<any>>[];

    const [client, _payload] = Mapfy(object).entries().next().value;
    const [sendTo, paramsOrCallback] = Mapfy(_payload).entries().next().value;
    specs = [client, sendTo, paramsOrCallback];
    if (typeof receiverFunc === "string") specs = [...specs, receiverFunc];
    else if (receiverFunc) {
      specs = [...specs, this.extractFunctionSpecs(receiverFunc)[0]];
    }

    return specs;
  };

  extractFunctionSpecs = (object: any) => {
    let [functionName, callback] = ["function_not_provided", ([]) => {}];
    if (object instanceof Function) {
      [functionName, callback] = [object.name, object];
    } else if (callback instanceof Object) {
      [functionName, callback] = Mapfy(object).entries().next().value;
    }
    return [functionName, callback];
  };

  private setEvents = (socket: any) => {
    this.events.forEach((event: any) => {
      const [name, cb] = Mapfy(event).entries().next().value;
      socket.addListener(name, (payload: any) => {
        const [response, data] = Mapfy(payload).entries().next().value;
        if (Array.isArray(data))
          cb(...data)
            .then((result: any) => {
              socket.emit(response, result);
              return result;
            })
            .catch((e: any) =>
              console.log(`Error in callback: ${e.message}`.bgRed)
            )
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
