"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const authentication_1 = __importDefault(require("../Common/middlewares/authentication"));
const express = require('express');
const route = express.Router();
const user_ctr = new user_controller_1.UserController();
route.get('/user', [authentication_1.default.authenticateJWT, user_controller_1.UserController.getUser]);
module.exports = route;
//# sourceMappingURL=index.js.map