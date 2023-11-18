const express = require('express');
const router = express.Router();

const {
    getcoords,
    updatecoords,
} = require('../controllers/coords.controller.js');


router.route('/getcoords').post(getcoords);
router.route('/updatecoords').post(updatecoords);

module.exports = router;
