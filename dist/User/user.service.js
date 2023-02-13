"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = __importDefault(require("./user.model"));
class UserService {
    static async finduserbyemail(email) {
        return new Promise((resolve, reject) => {
            user_model_1.default.findOne({
                email: email,
            })
                .exec()
                .then((user) => resolve(user))
                .catch((error) => reject(error));
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map