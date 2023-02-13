import { UserController } from "./user.controller";
import JWT from "../Common/middlewares/authentication"
const express = require('express');
const route = express.Router();
const user_ctr = new UserController()

route.get('/user',[JWT.authenticateJWT,UserController.getUser])



module.exports = route
