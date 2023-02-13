"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const chalk_1 = __importDefault(require("chalk"));
const log = (0, debug_1.default)("app:mongoose-service");
class MongooseService {
    constructor() {
        this.count = 0;
        this.mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
            // useFindAndModify: false,
        };
        this.connectWithRetry();
    }
    getInstance() {
        return mongoose_1.default;
    }
    connectWithRetry() {
        mongoose_1.default.set("strictQuery", false);
        log("process.env.MONGODB_URI", "mongodb+srv://Nitesh:xAOI0QI6C0oL4U1A@@gratitude.dfuu9qx.mongodb.net/?retryWrites=true&w=majority");
        const MONGODB_URI = "mongodb+srv://ShadyNitesh:jEc0bgDKsdWaxqBH@gratitude.i3vwfel.mongodb.net/?retryWrites=true&w=majority";
        log("Connecting to MongoDB(Retry when failed)");
        mongoose_1.default
            .connect(MONGODB_URI, this.mongooseOptions)
            .then(() => {
            log("MongoDB is connected");
            console.log(chalk_1.default.green("MongoDB is Connected"));
        })
            .catch((err) => {
            const retrySeconds = 5;
            log(`MongoDB connection unsuccessful (will retry #${++this
                .count} after ${retrySeconds} seconds):`, err);
            console.log(`MongoDB connection unsuccessful (will retry #${++this
                .count} after ${retrySeconds} seconds):`, err);
        });
    }
}
exports.default = new MongooseService();
//# sourceMappingURL=mongoose.service.js.map