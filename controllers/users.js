const Users = require('../models/users');
const { hash } = require('bcrypt');
const { body, validationResult } = require('express-validator');

module.exports = {
    signUp: (req, res) => {
        const errorFormatter = ({ msg }) => {
            return `${msg}`;
        };
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                status: "error",
                message: `Form validation failed.`,
                validation: {errors: errors.array()}
            });
        }
        const body = req.body;
        console.log(body);
        // TODO: Add recaptcha to prevent spam
        hash(body.password, 10, async (err, hash) => {
            body.password = hash;
            Users.create((result) => {
                if(!result.error) {
                    return res.status(200).json({
                        status: "success",
                        message: "Registration successful, please login to access your account."
                    });
                } else {
                    if(result.error.errno === 1062) {
                        return res.status(200).json({
                            status: "error",
                            message: `The email '${body.email}' has already been taken.`
                        });
                    } else {
                        return res.status(200).json({
                            status: "error",
                            message: `Account not created! An error has occurred.`
                        });
                    }
                }
            }, body);
        });
        
    },
    signUpValidator: [
        body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').normalizeEmail(),
        body('email').isEmail().withMessage('Email is not valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        // body('confirm_password').custom((value, { req }) => {
        //     if(value !== req.body.password) {
        //         throw new Error('Password confirmation does not match password');
        //     }
        //     return true;
        // })
    ]
};