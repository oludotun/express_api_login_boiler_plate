const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "This is from OBHA"
    });
});

module.exports = router;
