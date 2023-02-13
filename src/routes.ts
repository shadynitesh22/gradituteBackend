
const express = require('express');
const route = express.Router();

export default app => {
app.use("",require('./Auth/index'));
app.use("",require('./User/index'))



}