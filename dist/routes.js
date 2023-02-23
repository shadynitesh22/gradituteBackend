"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const route = express.Router();
exports.default = app => {
    app.use("", require('./Auth/index'));
    app.use("", require('./User/routes/index'));
};
//# sourceMappingURL=routes.js.map