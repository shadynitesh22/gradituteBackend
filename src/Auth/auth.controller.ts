import { NextFunction, Request, Response } from "express";
import authService from "./auth.service";
import jwt from "jsonwebtoken";
import debug, { IDebugger } from "debug";
import { Password } from "../Common/services/authentication/password";
const jwtSecret: string = process.env.JWT_SECRET || "12321321";
const tokenExpirationInSeconds = 36000;
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../User/models/user.model";
import { CreateUserRequest } from "../Validators/CreateUserRequest";
import { ApiError } from "../utils/ApiError";
import RequestValidator from "../utils/Request.Validator";
import { StatusCodes } from "http-status-codes";

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
        console.log("user", user);
  
        if (user) {
          const isPasswordMatch = await Password.compare(user.password, password);
          if (!isPasswordMatch) {
            throw new ApiError(
              "Invalid Password",
              StatusCodes.BAD_REQUEST,
              "Two passwords are not the same"
            );
          }
  
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
          if (!passwordRegex.test(password)) {
            throw new ApiError(
              "Password formate is not correct",
              StatusCodes.BAD_REQUEST,
              "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters."
            );
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
          console.log("User Not Found");
          throw new ApiError(
            "User not found",
            StatusCodes.NOT_FOUND,
            "You don't have an account"
          );
        }
      } catch (e) {
        next(e);
      }
    }
    
    
    
    
    // Login Function Ends here
  


    async Signup(req: Request, res: Response, next: NextFunction) {
        try {
          const username = req.body.username;
          const email = req.body.email;
          const password = req.body.password;
          const UserType = req.body.UserType;
      
          const user = await authService.findUserByEmail(email);
          log("user", user);
      
          if (user) {
            throw new Error("User already exists");
          } else {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(password)) {
              return res.status(400).json({
                success: false,
                message:
                  "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.",
              });
            }
            try {
              const newUser = await authService.createUser({
                username,
                UserType,
                email,
                password,
              });
              console.log(newUser, "Comes undefined i");
              const token = jwt.sign({ username, password }, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
              });
              console.log(token, "get's the token or break here");
              return res.status(200).json({
                success: true,
                data: newUser,
                token,
              });
            } catch (e) {
              log("Controller capturing error", e);
              throw new Error("Error while registering");
            }
          }
        } catch (e) {
          next(e);
        }
      }
      
    

}

export async function rememberMe(req: Request, res: Response, next: NextFunction){
  if(req.body.remember){
      console.log('remember me');
      console.log(req.body.remember);
      var oneWeek = 7 * 24 * 60 * 60 * 1000;
      req.session.cookie.expires = new Date(Date.now() + oneWeek);
      req.session.cookie.maxAge = oneWeek;
  }
  next();
}