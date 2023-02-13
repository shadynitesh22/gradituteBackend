import User from "./user.model";

export class UserService {
  static async finduserbyemail(email: string) {
    return new Promise((resolve, reject) => {
      User.findOne({
        email: email,
      })
        .exec()
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    });
  }
}