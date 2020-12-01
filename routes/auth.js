const router = require('express').Router();
const { signUp, signUpValidator } = require('../controllers/users');
const { requireAuthentication } = require('../middleware/auth');
const passport = require('passport');

router.post('/signup', signUpValidator, signUp);
router.post('/login', passport.authenticate('local'), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({
            status: "success",
            message: "Logged in successfully.",
            data: {
                user: req.user
            }
        });
    });
});
router.post('/logout', requireAuthentication, (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({
            status: "success",
            message: "Logged out successfully."
        });
    });
});

module.exports = router;