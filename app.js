require('dotenv').config();
const express = require('express');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');
const app = express();
const passport = require('passport');

app.use(express.json());

app.use('/', authRouter);
app.use('/', pagesRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server started and running on port ${process.env.PORT}`);
});