const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const User = require('./../models/User');
const {sendVerification} = require('../_helper/email-sender');


module.exports = {
    register,
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
            name: user.name
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