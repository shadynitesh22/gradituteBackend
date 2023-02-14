import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from "../../User/models/user.model";

import {PassportStatic} from "passport";
import {UserService} from '../../User/services/user.service';


const jwtSecret: string = process.env.JWT_SECRET || "12321321";
const tokenExpirationInSeconds = 36000;

export default (passport: PassportStatic) => {

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOpts, async (payload, done) => {
    try {
      const user = await UserService.finduserbyemail(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  

  passport.deserializeUser(async (id, done) => {  
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });


}