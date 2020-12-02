const LocalStrategy = require('passport-local').Strategy;
const { findByEmail, findByID } = require('../models/users');
const { compare } = require('bcrypt');

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        findByEmail((result) => {
            if(!result.error) {
                const user = result.user;
                if(user) {
                    const hash = user.password;
                    if(user.verified_at) {
                        compare(password, hash, function(err, result) {
                            if (!err) {
                                if (result) {
                                    //User logged in successfully
                                    user.password = undefined;
                                    done(null, user);
                                } else {
                                    done(null, false, {
                                        status: {
                                            type: 'error',
                                            code: 401
                                        },
                                        message: 'Access denied! Invalid email or password.'
                                    });
                                }
                            } else {
                                done(null, false, {
                                    status: {
                                        type: 'error',
                                        code: 500
                                    },
                                    message: 'Unauthorized user! Internal server error.'
                                });
                            }
                        });
                    } else {
                        done(null, false, {
                            status: {
                                type: 'error',
                                code: 401
                            },
                            message: `Email not verified. We sent your verification link to ${user.email}.`
                        });
                    }                    
                } else {
                    done(null, false, {
                        status: {
                            type: 'error',
                            code: 401
                        },
                        message: 'Unauthorized user! Invalid email or password.'
                    });
                }
            } else {
                done(null, false, {
                    status: {
                        type: 'error',
                        code: 500
                    },
                    message: 'Unauthorized user! Internal server error.'
                });
            }
        }, email);
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        findByID((result) => {
            if(!result.error) {
                const user = result.user;                
                if(user) {
                    user.password = undefined;
                    if(user.verified_at) {
                        done(null, user);
                    } else {
                        done(null, false, {
                            status: {
                                type: 'error',
                                code: 401
                            },
                            message: `Email not verified. We sent your verification link to ${user.email}.`
                        });
                    }
                } else {
                    done(null, false, {
                        status: {
                            type: 'error',
                            code: 500
                        },
                        message: 'Unauthorized user! Internal server error.'
                    });
                }
            } else {
                done(null, false, {
                    status: {
                        type: 'error',
                        code: 500
                    },
                    message: 'Unauthorized user! Internal server error.'
                });
            }
        }, id);
    });
}

module.exports = initialize;