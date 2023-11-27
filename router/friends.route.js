const express = require('express');
const router = express.Router();

const {
    getFriends,
    makeFriend,
    friendRequest
} = require('../controllers/friends.controller.js');

const { verifyToken2 } = require('../utils/jwt.js');

router.route('/friendrequest').post(verifyToken2, friendRequest);
router.route('/makefriend').post(verifyToken2, makeFriend);
router.route('/getfriends').get(verifyToken2, getFriends);

module.exports = router;
