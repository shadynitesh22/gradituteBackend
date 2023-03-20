import { SignUpUserRequest } from '../Validators/SignupUser.request';
import RequestValidator from '../ErrorHandlers/Request.Validator';
import { CreateUserRequest } from '../Validators/CreateUserRequest';
import {AuthController} from './auth.controller'
const express = require('express');

const router = express.Router();
const auth_ctr = new AuthController();



// This creates a middleware to validaterequest : like empty req body, email format, password format etc
router.post(
    "/login",
    RequestValidator.validate<CreateUserRequest>(CreateUserRequest),
    auth_ctr.login
  );
  
router.post('/signup',
RequestValidator.validate<SignUpUserRequest>(SignUpUserRequest),
auth_ctr.Signup);






module.exports = router
