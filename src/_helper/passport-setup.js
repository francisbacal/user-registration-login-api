const passport = require('passport');
const User = require('./../models/User')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use( new JwtStrategy(opts, function(jwt_payload, done){
    User.findOne( {_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false)
        }

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
}))