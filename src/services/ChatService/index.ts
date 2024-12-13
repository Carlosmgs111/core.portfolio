import { mapToList, genRandomId, UnMapfy } from "../../utils";
import { SocketService } from "../../config/dependencies";

export class ChatService {
  isOnline: Boolean = false;
  parties: any = {};

  constructor() {
    SocketService.addEvent({
      register: this.register,
    });
    // ! =======================================================================
    SocketService.addEvent({
      unregister: this.unregister,
    });
    SocketService.addEvent({
      message: async ({ message, room }: any) => {
        if (!room) return;
        SocketService.server.to(room).emit("response", { message, room });
      },
    });
    SocketService.addEvent({
      isOnline: async (isOnline: Boolean) => {
        this.setIsOnline(isOnline);
      },
    });
    SocketService.addEvent({
      updateAlias: async ({ id, alias }: any) => {
        this.parties[id].alias = alias;
        mapToList(this.parties).forEach((party: any) => {
          party.socket.emit(
            "rooms",
            mapToList(
              UnMapfy(
                SocketService.getSocketRooms(SocketService.sockets[party.id])
              )
            )
          );
        });
      },
    });
  }
  getIsOnline = () => this.isOnline;
  setIsOnline = (isOnline: Boolean) => {
    this.isOnline = isOnline;
    SocketService.broadCast("isOnline", { isOnline });
  };
  register = async ({ id, alias, kind }: any) => {
    const socket = SocketService.sockets[id];
    this.parties[id] = {
      id,
      kind,
      alias,
      rooms: [],
      socket,
    };
    if (kind === "host")
      SocketService.joinRoom({
        socket,
        room: "host",
      });
    const hostRoom = SocketService.getAllRooms().get("host");
    if (hostRoom) {
      mapToList(this.parties).forEach((party: any) => {
        SocketService.joinRoom({
          socket: SocketService.sockets[party.id],
          room: "host",
        });
      });
    }
    console.log(mapToList(UnMapfy(SocketService.getSocketRooms(socket))));
    socket.emit(
      "rooms",
      mapToList(UnMapfy(SocketService.getSocketRooms(socket)))
    );
    SocketService.addOnDisconnectEvent((socket: any) => {
      if (this.parties[socket.id].kind === "host") {
        SocketService.getAllRooms().delete("host");
      }
      delete this.parties[socket.id];
    });
    socket.emit("isOnline", { isOnline: this.isOnline });
  };
  unregister = async ({ id }: any) => {
    mapToList(this.parties).forEach((party: any) =>
      party.socket.emit(
        "rooms",
        SocketService.getRooms(SocketService.sockets[party.id])
      )
    );
  };
}
