module.exports = {
    from: {
        address: process.env.MAIL_FROM_ADDRESS,
        name: process.env.MAIL_FROM_NAME,
    },
    bounce: {
        email: process.env.MAIL_RETURN_PATH_ADDRESS
    }
}