import { Adapters } from "../services/DatabaseServices";
import {
  DatabaseService as DBS,
  AuthServices as AS,
  CQRSService,
} from "../services";

const repositoryServices = {
  CQRS: () => new CQRSService(),
  DBS: () => DBS(Adapters.MongooseAdapter),
};

export const RepositoryService = repositoryServices.CQRS();

export const AuthServices = new AS();

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
