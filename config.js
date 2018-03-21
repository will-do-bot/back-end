
const mongoose = require('mongoose')
const userController = require('./controllers/user')
const authController = require('./controllers/auth')

module.exports = function (app, passport) {

    const FACEBOOK_APP_ID = `171564053483354`;
    const FACEBOOK_APP_SECRET = 'f6ddb47017ac46eaf9eb55eeefbd864c';

    const FacebookStrategy = require('passport-facebook').Strategy;


    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: 'https://willdomessenger.herokuapp.com/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails', 'profileUrl']
    }, function (accessToken, refreshToken, profile, done) {
        userController.find(profile.id, function (user) {
            if (user) {
                authController.create(user, function (token) {
                    console.log(token)
                }, accessToken)
            } else {
                userController.save({
                    name: profile.displayName,
                    facebook_id: profile.id
                }, function (savedUser) {
                    authController.create(user, function (token) {
                        console.log(token)
                    }, accessToken)
                })
            }
        })
    })
    );
    
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}
