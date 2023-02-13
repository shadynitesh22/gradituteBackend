
import {AuthController} from './auth.controller'
const express = require('express');


const router = express.Router();
const auth_ctr = new AuthController();

router.post('/login',auth_ctr.login);
router.post('/signup',auth_ctr.Signup);






module.exports = router
