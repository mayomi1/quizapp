/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const multer = require('multer');
const path = require('path');

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
exports.updateDisplayPicture = (req, res) => {
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
            if(userRes === null){
                return res.json({
                    status: false,
                    message: 'Please register to upload an image'
                })
            }
            userRes.profile_dp = image;
            userRes.save();
            Helper.SuccessMessage(userRes, res)
        }).catch((error) => {
            Helper.errorMessage(error, res);
        })
    })
};


/**
 * To get display picture
 * @param req
 * @param res
 */
exports.getDisplayPicture = (req, res) => {

    let userId = req.params.user_id;
    User.findById(userId).then((userRes) => {
        res.sendFile(path.join(__dirname, '../uploads', userRes.profile_dp), function (err) {
            if (err) {
                res.send({msg: err.code})
            }
        })
    })

};
