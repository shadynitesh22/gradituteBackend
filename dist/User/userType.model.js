"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_types_config_1 = __importDefault(require("../config/user_types.config"));
// Will nested in user response as a nested dict like this:
const UserTypeSechema = new mongoose_1.Schema({
    accessLevel: { type: String, required: true, default: user_types_config_1.default.user }
});
const UserType = (0, mongoose_1.model)('UserType', UserTypeSechema);
exports.default = UserType;
//# sourceMappingURL=userType.model.js.map