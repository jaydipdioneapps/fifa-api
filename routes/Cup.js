var express = require('express');
var router = express.Router();
var CupController = require('../Controllers/CupController')
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get('/',AuthController.protectGlobal, CupController.get);
router.get('/:id',AuthController.protectGlobal, CupController.getOne);
router.post('/',AuthController.protectGlobal, CupController.add);

module.exports = router;
