/**
 *Created by mayomi.ayandiran on 1/30/18
 */

class Helpers {


    /**
     * Helper for return error messages
     * @param error
     * @param res
     */
     errorMessage(error, res) {
        return res.json({
            status: false,
            message: 'An error occurred, please try again',
            error: error.stack
        })
    }

    /**
     * Helper for return success messages
     * @param data
     * @param res
     * @constructor
     */
    SuccessMessage(data, res) {
        return res.json ({
            status: true,
            data: data
        })
    }
}

module.exports = new Helpers;