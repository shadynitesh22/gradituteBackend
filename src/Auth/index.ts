
import { ApiError } from '../utils/ApiError';
import RequestValidator from '../utils/Request.Validator';
import { CreateUserRequest } from '../Validators/CreateUserRequest';
import {AuthController} from './auth.controller'
const express = require('express');
import { Request, Response, NextFunction } from 'express';

const router = express.Router();
const auth_ctr = new AuthController();



// This creates a middleware to validaterequest : like empty req body, email format, password format etc
router.post(
    "/login",
    RequestValidator.validate<CreateUserRequest>(CreateUserRequest),
    auth_ctr.login
  );
  
router.post('/signup',auth_ctr.Signup);






module.exports = router
