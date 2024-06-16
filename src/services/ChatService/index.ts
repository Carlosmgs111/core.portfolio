import { mapToList, genRandomId } from "../../utils";
import { SocketService } from "../../config/dependencies";

export class ChatService {
  isOnline: Boolean = false;
  parties: any = {};
  chatRooms: any = {};
  mainClientId: any = null;

  constructor() {
    SocketService.addEvent({
      register: async ({ id, alias, kind }: any) => {
        if (this.parties[id] && this.parties[id].kind === kind) return;
        this.parties[id] = {
          id,
          kind,
          alias,
          rooms: [],
          socket: SocketService.sockets[id],
        };
        const host = this.getFlatPartyByKind(this.getFlatParties(), "host");
        if (kind === "guest" && host) {
          this.addChatRoom([this.parties[id], this.parties[host.id]]);
        }
        mapToList(this.parties).forEach((party: any) => {
          if (kind === "host" && party.id !== id) {
            this.addChatRoom([party, this.parties[id]]);
          }
        });
        SocketService.addOnDisconnectEvent((socket: any) => {
          const socketId = socket.handshake.query.id;
          this.removeFromChatRoom([this.parties[socketId]]);
          delete this.parties[socketId];
        });
        this.parties[id].socket.emit("isOnline", { isOnline: this.isOnline });
      },
    });
    SocketService.addEvent({
      message: async ({ message, from, to }: any) => {
        this.parties[to.id].socket.emit("response", { message, from, to });
      },
    });
    SocketService.addEvent({
      isOnline: async (isOnline: Boolean) => {
        this.setIsOnline(isOnline);
      },
    });
  }
  getIsOnline = () => this.isOnline;
  setIsOnline = (isOnline: Boolean) => {
    this.isOnline = isOnline;
    SocketService.broadCast("isOnline", { isOnline });
  };
  getFlatParties = () =>
    mapToList(this.parties, false).map((party: any) => ({
      id: party[0],
      alias: party[1].alias,
      kind: party[1].kind,
      rooms: party[1].rooms,
    }));
  getFlatPartyById = (flatParties: any, id: any) =>
    flatParties.filter((p: any) => p.id == id)[0];
  getFlatPartyByKind = (flatParties: any, kind: any) =>
    flatParties.filter((p: any) => p.kind == kind)[0];
  addChatRoom = (parties: any) => {
    const chatRoomId = genRandomId();
    this.chatRooms[chatRoomId] = [];
    parties.forEach((party: any) => {
      this.chatRooms[chatRoomId] = [...this.chatRooms[chatRoomId], party.id];
      party.rooms = [...party.rooms, chatRoomId];
      this.parties[party.id] = party;
      this.parties[party.id].socket.emit("rooms", party.rooms);
    });
  };
  removeFromChatRoom = (parties: any) => {
    parties.forEach((party: any) => {
      party.rooms.forEach((room: any) => {
        if (!this.chatRooms[room]) return;
        this.chatRooms[room].splice(this.chatRooms[room].indexOf(party.id), 1);
        if (this.chatRooms[room].length < 2) {
          const lastParty = this.parties[this.chatRooms[room][0]];
          lastParty.rooms.splice(lastParty.rooms.indexOf(room), 1);
          delete this.chatRooms[room];
        }
      });
    });
  };
}
