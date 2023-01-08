import { Adapters } from "../application/services/DatabaseServices";
import {
  DatabaseService as DBS,
  AuthServices as AS,
  RepositoryService,
} from "../application/services";
console.log({ RepositoryService });
export const DatabaseService = RepositoryService; /* DBS(
  //Adapters.MongooseAdapter
); */

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
