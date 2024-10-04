import { Strategy } from "passport-local";
import { authSignin } from "../../../../modules/shared/auth/application/use_cases";
import { RepositoryService } from "../../../../config/dependencies";
import bcrypt from "bcrypt";

export const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const entity = await authSignin(RepositoryService, bcrypt, {
        email,
        password,
      });
      return done(null, entity);
    } catch (e) {
      done(e, false);
    }
  }
);
