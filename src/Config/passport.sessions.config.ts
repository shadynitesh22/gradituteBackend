import passport from 'passport';
import express from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../User/models/user.model';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from "./default.config";
import flash from 'connect-flash';
let uri = config.MONGODB_URI;


export default function initPassportAndSessions(app: express.Application) {

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true, // set to true if using HTTPS
            maxAge: 14 * 24 * 60 * 60 * 1000 // session TTL (2 weeks)
        },
        name: "sessionNameJajamaru",
        store: new MongoStore({
            mongoUrl: uri,
            ttl: 14 * 24 * 60 * 60 // session TTL (2 weeks)
        })

    }));


    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    console.log("passport and sessions loaded")
}