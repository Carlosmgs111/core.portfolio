import { ServicesInterfaceEnums } from "../application/services/DatabaseServices"
import {
  DatabaseService as DBS,
  AuthServices as AS,
} from "../application/services";

export const DatabaseService = DBS(/* ServicesInterfaceEnums.DatabaseMongooseService */);
export const AuthServices = new AS();

const apiVersions = ["v1"];
const uiVersions = ["v1"]

export const apiConfig = {
  versions: apiVersions,
  version: apiVersions[apiVersions.length - 1],
};

export const uiConfig = {
  versions: uiVersions,
  version: uiVersions[uiVersions.length - 1],
};
