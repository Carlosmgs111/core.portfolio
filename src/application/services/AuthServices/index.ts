import { createToken, verifyToken } from "../../../infrastructure/auth/JWT";
import {
  expiresIn1Month,
  fifteenMinutes,
} from "../../../infrastructure/auth/expires";
import config from "../../../config";

export class AuthServices {
  constructor() {}

  createShortTimeKey = (payload: any) => {
    return createToken(payload, fifteenMinutes, config.jwtSignupSecret);
  };

  verifyKey =(key:any)=>{
    return verifyToken(key, config.jwtSignupSecret)
  }

  getAuthPackage = (params: any) => {
    const token = createToken(params, expiresIn1Month);
    console.log({ token });
    return {
      token,
      expire: expiresIn1Month,
      apiKey: config.apiKey,
    };
  };
}
