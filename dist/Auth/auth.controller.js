"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const debug_1 = __importDefault(require("debug"));
const password_1 = require("../Common/services/authentication/password");
const jwtSecret = process.env.JWT_SECRET || "12321321";
const tokenExpirationInSeconds = 36000;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = __importDefault(require("../User/user.model"));
const log = (0, debug_1.default)("auth:controller");
const jwtOpts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOpts, (jwtPayload, done) => {
    user_model_1.default.findById(jwtPayload.id, (err, user) => {
        if (err)
            return done(err, false);
        if (user)
            return done(null, user);
        return done(null, false);
    });
}));
class AuthController {
    constructor() { }
    // Login Function Begins here 
    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await auth_service_1.default.findUserByEmail(email);
            log("user", user);
            if (user) {
                const isPasswordMatch = await password_1.Password.compare(user.password, password);
                if (!isPasswordMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Password"
                    });
                }
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        success: false,
                        message: "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters."
                    });
                }
                log("jwt Secret", jwtSecret);
                const token = jsonwebtoken_1.default.sign(req.body, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                return res.status(200).json({
                    success: true,
                    data: user,
                    token,
                });
            }
            else {
                log("User Not Found");
                return res.status(404).json({
                    success: false,
                    message: "User not Found"
                });
            }
        }
        catch (e) {
            next(e);
        }
    }
    async Signup(req, res, next) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const UserType = req.body.UserType;
            const user = await auth_service_1.default.findUserByEmail(email);
            log("user", user);
            if (user) {
                throw new Error("User already exists");
            }
            else {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        success: false,
                        message: "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.",
                    });
                }
                try {
                    const newUser = await auth_service_1.default.createUser({
                        username,
                        UserType,
                        email,
                        password,
                    });
                    console.log(newUser, "Comes undefined i");
                    const token = jsonwebtoken_1.default.sign({ username, password }, jwtSecret, {
                        expiresIn: tokenExpirationInSeconds,
                    });
                    console.log(token, "get's the token or break here");
                    return res.status(200).json({
                        success: true,
                        data: newUser,
                        token,
                    });
                }
                catch (e) {
                    log("Controller capturing error", e);
                    throw new Error("Error while registering");
                }
            }
        }
        catch (e) {
            next(e);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map