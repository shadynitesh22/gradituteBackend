import express, { response } from 'express';

import mongoose from 'mongoose';


import * as dotenv from 'dotenv';

import cors from 'cors';




const MongoClient = require ('mongodb').MongoClient;

dotenv.config();

const bodyparser = require("body-parser");

const app = express()

const PORT = process.env.PORT || 3000;


app.use(bodyparser.json());

app.use(cors);


mongoose.connect("mongodb+srv://ShadyNitesh:0rfLxieb5fMW4B48@cluste2.cutobmj.mongodb.net/?retryWrites=true&w=majority")
    



app.listen(PORT,()=>{
console.log("me is running")
   
})
