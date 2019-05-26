import express from 'express';
import User from './models/user.model';
import jwt from 'jsonwebtoken';
import config from './../config/config'
var passport = require('passport');
const router = express.Router();
var FacebookStrategy = require('passport-facebook').Strategy;

var userFrontendString = "";

passport.serializeUser(function (user, cb) {
    console.log("User in serialize:" + user._id);

    var userFrontendObj = getUserFrontendObj(user);
    userFrontendString = JSON.stringify(userFrontendObj);
    console.log(userFrontendString);
    cb(null, user);
});

function getUserFrontendObj(userData) {
    var token = jwt.sign({
        _id: userData._id
    }, config.jwtSecret);

    var user = {
        "email": userData.email,
        "name": userData.name,
        "_id": userData._id
    }

    var data = {
        "token": token,
        "user": user
    }
    return data;
}

passport.deserializeUser(function (id, cb) {
    console.log("Obj id at deserialize:" + id);
    User.findById(id, function (err, user) {
        cb(null, user);
    });
});



passport.use(new FacebookStrategy({
    clientID: '403978703755010',
    clientSecret: '9aa31c25226244b0a8053023bfea2d0b',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile._json.email);

        User.findOne({ email: profile._json.email }).select('password email name').exec(function (err, user) {
            if (err) done(err);
            if (user && user !== null) {
                console.log("user found in middleware:" + user);
                cb(null, user);
            } else {
                cb(err);
            }
        });
        console.log("User not found in middleware");
    }
));

router.route('/auth/facebook')
    .get(passport.authenticate('facebook', { scope: 'email' }));

router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', { failureRedirect: '/signin' }),
        function (req, res) {
            console.log("Reached at success level" + userFrontendString);
            return res.redirect("/login/facebook/"+userFrontendString);
        });

export default router;
