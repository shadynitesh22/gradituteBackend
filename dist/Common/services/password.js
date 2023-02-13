"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class Password {
    static async toHash(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString("hex");
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString("hex")}.${salt}`;
    }
    static async compare(storePassword, suppliedPassword) {
        const [hashedPassword, salt] = storePassword.split(".");
        const buff = (await scryptAsync(suppliedPassword, salt, 64));
        return buff.toString("hex") === hashedPassword;
    }
}
exports.Password = Password;
//# sourceMappingURL=password.js.map