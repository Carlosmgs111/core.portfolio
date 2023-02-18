import { createToken, verifyToken2 } from "../../infrastructure/auth/JWT";
import {
  expiresIn1Month,
  fifteenMinutes,
} from "../../infrastructure/auth/expires";
import config from "../../config";

export class AuthServices {
  constructor() {}

  createShortTimeKey = (payload: any) => {
    return createToken(payload, fifteenMinutes, config.jwtSignupSecret);
  };

  verifyKey = (key: any): any => {
    return verifyToken2(key);
  };

  getAuthPackage = (params: any) => {
    const token = createToken(params, expiresIn1Month);
    return {
      token,
      expire: expiresIn1Month,
      apiKey: config.apiKey,
    };
  };
}
