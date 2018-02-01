module.exports = {
    // Database connection information
    'database': 'mongodb://quizapp:quizapp@ds217898.mlab.com:17898/quizapp',
    // Setting port for server
    'port': process.env.PORT || 3000,

    'secret': 'kdsasasnaijs',
    'clientID': '448865812195346',
    'clientSecret': '68f0d449f5542299d48df87bde0563a5',
    'callbackURL': 'https://simplequiz.herokuapp.com/api/auth/facebook/callback'
};