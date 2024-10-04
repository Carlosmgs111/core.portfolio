import config from "./index";
import { Adapters } from "../services/RepositoryService";
import {
  RepositoryService as RS,
  AuthServices as AS,
  TaskMessageService as TMS,
  CQRSService,
  SocketService as SS,
  MailerService as MS,
  ChatService as CS,
  RESTAPIService as RA,
} from "../services";

const repositoryServices = {
  CQRS: () => new CQRSService(),
  DBS: () => RS(Adapters.SequelizeAdapter),
};

export const TaskMessageService = new TMS();
export const RepositoryService = repositoryServices.CQRS();
export const AuthServices = new AS();
export const SocketService: any = new SS();
export const MailerService = new MS();
export const ChatService = new CS();
export const RESTAPIService = new RA();

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
