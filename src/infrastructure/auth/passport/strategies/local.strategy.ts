import { Strategy } from "passport-local";
import { authSignin } from "../../../../modules/users/use_cases";

export const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const entity = await authSignin({ email, password });
      return done(null, entity);
    } catch (e) {
      done(e, false);
    }
  }
);
