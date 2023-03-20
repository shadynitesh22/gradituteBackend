"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rememberMe = exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const debug_1 = __importDefault(require("debug"));
const password_1 = require("../Common/services/authentication/password");
const sendVerificationEmail_service_1 = require("../User/services/sendVerificationEmail.service");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = __importDefault(require("../User/models/user.model"));
const ApiError_1 = require("../ErrorHandlers/ApiError");
const http_status_codes_1 = require("http-status-codes");
const ErrorHandlers_1 = __importDefault(require("../ErrorHandlers/ErrorHandlers"));
const jwtSecret = process.env.JWT_SECRET;
const tokenExpirationInSeconds = process.env.tokenExpirationInSeconds;
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
                    throw new ApiError_1.ApiError("Password Wrong", http_status_codes_1.StatusCodes.UNAUTHORIZED, "The password you typed is incorrect. Please try again.");
                }
                console.log("jwt Secret", jwtSecret);
                const token = jsonwebtoken_1.default.sign({ email }, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: user,
                    token,
                });
            }
            else {
                ErrorHandlers_1.default.handleError(new ApiError_1.UserEmpty(), req, res, next);
            }
        }
        catch (error) {
            ErrorHandlers_1.default.handleError(error, req, res, next);
        }
    }
    // Login Function Ends here
    async Signup(req, res, next) {
        try {
            const { firstName, lastName, email, password, UserType, isActive } = req.body;
            const user = await auth_service_1.default.findUserByEmail(email);
            log("user", user);
            if (!user) {
                const passwordError = (0, ApiError_1.PasswordFormatter)(req);
                console.log(passwordError, "passwordError");
                const newUser = await auth_service_1.default.createUser({ firstName, lastName, UserType, email, password, isActive });
                (0, sendVerificationEmail_service_1.sendActivationEmail)(newUser.email);
                log("newUser", newUser);
                //  const token = jwt.sign({ email, password }, jwtSecret, { expiresIn: tokenExpirationInSeconds });
                //  console.log("token", token);
                const message = `Email has been send to your email ${newUser.email}. Open the email to activate your account`;
                return res.status(200).json({
                    success: true,
                    data: newUser,
                    message: message,
                });
            }
            else {
                ErrorHandlers_1.default.handleError(new ApiError_1.UserExists(), req, res, next);
            }
        }
        catch (error) {
            ErrorHandlers_1.default.handleError(error, req, res, next);
        }
    }
    async CompleteSignup(req, res, next, User) {
    }
}
exports.AuthController = AuthController;
async function rememberMe(req, res, next) {
    if (req.body.remember) {
        console.log('remember me');
        console.log(req.body.remember);
        var oneWeek = 7 * 24 * 60 * 60 * 1000;
        req.session.cookie.expires = new Date(Date.now() + oneWeek);
        req.session.cookie.maxAge = oneWeek;
    }
    next();
}
exports.rememberMe = rememberMe;
//# sourceMappingURL=auth.controller.js.map