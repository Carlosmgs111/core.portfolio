// import { createToken, verifyToken2 } from "../../infrastructure/auth/JWT";
import { expiresIn1Month, fifteenMinutes } from "./expires";
import config from "../../config";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { signin } from "../../modules/shared/auth/use_cases";

export const createToken = (
  params: any,
  expiresIn: number | string = expiresIn1Month,
  secret = config.jwtAccessSecret
) => {
  return jwt.sign({ sub: params._id || params.sub, ...params }, secret || "", {
    expiresIn,
  });
};

export const verifyToken = (
  token: any,
  signature: any = config.jwtSignupSecret
) => {
  console.log({ signature });
  try {
    const payload: any = jwt.verify(token, signature);
    console.log({ payload });
    if (!payload) throw new Error("Invalid Payload!");
    return payload;
  } catch (e) {
    console.log(e);
    throw new Error("Invalid Token!");
  }
};

export const verifyToken2 = async (
  token: any,
  signature: any = config.jwtAccessSecret
) => {
  console.log({ token, signature });
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(signature)
    );
    const { uuid, email, username } = verified.payload;
    console.log({ uuid, email, username });
    return {
      user: await signin({
        uuid,
        email,
        username,
      }),
    };
  } catch (e: any) {
    console.log({ ERROR: e.message });
    console.log("Invalid Token!");
    throw new Error("Invalid token");
  }
};

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
