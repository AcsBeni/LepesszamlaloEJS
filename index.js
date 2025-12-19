require('dotenv').config();
var cors = require('cors');
const express = require('express');
const session = require('express-session')
const app = express();
const port = process.env.PORT || 3000;
const logger = require("./utils/logger")
const users = require('./modules/users');
const steps = require('./modules/steps');
const view = require('./modules/view');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Serve static assets (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
//Routes
app.use('/users', users);
app.use('/steps', steps);
app.use('/', view);

//Start server
app.listen(port, () => {
    logger.info(`Server listening on ${process.env.PORT}`);
});

/*
.env:
DBHOST=localhost
DBUSER=root
DBPASS=
DBNAME=step_counter
DEBUG=1
PORT=3000 

*/
