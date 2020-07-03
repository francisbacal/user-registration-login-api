const express = require('express');
const User = require('./../models/User');
const userController = require('./../controllers/user.controller');
const passport = require('passport');
require('./../_helper/passport-setup.js');


const router = express.Router();

const isAdmin = (req,res,next) => {
    if (req.user.isAdmin) {
        return next();
    } else {
        return res.status(403).send('Unauthorized')
    }
}


/* ========================
| ROUTES
--------------------------*/

router.post('/register', register);
router.get('/', passport.authenticate('jwt', {session:false}), isAdmin, getAll);
router.get('/:id', passport.authenticate('jwt', {session:false}), getOne);
router.post('/verify-email', verifyEmail);
router.post('/login', authenticate);
router.put('/:id', passport.authenticate('jwt', {session:false}), update);
router.delete('/:id', passport.authenticate('jwt', {session:false}), isAdmin, _delete);

module.exports = router;


/* ========================
| FUNCTIONS
--------------------------*/

function register(req, res, next) {
    //remove token in response after test
    userController.register(req.body)
        .then(user => res.json({ message: 'Registration successful, please check your email for verification key', token: user.verificationToken }))
        .catch(next);
}

function getAll(req,res, next) {
    userController.getAll()
        .then(users => res.json(users))
        .catch(next)
}

function getOne(req,res, next) {
    userController.getOne(req)
        .then(user => res.json(user))
        .catch(next)
}

function update(req,res,next) {
    userController.update(req)
        .then(user => res.json(user))
        .catch(next)
}

function _delete(req, res, next) {
    userController._delete(req)
        .then(user => res.json({message: 'User Deleted'}))
        .catch(next)
}

function verifyEmail(req, res, next) {
    userController.verifyEmail(req.body)
        .then(() => res.json({ message: 'Verification successful, you may now log in' }))
        .catch(next);
}

function authenticate(req, res, next) {
    userController.authenticate(req, res, next)
        .then(user => user ? res.json(user) : res.status(400).send({error: 'Login failed. Check Credentials'}))
        .catch(next)
}