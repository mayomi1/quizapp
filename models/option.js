/**
 *Created by mayomi.ayandiran on 1/30/18
 */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const question = require('./quiz');

//================================
// Options Schema
//================================
const OptionSchema = new Schema({
        option: String,
        is_correct: Boolean,
        quiz_id: String
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('option', OptionSchema);
