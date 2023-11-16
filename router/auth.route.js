const express = require('express');
const router = express.Router();

const {
    login,
    signup,
    signup2,
    refreshToken,
    signout,
    signin
} = require('../controllers/auth.controller.js');


router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/signup2').post(signup2);
router.route('/signin').post(signin);
router.route('/refreshtoken').post(refreshToken);
router.route('/signout').post(signout);

module.exports = router;
