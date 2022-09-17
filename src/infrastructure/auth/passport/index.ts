import passport from "passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

passport.use(LocalStrategy);
passport.use(JwtStrategy);

export const localAuthenticate = passport.authenticate("local", {
  session: false
});
export const jwtAuthenticate = passport.authenticate("jwt", { session: false });

export default passport.initialize();