var express = require('express');
var router = express.Router();
var PredictionController = require('../Controllers/TeamController')

/* GET users listing. */
router.get('/',teamController.get );
router.post('/',PredictionController.add)

module.exports = router;
