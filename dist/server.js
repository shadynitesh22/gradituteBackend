"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const debug_1 = __importDefault(require("debug"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_service_1 = __importDefault(require("./Common/services/database/mongoose.service"));
const routes_1 = __importDefault(require("./routes"));
dotenv.config();
const session = require('express-session');
const bodyparser = require("body-parser");
const app = (0, express_1.default)();
const debugLog = (0, debug_1.default)("app");
const PORT = 9000;
app.use(bodyparser.json());
app.use((0, cors_1.default)());
// #Connecting to Database
try {
    mongoose_service_1.default.connectWithRetry();
    console.log(chalk_1.default.red("Method is being executed..Connecting to Database"));
}
catch (error) {
    console.error(error);
}
// #Setting Routes
(0, routes_1.default)(app);
app.listen(PORT, () => {
    console.log(chalk_1.default.green(`I am running at ---> `, chalk_1.default.red.bold(`${PORT} `)));
});
//# sourceMappingURL=server.js.map