
import { Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
    constructor() {}
  
  static  async getUser(req: any, res: Response, next: NextFunction) {
      const email = req.user.email;
      try {
        const user = await UserService.finduserbyemail(email);
  
        return res.status(200).json({
          success: true,
          data: user,
        });
      } catch (e) {
        next(e);
      }
    }
  }
  