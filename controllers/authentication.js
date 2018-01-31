'use strict';
/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/main');

class UserAuth {

    /**
     * To return error messages
     * @param error
     * @returns {{status: boolean, message: string, error}}
     */
    static errorMessage(error) {
        return {
            status: false,
            message: 'An error occurred, please try again',
            error: error.stack
        }
    }

    /**
     * It generate token for user
     * @param user
     * @returns {*}
     */
    static generateToken(user) {
        return jwt.sign(user, config.secret, {
            expiresIn: 10080 // in seconds
        });
    }

    /**
     * It set up user info response
     * @param request
     * @returns {{_id, email: (*|email|{type, lowercase}|{type, required, index})}}
     */
    static setUserInfo(request) {
        return {
            _id: request._id,
            email: request.email
        };
    }

    /**
     * It return error if user already exist
     * @param user
     * @param res
     */
    static userExistBefore(user, res) {

            return res.json({
                status: false,
                message: 'Sorry that email is already used'
            })

    }

    /**
     * To login
     * @param req
     * @param res
     */
    login(req, res) {

        const userInfo = UserAuth.setUserInfo(req.user);
        req.session.user = req.user;
        res.status(200).json({
            token: 'bearer ' + UserAuth.generateToken(userInfo),
            user: userInfo
        });
    };

    /**
     * To register
     * @param req
     * @param res
     * @returns {Promise.<T>|Promise}
     */
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

    /**
     * check if user is login
     * @param req
     * @param res
     */
    testLogin(req, res) {
        console.log('working', req.session.user);
        return res.json(req.user);
    }


}

module.exports = new UserAuth();