import config from "../../../config";
import jwt from "jsonwebtoken";
import { expiresIn1Month } from "../expires";

export const createToken = (
  params: any,
  expiresIn: number | string = expiresIn1Month,
  secret = config.jwtAccessSecret
) => {
  return jwt.sign({ sub: params._id || params.sub, ...params }, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: any,
  signature: any = config.jwtSignupSecret
) => {
  try {
    const payload: any = jwt.verify(token, signature);
    if (!payload) throw new Error("Invalid Payload!");
    return payload;
  } catch (e: any) {
    throw new Error("Invalid Token!");
  }
};
