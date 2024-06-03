import config from "./index";
import { Adapters } from "../services/DatabaseServices";
import {
  DatabaseService as DBS,
  AuthServices as AS,
  TaskMessageService as TMS,
  CQRSService,
  SocketService as SS,
} from "../services";

const repositoryServices = {
  CQRS: () => new CQRSService(),
  DBS: () => DBS(Adapters.MongooseAdapter),
};

export const TaskMessageService = new TMS();
export const RepositoryService = repositoryServices.CQRS();
export const AuthServices = new AS();
export const SocketService: any = new SS();

const imageService = config.imageServiceUrlDev || config.imageServiceUrlProd;

SocketService.addClient({
  imageService,
  path: config.websocketPath,
}); /* // ! ⬅️ Disabled in production until the service is online */

// SocketService.addClient({ remoteImageService: config.imageServiceUrlProd });

const apiVersions = ["v1"];
const uiVersions = ["v1"];

export const apiConfig = {
  versions: apiVersions,
  version: apiVersions[apiVersions.length - 1],
};

export const uiConfig = {
  versions: uiVersions,
  version: uiVersions[uiVersions.length - 1],
};
