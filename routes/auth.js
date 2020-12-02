const router = require('express').Router();
const { signUp, signUpValidator, resetPassword } = require('../controllers/users');
const { requireAuthentication } = require('../middleware/auth');
const passport = require('passport');

router.post('/signup', signUpValidator, signUp);
router.post('/password/reset', resetPassword);
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).json({
                status: "error",
                message: "Access denied! Invalid email or password."
            }); 
        }
        req.logIn(user, function(err) {
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
    })(req, res, next);
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