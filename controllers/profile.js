/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const multer = require('multer');

const Helper = require('../helper');
const User = require('../models/user');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

let upload = multer({storage: storage}).single('image');

/**
 * update profile dp on login
 * @param req
 * @param res
 */
module.exports = (req, res) => {
    upload(req, res, function (error) {
        if(error) {
            Helper.errorMessage(error, res);
        }

        let image;

        if(req.file) {
            image = req.file.filename;
        }

        const userId = req.params.user_id;

        return User.findById(userId).then((userRes) => {
            userRes.profile_dp = image;
            userRes.save();
            Helper.SuccessMessage(userRes, res)
        }).catch((error) => {
            Helper.errorMessage(error, res);
        })
    })
};
