import { NextFunction, Request, Response } from "express";
import authService from "./auth.service";
import jwt from "jsonwebtoken";
import debug, { IDebugger } from "debug";
import { Password } from "../Common/services/authentication/password";
import { sendActivationEmail, verifyEmail } from "../User/services/sendVerificationEmail.service";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../User/models/user.model";
import { ApiError, PasswordFormatter, UserEmpty, UserExists } from "../ErrorHandlers/ApiError";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../ErrorHandlers/ErrorHandlers";
import { cookie } from "express-validator";



const jwtSecret: string = process.env.JWT_SECRET
const tokenExpirationInSeconds = process.env.tokenExpirationInSeconds;
const log: IDebugger = debug("auth:controller");

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOpts, (jwtPayload, done) => {
    User.findById(jwtPayload.id, (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      return done(null, false);
    });
  })
);



export class AuthController {
  constructor() { }




  // Login Function Begins here 

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await authService.findUserByEmail(email);
      log("user", user);

      if (user) {

        const isPasswordMatch = await Password.compare(user.password, password);
        if (!isPasswordMatch) {
          throw new ApiError("Password Wrong", StatusCodes.UNAUTHORIZED, "The password you typed is incorrect. Please try again.")
        }

        console.log("jwt Secret", jwtSecret);

        const token = jwt.sign({ email }, jwtSecret, {
          expiresIn: tokenExpirationInSeconds,
        });
        return res.status(StatusCodes.OK).json({
          success: true,
          data: user,
          token,
        });
      } else {

        ErrorHandler.handleError(new UserEmpty(), req, res, next);
      }
    } catch (error) {
      ErrorHandler.handleError(error, req, res, next);
    }
  }




  // Login Function Ends here


  // Signup Function Begins here
  async Signup(req: Request, res: Response, next: NextFunction) {

    try {
      const { firstName, lastName, email, password, UserType, isActive } = req.body;

      const user = await authService.findUserByEmail(email);
      log.info("user", user);

      if (!user) {

        const passwordError = PasswordFormatter(req);
        const newUser = await authService.createUser({ firstName, lastName, UserType, email, password, isActive });
        sendActivationEmail(newUser.email)
        log.success("newUser", newUser);
        const message = `Email has been send to your email ${newUser.email}. Open the email to activate your account`

        return res.status(200).json({
          success: true,
          data: newUser,
          message: message,
        });


      } else {
        log.error("User already exists");
        ErrorHandler.handleError(new UserExists(), req, res, next);
      }

    } catch (error) {
      ErrorHandler.handleError(error, req, res, next);
    }
  }

  // Signup Function Ends here


  async CompleteSignup(req: Request, res: Response, next: NextFunction) {

    try {
      const { email, token, password } = req.body;
      const user = await authService.findUserByEmail(email);

      if (user) {
        const isTokenMatch = await verifyEmail(user.email, token);
        if (isTokenMatch) {
          const newUser = await authService.updateUser(user._id, {
            isActive: true,
            UserType: "User",
            email: "",
            password: "",
            firstName: "",
            lastName: ""
          })
          const token = jwt.sign({ email, password }, jwtSecret, { expiresIn: tokenExpirationInSeconds });

          log.info("newUser", newUser);
          // toDO create seprate funtion for this
          passport.authenticate("token", { session: false });
          const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          console.log("ip_address", ip_address);
          const user_cookie = cookie.apply(token, ip_address);
          // toDO create seprate funtion for this
          var oneWeek = 7 * 24 * 60 * 60 * 1000;
          req.session.cookie.expires = new Date(Date.now() + oneWeek);
          req.session.cookie.maxAge = oneWeek;
          passport.session(user_cookie);

          log.success("success", "Account has been activated successfully")
          return res.status(200).json({
            success: true,
            data: newUser,
            message: "Account has been activated successfully",
            token: token
          });


        } else {
          log.error("Token Mismatch", "The token you typed is incorrect. Please try again.")
          throw new ApiError("Token Mismatch", StatusCodes.UNAUTHORIZED, "The token you typed is incorrect. Please try again.")

        }
      } else {
        log.error("User Not Found", "The user you are looking for does not exist.")
        throw new ApiError("User Not Found", StatusCodes.NOT_FOUND, "The user you are looking for does not exist.")
      }


    } catch (error) {

      ErrorHandler.handleError(error, req, res, next);
    }

  }


}


export async function rememberMe(req: Request, res: Response, next: NextFunction) {
  if (req.body.remember) {

    var oneWeek = 7 * 24 * 60 * 60 * 1000;
    req.session.cookie.expires = new Date(Date.now() + oneWeek);
    req.session.cookie.maxAge = oneWeek;
  }
  next();
}