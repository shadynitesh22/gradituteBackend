"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const debug_1 = __importDefault(require("debug"));
const cors_1 = __importDefault(require("cors"));
const mongoose_service_1 = __importDefault(require("./Common/services/database/mongoose.service"));
const routes_1 = __importDefault(require("./routes"));
const env = require('dotenv');
env.config();
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