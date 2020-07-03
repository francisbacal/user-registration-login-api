const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

/* ========================
| DEFINE SCHEMA
--------------------------*/

const UserSchema = new Schema(
    {  
        name: 
        {
            type: String,
            required: [true, 'Field required']
        },
        email:
        {
            type: String,
            unique: true,
            required: [true, 'Field required']
        },
        passwordHash:
        {
            type: String,
            required: [true, 'Field required'],
        },
        isAdmin:
        {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        verified: Date,
    }
);

let User = mongoose.model('User', UserSchema);


// get virtual password to hash for comparison
UserSchema.virtual('password')
.get(function() {
    return this.password
})
.set(function(value) {
    this._password = value;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(value, salt);

    this.passwordHash = hash;
});

// get virtual confirm password to hash for comparison
UserSchema.virtual('confirmPassword')
.get(function() {
    return this.confirmPassword;
})
.set(function(value) {
    this._confirmPassword = value;
})


//set password hash
UserSchema.path('passwordHash').validate( function(v) {
    if (this._password !== this._confirmPassword) {
        this.invalidate('passwordConfirm', 'Password does not match')
    }

    if (this.isNew && !this._password) {
        this.invalidate('password', 'required');
    }
}, null)


//check if user exists
UserSchema.path('email').validate(async function (v) {

    if (this.isNew) {
        let user = await User.findOne({email: this.email})

        if (user) {
            this.invalidate('email', 'Email already used')
        }
    }
   
})


//remove version key to generated JSON file response
UserSchema.set('toJSON', {
    versionKey: false
})


/* ========================
| EXPORT MODEL
--------------------------*/
module.exports = User