"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../database/mongoose.service"));
const populate_1 = require("../database/populate");
async function initAndFill() {
    await mongoose_service_1.default.connectWithRetry();
    await (0, populate_1.DbPopulate)();
}
exports.default = initAndFill;
//# sourceMappingURL=initandfill.js.map