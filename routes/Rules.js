var express = require('express');
var router = express.Router();
var RulesController = require('../Controllers/RulesController')
var AuthController = require('../Controllers/AuthController');

/* GET rules listing. */
router.post('/', AuthController.protectGlobal, RulesController.add);
router.post('/info', AuthController.protectGlobal, RulesController.get);
router.patch('/', AuthController.protectGlobal, RulesController.update);

module.exports = router;
