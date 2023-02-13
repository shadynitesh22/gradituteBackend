"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_KEY = process.env.JWT_SECRET || Math.floor(Math.random() * 20);
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)("middleware:JWT");
class Authentication {
    authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader == "null") {
            log("Auth Headers", JWT_KEY);
            jsonwebtoken_1.default.verify(authHeader, JWT_KEY, (err, user) => {
                if (err) {
                    log("Error", err);
                    return res
                        .status(403)
                        .send({ sucess: false, message: "Token Expired" });
                }
                req['user'] = user;
                next();
            });
        }
        else {
            res.status(403).json({ success: false, message: "UnAuthorized" });
        }
    }
}
exports.default = new Authentication();
//# sourceMappingURL=authentication.js.map