"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbPopulate = void 0;
const userType_model_1 = __importDefault(require("../../../User/models/userType.model"));
const user_types_config_1 = __importDefault(require("../../../Config/user_types.config"));
// #Create UserType Schema
async function isPopulated() {
    const user_types = await userType_model_1.default.find();
    if (user_types.length === 0) {
        return false;
    }
    return true;
}
async function DbPopulate() {
    const populated = await isPopulated();
    if (!populated) {
        for (let type in user_types_config_1.default) {
            const newType = new userType_model_1.default({
                accessRights: type
            });
            await newType.save();
        }
    }
    else {
        console.log("Database is already populated");
    }
}
exports.DbPopulate = DbPopulate;
//# sourceMappingURL=populate.js.map