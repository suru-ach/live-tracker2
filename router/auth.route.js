const express = require('express');
const router = express.Router();

const {
    login,
    signup,
    refreshToken,
    signout
} = require('../controllers/auth.controller.js');


router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/refreshtoken').post(refreshToken);
router.route('/signout').post(signout);

module.exports = router;
