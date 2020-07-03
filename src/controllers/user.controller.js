const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const User = require('./../models/User');
const {sendVerification} = require('../_helper/email-sender');


module.exports = {
    register,
    getAll,
    getOne,
    update,
    _delete,
    verifyEmail,
    authenticate
}


async function authenticate(req, res, next) {
    const {email, password} = req.body
    let user = await User.findOne({ email });
    
    if (user.verificationToken) {
        throw 'Please Verify your account using the token we sent'
    }

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);
        const authenticatedUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        }
        return {authenticatedUser, token};
    }

}

async function register(params) {
    
    // create user object
    const user = new User(params);

    // set first registration user to admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    user.isAdmin = isFirstUser ? true : false;
    user.verificationToken = generateRandomToken();


    // save user
    await user.save();

    // send verification to user email
    let message;

    
    message = `<p>Please use token below to verify your account:</p>
            <p>${user.verificationToken}</p>`;

    await sendVerification({
        to: params.email,
        subject: 'USER API - Activate your account',
        html:   `<h1>Thank you for Signing Up</h1>
                ${message}`
    });

    //added return user to display token in json response
    //remove next line after development (only send verificationToken in email)   
    return user
}


async function getAll() {
    const user = await User.find({});

    return user;
}


async function getOne(req) {

    const id = req.params.id;
    const user = await User.find({_id: id});

    //check if user is not Admin
    if (!req.user.isAdmin) {
        //if not admin check if user id is equal to requested id params else throw error
        if (req.user._id == id) {
            return user;
        } else {
            throw 'Unauthorized'
        }
    } else {

        //if admin return user
        return user
    }

    
}

async function update(req) {

    const id = req.params.id;
    
    //check if user id is same with requested user id params throw error if not
    if (req.user._id == id) {
        return user = await User.findByIdAndUpdate(
            id,
            req.body,
            {new: true}
        );
    } else {
        throw 'User Not Found'
    }

    
}

async function _delete(req) {

    const id = req.params.id;

    if (req.user.isAdmin) {
        const user = await User.findByIdAndRemove(id)
    } else {
        throw 'Unauthorized'
    }
}


async function verifyEmail({ token }) {
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) throw 'Verification failed';
    
    user.verified = Date.now();
    user.verificationToken = undefined;
    await user.save();
}


function generateRandomToken() {
    return crypto.randomBytes(40).toString('hex');
}