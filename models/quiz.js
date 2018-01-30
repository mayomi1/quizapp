/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const option = require('./option');

//================================
// QUiz Schema
//================================
const QuizSchema = new Schema({
        question: String,
        options: [{type: Schema.Types.ObjectId, ref: 'option'}]
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('quiz', QuizSchema);
