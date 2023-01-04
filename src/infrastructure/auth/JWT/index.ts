import config from "../../../config";
import jwt from "jsonwebtoken";
import { expiresIn1Month } from "../expires";
import { jwtVerify } from "jose";
import { signin } from "../../../application/use_cases/users";

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
  try {
    const payload: any = jwt.verify(token, signature);
    console.log({ payload });
    if (!payload) throw new Error("Invalid Payload!");
    return payload;
  } catch (e) {
    console.log();
    throw new Error("Invalid Token!");
  }
};

export const verifyToken2 = async (token: any) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(config.jwtAccessSecret)
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
