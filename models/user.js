/**
 *Created by mayomi.ayandiran on 1/30/18
 */


const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

const findOrCreate = require('mongoose-find-or-create');


//================================
// User Schema
//================================
const UserSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
        },
        password: {
            type: String
        },
        facebookId: {
            type: String
        },
        profile_dp: {
            type: String
        }
    },
    {
        timestamps: true
    });

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};
UserSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', UserSchema);