import express from 'express';
import chalk from "chalk";
import debug, { IDebugger } from "debug";
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongooseService from './Common/services/database/mongoose.service';



import setRoute from './routes'

dotenv.config();

var session = require('express-session');

const bodyparser = require("body-parser");

const app = express()

const debugLog: IDebugger = debug("app");

const PORT = 9000;


app.use(bodyparser.json());


app.use(cors());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));


try {
  mongooseService.connectWithRetry();

  console.log(chalk.red("Method is being executed..Connecting to Database"));

} catch (error) {
  console.error(error);

}

setRoute(app)


app.listen(PORT, () => {
    console.log(chalk.green(`I am running at ---> `,chalk.red.bold(`${PORT} `)));

})
