const User = require('../models/users');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { randomString } = require('../services');
const sendPasswordResetMail = require('../mail/password-reset');
const sendMailConfirmationMail = require('../mail/mail-confirmation')
const { appURL } = require('../config/app');

const signMailConfirmationLink = (user_id) => {
    //Generate jwt confirmation link for user's email verification
    const jwt = sign({id: user_id}, process.env.JWT_SECRET, {
        expiresIn: 48 * 60 * 60 // 48 hours
    });
    return `${appURL}/verify/${jwt}`;
}

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
        // TODO: Add recaptcha to prevent spam
        hash(body.password, 10, async (err, hash) => {
            body.password = hash;
            User.create((result) => {
                if(!result.error) {
                    const user_id = result.results.insertId;
                    const confirmationLink = signMailConfirmationLink(user_id);
                    body.password = undefined;
                    // Send email confirmation mail
                    sendMailConfirmationMail(body, confirmationLink);
                    return res.status(200).json({
                        status: "success",
                        message: "Registration successful, check your email for verification link."
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
    ],
    updateUser: (req, res) => {
        const newUser = req.body;
        const updateUser = (user) => {
            User.update((result) => {
                if(!result.error) {
                    return res.status(200).json({
                        status: "success",
                        message: "Profile updated successfully."
                    });
                } else {
                    console.log(result.error);
                    return res.status(500).json({
                        status: "error",
                        message: `Profile update failed! Internal server error.`
                    });
                }
            }, user);
        }
        //Fetch user from DB
        User.findByID((result)=>{
            if(!result.error) {
                const oldUser = result.user;
                if(oldUser) {
                    // Check if user's email will change
                    if(oldUser.email !== newUser.email) {
                        newUser.new_email = newUser.email;
                    }
                    // Verify password for email or password update
                    if(newUser.new_password || newUser.new_email) {
                        // Verify the user's old password
                        if(newUser.password) {
                            const passwordHash = oldUser.password;
                            compare(newUser.password, passwordHash, function(err, result) {
                                if (!err) {
                                    if (result) {
                                        if(newUser.new_password) {
                                            // Hash the new password and update user
                                            hash(newUser.new_password, 10, async (err, hash) => {
                                                newUser.new_password = hash;
                                                updateUser(newUser);
                                            });
                                        } else {
                                            updateUser(newUser);
                                        }
                                    } else {
                                        return res.status(401).json({
                                            status: "error",
                                            message: "Access denied! Invalid password."
                                        });
                                    }
                                } else {
                                    console.log(err);
                                    return res.status(500).json({
                                        status: "error",
                                        message: "Login failed! Internal server error."
                                    });
                                }
                            });
                        } else {
                            return res.status(401).json({
                                status: "error",
                                message: "Access denied! Please provide your old password."
                            });
                        }
                    } else {
                        updateUser(newUser);
                    }                                      
                } else {
                    return res.status(401).json({
                        status: "error",
                        message: "Access denied! Strange user activity."
                    });
                }
            }
        }, newUser.id);        
    },
    resetPassword: (req, res) => {
        const email = req.body.email;
        const password = randomString(8);
        User.findByEmail((result) => {
            if(!result.error) {
                const user = result.user;
                if(user) {
                    hash(password, 10, async (err, hash) => {
                        user.password = hash;
                        User.resetPassword((result) => {
                            if(!result.error) {
                                sendPasswordResetMail(user, password, (result) => {
                                    if(!result.error) {
                                        res.status(200).json({
                                            status: "success",
                                            message: "Password reset successfully, please check your email for the new password."
                                        });
                                    } else {
                                        console.log(result.error);
                                        res.status(500).json({
                                            status: "error",
                                            message: `Password reset failed! Internal server error.`
                                        });
                                    }
                                });                           
                            } else {
                                console.log(result.error);
                                res.status(500).json({
                                    status: "error",
                                    message: `Password reset failed! Internal server error.`
                                });
                            }
                        }, user);
                    });
                } else {
                    res.status(404).json({
                        status: "error",
                        message: `Email not found.`
                    });
                }
            } else {
                console.log(result.error);
                res.status(500).json({
                    status: "error",
                    message: `Password reset failed! Internal server error.`
                });
            }
        }, email);        
    },
    verifyEmail: (req, res) => {
        const token = req.params.token;
        // Verify if token is valid
        verify(token, process.env.JWT_SECRET, async function(err, decoded) {
            if (!err && decoded) {
                const user_id = decoded.id;
                User.verifyEmail((result) => {
                    if(!result.error) {
                        res.status(200).json({
                            status: "success",
                            message: "Email verified successfully."
                        });
                    } else {
                        console.log(result.error);
                        res.status(500).json({
                            status: "error",
                            message: `Could not verify email! Internal server error.`
                        });
                    }
                }, user_id);
            } else {
                res.status(422).json({
                    status: "error",
                    message: 'You have provided an invalid or expired link.'
                });
            }
        });
    },
    resendVerificationMail: (req, res) => {
        const email = req.body.email;
        User.findByEmail((result) => {
            if(!result.error) {
                const user = result.user;
                if(user) {
                    if(!user.verified_at) {
                        const confirmationLink = signMailConfirmationLink(user.id);
                        // Send email confirmation mail
                        sendMailConfirmationMail(user, confirmationLink).then(() => {
                            return res.status(200).json({
                                status: "success",
                                message: `Email sent successfully to ${email}.`
                            });
                        }).catch((error) => {
                            console.log(error);
                            res.status(500).json({
                                status: "error",
                                message: `Verification mail not sent! Mail server error.`
                            });
                        });
                    } else {
                        res.status(422).json({
                            status: "error",
                            message: 'Your email address is already verified.'
                        });
                    }
                } else {
                    res.status(404).json({
                        status: "error",
                        message: `We could not find any user with the email ${email}.`
                    });
                }
            } else {
                console.log(result.error);
                res.status(500).json({
                    status: "error",
                    message: `Verification mail not sent! Internal server error.`
                });
            }
        }, email);
    }
};