import { mapToList, genRandomId } from "../../utils";
import { SocketService } from "../../config/dependencies";

export class ChatService {
  isOnline: Boolean = false;
  parties: any = {};
  rooms: any = {};

  constructor() {
    SocketService.addEvent({
      register: this.register2,
    });
    // ! =======================================================================
    // SocketService.addEvent({
    //   register: this.register,
    // });
    SocketService.addEvent({
      unregister: this.unregister,
    });
    SocketService.addEvent({
      message: async ({ message, room }: any) => {
        if (!room) return;
        if (!room.parties) return;
        room.parties.forEach(({ partyId }: any) =>
          this.parties[partyId].socket.emit("response", { message, room })
        );
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
          party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id));
        });
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
  register2 = async ({ id, alias, kind }: any) => {
    this.parties[id] = {
      id,
      kind,
      alias,
      rooms: { [id]: { id, parties: [] } },
      socket: SocketService.sockets[id],
    };
    SocketService.joinRoom({ socket: SocketService.sockets[id], room: "main" });
    // SocketService.joinRoom({ socket: SocketService.sockets[id], room: "other" });
    // SocketService.joinRoom({ socket: SocketService.sockets[id], room: "another" });
    this.parties[id].socket.emit("rooms", this.getChatRooms(["main"]));
  };
  register = async ({ id, alias, kind }: any) => {
    if (this.parties[id] && this.parties[id].kind === kind) return;
    this.parties[id] = {
      id,
      kind,
      alias,
      rooms: [],
      socket: SocketService.sockets[id],
    };
    const host = this.getFlatPartyByKind(this.getFlatParties(), "host");
    if (/* !pass && */ kind === "guest" && host) {
      this.addChatRoom([this.parties[id], this.parties[host.id]]);
    }
    if (/* !pass && */ kind === "host") {
      mapToList(this.parties).forEach((party: any) => {
        if (
          party.socket.handshake.headers.origin ===
          SocketService.sockets[id].handshake.headers.origin
        ) {
          party.rooms.forEach((roomId: any) => {
            this.rooms[roomId] = [...new Set([...this.rooms[roomId], id])];
          });
          return;
        }
        if (party.id !== id) {
          this.addChatRoom([party, this.parties[id]]);
        }
      });
    }

    SocketService.addOnDisconnectEvent((socket: any) => {
      const socketId = socket.handshake.query.id;
      if (this.parties[socketId]) {
        this.removeFromChatRoom([this.parties[socketId]]);
      }
      delete this.parties[socketId];
      mapToList(this.parties).forEach((party: any) => {
        party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id));
      });
    });
    this.parties[id].socket.emit("isOnline", { isOnline: this.isOnline });
    mapToList(this.parties).forEach((party: any) =>
      party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
    );
  };
  joinRoom = async ({ id, room }: any) => {
    this.rooms[room] = [...this.rooms[room], id];
  };
  leaveRoom = async ({ id, room }: any) => {
    this.rooms[room].splice(this.rooms[room].indexOf(id), 1);
  };
  unregister = async ({ id }: any) => {
    this.removeFromChatRoom([this.parties[id]]);
    mapToList(this.parties).forEach((party: any) =>
      party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
    );
  };
  addChatRoom = (parties: any) => {
    const chatRoomId = genRandomId();
    this.rooms[chatRoomId] = [];
    parties.forEach((party: any) => {
      this.rooms[chatRoomId] = [...this.rooms[chatRoomId], party.id];
      party.rooms = [...party.rooms, chatRoomId];
      this.parties[party.id] = party;
    });
  };
  joinChatRoom = (party: any, room: any) => {
    if (!this.rooms[room]) return;
    this.rooms[room] = [...this.rooms[room], party.id];
    party.rooms = [...party.rooms, room];
    this.parties[party.id] = party;
  };
  removeFromChatRoom = (parties: any) => {
    if (!parties) return;
    parties.forEach((party: any) => {
      if (!party.rooms) return;
      party.rooms.forEach((room: any) => {
        if (!this.rooms[room]) return;
        this.leaveRoom({ id: party.id, room });
        if (this.rooms[room].length < 2) {
          const lastParty = this.parties[this.rooms[room][0]];
          if (!lastParty) return;
          lastParty.rooms.splice(lastParty.rooms.indexOf(room), 1);
          delete this.rooms[room];
        }
      });
    });
  };
  // ! Use this to generate a error and see how SocketService handle errors
  getChatRooms = (rooms: any, idsToSkip: any = []) => {
    return rooms.map((roomId: any) => {
      const roomPack: any = { id: roomId, parties: [] };
      if (!this.rooms[roomId]) return;
      this.rooms[roomId].forEach((partyId: any) => {
        if (idsToSkip.includes(partyId)) return;
        if (!roomPack.parties || !this.parties[partyId]) return;
        roomPack.parties.push({
          partyId,
          partyAlias: this.parties[partyId].alias,
        });
      });
      return roomPack;
    });
  };
}
