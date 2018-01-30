'use strict';
/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/main');

class UserAuth {
    static errorMessage(error) {
        return {
            status: false,
            message: 'An error occurred, please try again',
            error: error.stack
        }
    }

    static generateToken(user) {
        return jwt.sign(user, config.secret, {
            expiresIn: 10080 // in seconds
        });
    }

    static setUserInfo(request) {
        return {
            _id: request._id,
            email: request.email
        };
    }

    static userExistBefore(user, res) {

            return res.json({
                status: false,
                message: 'Sorry that email is already used'
            })

    }

    login(req, res) {

        const userInfo = UserAuth.setUserInfo(req.user);
        req.session.user = req.user;
        res.status(200).json({
            token: 'bearer ' + UserAuth.generateToken(userInfo),
            user: userInfo
        });
    };

    register(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        return User.findOne({email: email}).then((user) => {

            // If user is not unique, return error
            if (user) {
                return UserAuth.userExistBefore(user, res);
            }
            // If email is unique and password was provided, create account
            const createNewUser = new User({
                email: email,
                password: password
            });

            return createNewUser.save().then((response) => {
                // Respond with JWT if user was created
                const userInfo = UserAuth.setUserInfo(response);
                return res.json({
                    status: true,
                    token: 'JWT ' + UserAuth.generateToken(userInfo),
                    data: userInfo
                });
            }).catch((error) => {
                return res.json(UserAuth.errorMessage(error))
            });
        }).catch((error) => {
            return res.json(UserAuth.errorMessage(error))
        });
    }

    testLogin(req, res) {
        console.log('working', req.session.user);
        return res.json(req.user);
    }


}

module.exports = new UserAuth();