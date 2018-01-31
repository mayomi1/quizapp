/**
 *Created by mayomi.ayandiran on 1/30/18
 */
const QuizModel = require('../models/quiz');
const OptionModel = require('../models/option');
const CORRECT_MESSAGE = 'You are correct';
const WRONG_MESSAGE = 'You are wrong';

class TakeQuiz {

    /**
     * Response message
     * @param message
     * @param res
     */
    static responseMessage(message, res) {
        return res.json ({
            status: true,
            message: message
        })
    }

    /**
     * To check if an option is correct
     * @param req
     * @param res
     */
    answerQuiz(req, res) {
        const selectedOptionId = req.params.option_id;
        const quiz_id = req.params.quiz_id;

        return OptionModel.findById(selectedOptionId).then((response) => {
            if (response.is_correct) {
                TakeQuiz.responseMessage(CORRECT_MESSAGE, res);
            } else {
                TakeQuiz.responseMessage(WRONG_MESSAGE, res);
            }
        })
    }
}

module.exports = new TakeQuiz();