import User from "../User/models/user.model";
import { IUser } from "../User/interface/user.interface";
class AuthService {
  createUser(data: IUser) {
    try {

      const user = User.build(data);
      return user.save().then(user => {

        return user;
      }).catch(e => {
        throw new Error(`Error while creating user: ${e.message}`);
      });
    } catch (e) {
      throw new Error(`Error while creating user: ${e.message}`);
    }
  
  }
  createTempUser(data: IUser) {
    try {

      const user = User.build(data);
      return user.save().then(user => {

        return user;
      }).catch(e => {
        throw new Error(`Error while creating user: ${e.message}`);
      });
    } catch (e) {
      throw new Error(`Error while creating user: ${e.message}`);
    }
    
  }
  updateUser(id: string, data: IUser) {

    return User.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  

  async findUserByEmail(email: string) {
    return User.findOne({
      email: email,
    }).exec();
  }
}


export default new AuthService();