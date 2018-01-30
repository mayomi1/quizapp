
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
        userRoutes = express.Router();

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/profile', userRoutes);

    // View user profile route
   // userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);


    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Set url for API group routes
    app.use('/api', apiRoutes);
};
