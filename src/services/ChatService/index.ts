import { SocketService } from "../../config/dependencies";
import { mapToList } from "../../utils";

export class ChatService {
  isOnline: Boolean = false;
  clientAdress: string | null = null;

  constructor() {}
  getClienAddress = () => this.clientAdress;
  setClientAdress = (clientAdress: string) =>
    (this.clientAdress = clientAdress);
  getIsOnline = () => this.isOnline;
  setIsOnline = (isOnline: Boolean) => {
    this.isOnline = isOnline;
    mapToList(SocketService.sockets).map((socket: any) => {
      socket.emit("isOnline", { isOnline });
    });
  };
}
