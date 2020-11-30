const router = require('express').Router();
const { signUp, signUpValidator } = require('../controllers/users');

router.post('/signup', signUpValidator, signUp);

module.exports = router;