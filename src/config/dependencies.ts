import { DatabaseService as DBS, AuthServices as AS } from "../application/services";

export const DatabaseService =  new DBS({env:"TEST"})
export const AuthServices = new AS()

const apiVersions = ["v1"]

export const apiConfig = {versions:apiVersions,version:apiVersions[apiVersions.length -1]}
