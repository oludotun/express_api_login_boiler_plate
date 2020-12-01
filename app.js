require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const initializePassport = require('./config/passport');
const mysqlPool = require('./services/mysql');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');
const app = express();

initializePassport(passport);

const sessionStore = new MySQLStore({
    endConnectionOnClose: true
}, mysqlPool);
let sameSite = 'none';
if(process.env.NODE_ENV === 'development') sameSite = 'strict';
const hour = 60 * 60 * 1000;

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV !== 'development',
        sameSite: sameSite,
        maxAge: 2 * 365 * 24 * hour //valid for 2 years
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/', pagesRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started and running on port ${process.env.PORT}`);
});