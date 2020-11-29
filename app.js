require('dotenv').config();
const express = require('express');
const pagesRouter = require('./routes/pages');
const app = express();
const passport = require('passport');

app.use('/', pagesRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server started and running on port ${process.env.PORT}`);
});