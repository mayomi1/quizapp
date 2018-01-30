const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');

const router = require('./router');
const config = require('./config/main');
const passportService = require('./config/passport');
const app = express();

// Configure your middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { useMongoClient: true })
    .catch(err => console.error(err));

app.use(morgan('dev')); // log every request to the console

app.use(cors());

app.use(cookieParser());
app.use(expressSession({
    secret: 'sdjskd sdj',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
// Start the server
app.listen(config.port);
console.log('Your server is running on ' + config.port);


router(app);