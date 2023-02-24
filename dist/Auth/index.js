"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_Validator_1 = __importDefault(require("../utils/Request.Validator"));
const CreateUserRequest_1 = require("../Validators/CreateUserRequest");
const auth_controller_1 = require("./auth.controller");
const express = require('express');
const router = express.Router();
const auth_ctr = new auth_controller_1.AuthController();
// This creates a middleware to validaterequest : like empty req body, email format, password format etc
router.post("/login", Request_Validator_1.default.validate(CreateUserRequest_1.CreateUserRequest), auth_ctr.login);
router.post('/signup', auth_ctr.Signup);
module.exports = router;
//# sourceMappingURL=index.js.map