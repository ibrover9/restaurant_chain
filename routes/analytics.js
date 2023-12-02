const express = require('express');
// const { request, response } = require('../app');
const controller = require('../controllers/analytics');
const router = express.Router();


router.get('/overview', controller.overview)

router.get('/analytics', controller.analytics)




module.exports = router;