const express = require('express');
const router = express.Router();

const {
    startInstance,
    tick,
    termianteInstance,
    getcoords2,
    joinRoom,
    getcoords,
    updatecoords,
} = require('../controllers/coords.controller.js');

const { verifyToken2 } = require('../utils/jwt.js');

router.route('/startroom').post(verifyToken2, startInstance);
router.route('/tick').post(verifyToken2, tick);
router.route('/joinroom').post(verifyToken2, joinRoom);
router.route('/terminateroom').post(verifyToken2, termianteInstance);
router.route('/v1/getcoords').post(verifyToken2, getcoords2);

router.route('/getcoords').post(getcoords);
router.route('/updatecoords').post(updatecoords);

module.exports = router;
