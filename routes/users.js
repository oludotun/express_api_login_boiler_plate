const router = require('express').Router();
const User = require('../controllers/users');
const { requireAuthentication } = require('../middleware/auth');

router.put('/', requireAuthentication, User.updateUser);

module.exports = router;