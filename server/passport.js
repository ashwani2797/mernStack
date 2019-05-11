import express from 'express';
var passport = require('passport');
const router = express.Router();

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user.model');

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });



    passport.use(new FacebookStrategy({
        clientID: '403978703755010',
        clientSecret: '9aa31c25226244b0a8053023bfea2d0b',
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile._json.email);
            cb(null, profile);
        }
    ));

    router.route('/auth/facebook')
    .get(passport.authenticate('facebook', { scope: 'email' }));

    router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

   export default router;
