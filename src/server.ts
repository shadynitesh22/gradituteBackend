import express from 'express';
import chalk from "chalk";
import debug, { IDebugger } from "debug";
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongooseService from './Common/services/database/mongoose.service';

import passport from 'passport';

import setRoute from './routes'




dotenv.config();

const session = require('express-session');

const bodyparser = require("body-parser");

const app = express()


const debugLog: IDebugger = debug("app");

const PORT = 9000;



app.use(bodyparser.json());


app.use(cors());




// #Connecting to Database
try {
  mongooseService.connectWithRetry();

  console.log(chalk.red("Method is being executed..Connecting to Database"));

} catch (error) {
  console.error(error);

}



// #Setting Routes

setRoute(app)


app.listen(PORT, () => {
    console.log(chalk.green(`I am running at ---> `,chalk.red.bold(`${PORT} `)));

})
