
const AuthenticationController = require('./controllers/authentication'),
   // UserController = require('./controllers/profile'),
    express = require('express'),
    passportService = require('./config/passport'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


module.exports = function(app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        fbRoutes = express.Router(),
        userRoutes = express.Router();

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/profile', userRoutes);
    apiRoutes.use('/auth/facebook', fbRoutes);

    // View user profile route
   // userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);


    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    fbRoutes.get('/',
        passport.authenticate('facebook'));

    fbRoutes.get('/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.json({
                users: req.user,
                token: req.accessToken
            });
        });


    fbRoutes.get('/logout', function(req, res) {
        req.logout();
        if(!req.user) {
            res.json({
                status: true,
                message: 'Successfully logout'
            })
        }

    });
// Set url for API group routes
    app.use('/api', apiRoutes);
};
