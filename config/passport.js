/**
 *Created by mayomi.ayandiran on 1/30/18
 */
// Importing Passport, strategies, and config
const passport = require('passport'),
    User = require('../models/user'),
   // findOrCreate = require('mongoose-findorcreate');
    config = require('./main'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local'),
    FacebookStrategy  =     require('passport-facebook').Strategy;


/*Underneath that, we will tell passport that we have opted to use
the email field rather than the username field*/
const localOptions = { usernameField: 'email' };

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if(err) { return done(err); }
        if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }

            return done(null, user);
        });
    });
});

const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Telling Passport where to find the secret
    secretOrKey: config.secret
};


// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload._id, function(err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

const facebookLogin = new FacebookStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            //Check whether the User exists or not using profile.id
            //Further DB code.
            User.findOrCreate({ facebookId: profile.id}, function (err, user) {
                console.log(accessToken);
                return user
            });
            return done(null, profile);
        });
    }
);


passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);