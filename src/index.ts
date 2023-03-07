import "colors";
import app from "./infrastructure/apis/express/index";
import terminal from "./infrastructure/apis/terminal";
import { RepositoryService, SocketService } from "./config/dependencies";

SocketService.addEvent({
  mensaje:  (data: any, responseCb: any) => {
    console.log({ data });
    responseCb({ messageReceived: `Received: ${data}` });
  },
});

RepositoryService.info();
(async () => {
  await app();
  await terminal();
})();
