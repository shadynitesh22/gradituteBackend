import mongoose from "mongoose";
import debug, { IDebugger } from "debug";
import chalk from "chalk";

const log: IDebugger = debug("app:mongoose-service");

class MongooseService {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 5000,
    // useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getInstance() {
    return mongoose;
  }

  connectWithRetry() {
    mongoose.set("strictQuery", false);
    log("process.env.MONGODB_URI", "mongodb+srv://Nitesh:xAOI0QI6C0oL4U1A@@gratitude.dfuu9qx.mongodb.net/?retryWrites=true&w=majority");
    const MONGODB_URI = "mongodb+srv://ShadyNitesh:jEc0bgDKsdWaxqBH@gratitude.i3vwfel.mongodb.net/?retryWrites=true&w=majority";
 
    log("Connecting to MongoDB(Retry when failed)");
  
    mongoose
      .connect(MONGODB_URI, this.mongooseOptions)
      .then(() => {
        log("MongoDB is connected");
        console.log(chalk.green("MongoDB is Connected"))
      })
      .catch((err) => {
        const retrySeconds = 5;
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        console.log(`MongoDB connection unsuccessful (will retry #${++this
          .count} after ${retrySeconds} seconds):`,
        err)

      });
  }
}

export default new MongooseService();