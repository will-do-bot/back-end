
const mongoose = require('mongoose')
const User = mongoose.model('User')


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
        console.log(accessToken)
        console.log(profile)
    })
    );
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}
