import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import boom from "@hapi/boom";
import config from "../../../../config";
import { findBy } from "../../../../modules/users/application/use_cases";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtAccessSecret,
};

export const JwtStrategy = new Strategy(opts, async (payload, done) => {
  const { email,} = payload;
  // ({ JwtStrategyEmail:email });
  try {
    const entity = await findBy("Account", { email });
    // ({ entity });
    if (entity) {
      return done(null, entity);
    }
    return done(boom.unauthorized(), false);
  } catch (e) {
    return done(e, false);
  }
});
