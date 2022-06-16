var express = require('express');
var router = express.Router();
var GroupController = require('../Controllers/GroupController')
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get('/',AuthController.protectGlobal, GroupController.get);
router.get('/:id',AuthController.protectGlobal, GroupController.getOne);
router.post('/',AuthController.protectGlobal, GroupController.add);

module.exports = router;
