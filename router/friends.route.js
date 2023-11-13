const express = require('express');
const router = express.Router();

const {
    getFriends,
    makeFriend
} = require('../controllers/friends.controller.js');

const { verifyToken } = require('../utils/jwt.js');

router.route('/makefriend').post(verifyToken, makeFriend);
router.route('/getfriends').get(verifyToken, getFriends);

module.exports = router;
