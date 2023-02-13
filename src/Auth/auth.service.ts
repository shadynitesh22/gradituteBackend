import User from "../User/user.model";
import { IUser } from "../User/user.interface";
class AuthService {
  createUser(data: IUser) {
    try {

      const user = User.build(data);
      return user.save().then(user => {
        // console.log(user, "Works hai");
        return user;
      }).catch(e => {
        throw new Error(`Error while creating user: ${e.message}`);
      });
    } catch (e) {
      throw new Error(`Error while creating user: ${e.message}`);
    }
  
  }
  

  async findUserByEmail(email: string) {
    return User.findOne({
      email: email,
    }).exec();
  }
}


export default new AuthService();