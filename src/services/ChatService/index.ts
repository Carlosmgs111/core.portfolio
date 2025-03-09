import { mapToList, genRandomId, UnMapfy } from "../../utils";
import { SocketService } from "../../config/dependencies";

export class ChatService {
  parties: any = {};
  constructor() {
    SocketService.addEvent({
      register: this.register,
    });
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
      isOnline: async (id: any, isOnline: Boolean) => {
        this.setIsOnline(id, isOnline);
      },
    });
    SocketService.addEvent({
      updateAlias: this.updateAlias,
    });
  }
  register = async ({ id, alias, kind }: any) => {
    const socket = SocketService.sockets[id];
    this.parties[id] = {
      id,
      kind,
      alias,
      socket,
      isOnline: true,
      origin: socket.handshake.headers.origin,
    };
    SocketService.addOnDisconnectEvent((socket: any) => {
      delete this.parties[socket.id];
      mapToList(this.parties).forEach((party: any) => {
        party.socket.emit("rooms", this.getSocketRoomsList(party.socket));
        console.log(this.getSocketRoomsList(party.socket));
      });
    });
    console.log(this.parties[id].isOnline)
    socket.emit("isOnline", { isOnline: this.parties[id].isOnline });
  };
  unregister = async ({ id }: any) => {
    delete this.parties[id];
    mapToList(this.parties).forEach((party: any) => {
      party.socket.emit("rooms", this.getSocketRoomsList(party.socket));
    });
  };
  updateAlias = async ({ id, alias }: any) => {
    this.parties[id].alias = alias;
    mapToList(this.parties).forEach((party: any) => {
      party.socket.emit("rooms", this.getSocketRoomsList(party.socket));
    });
  };
  getIsOnline = (id: any) => this.parties[id]?.isOnline || false;
  private setIsOnline = (id: any, isOnline: Boolean) => {
    this.parties[id] = isOnline;
    SocketService.broadCast("isOnline", { isOnline });
  };
  private getSocketRoomsList = (socket: any) => {
    const socketRoomsList = mapToList(
      UnMapfy(SocketService.getSocketRooms(socket))
    );
    socketRoomsList.shift();
    return socketRoomsList;
  };
}
