"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth.controller");
const express = require('express');
const router = express.Router();
const auth_ctr = new auth_controller_1.AuthController();
router.post('/login', auth_ctr.login);
router.post('/signup', auth_ctr.Signup);
module.exports = router;
//# sourceMappingURL=index.js.map