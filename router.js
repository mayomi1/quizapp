const express = require('express');
const passport = require('passport');

const quizController = require('./controllers/quiz');
const updateProfile = require('./controllers/profile');
const takeQuizController = require('./controllers/take_quiz');
const AuthenticationController = require('./controllers/authentication');

require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        fbRoutes = express.Router(),
        quizRoutes = express.Router(),
        takeQuizRoutes = express.Router(),
        userRoutes = express.Router();

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/profile', userRoutes);
    apiRoutes.use('/auth/facebook', fbRoutes);
    apiRoutes.use('/quizzes', quizRoutes);
    apiRoutes.use('/take-quiz', takeQuizRoutes);


    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // To update user profile picture
    userRoutes.post('/update_dp/:user_id', updateProfile.updateDisplayPicture);

    //get DisplayPicture
    userRoutes.get('/get_dp/:user_id', updateProfile.getDisplayPicture);

    // To get profile
    userRoutes.get('/', AuthenticationController.testLogin);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    // facebook
    fbRoutes.get('/',
        passport.authenticate('facebook'));

    // facebook
    fbRoutes.get('/callback',
        passport.authenticate('facebook', {failureRedirect: '/login'}),
        function (req, res) {
            // Successful authentication, redirect home.
            res.json({
                status: true,
                data: req.user
            });
        });

    // facebook
    fbRoutes.get('/logout', function (req, res) {
        req.logout();
        if (!req.user) {
            res.json({
                status: true,
                message: 'Successfully logout'
            })
        }

    });

    // to create a quiz
    quizRoutes.post('/create', quizController.createQuizQuestion);

    // to create quiz options
    quizRoutes.post('/:quiz_id/options', quizController.createQuestionOptions);

    // to get a quiz and its options
    quizRoutes.get('/:quiz_id', quizController.getQuestionAndOptions);

    // To get all quiz and their options
    quizRoutes.get('/', quizController.getAllQuestionsAndOptions);

    // to take a quiz
    takeQuizRoutes.get('/:quiz_id/options/:option_id', requireAuth,  takeQuizController.answerQuiz);

    apiRoutes.get('/', function (req, res) {
        return res.json({
            status: true,
            message: 'welcome to quiz app 😁😎, have fun 🧐',
            data: 'check the documentation here: --- >>> https://app.swaggerhub.com/apis/mayomi/quizapp/1.0.0#/'
        })
    });

// Set url for API group routes
    app.use('/api', apiRoutes);
};
