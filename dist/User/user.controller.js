"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
class UserController {
    constructor() { }
    static async getUser(req, res, next) {
        const email = req.user.email;
        try {
            const user = await user_service_1.UserService.finduserbyemail(email);
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map