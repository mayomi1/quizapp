/**
 *Created by mayomi.ayandiran on 1/30/18
 */

class Helpers {
     errorMessage(error, res) {
        return res.json({
            status: false,
            message: 'An error occurred, please try again',
            error: error.stack
        })
    }

    SuccessMessage(data, res) {
        return res.json ({
            status: true,
            data: data
        })
    }
}

module.exports = new Helpers;