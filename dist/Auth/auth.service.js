"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../User/user.model"));
class AuthService {
    createUser(data) {
        try {
            const user = user_model_1.default.build(data);
            return user.save().then(user => {
                // console.log(user, "Works hai");
                return user;
            }).catch(e => {
                throw new Error(`Error while creating user: ${e.message}`);
            });
        }
        catch (e) {
            throw new Error(`Error while creating user: ${e.message}`);
        }
    }
    async findUserByEmail(email) {
        return user_model_1.default.findOne({
            email: email,
        }).exec();
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map