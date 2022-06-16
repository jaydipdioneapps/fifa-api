var express = require('express');
var router = express.Router();
var AuthController = require('../Controllers/AuthController');
var PredictionController = require('../Controllers/PredictionController');
// var teamController = require('../Controllers/TeamController')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', AuthController.protectGlobal, AuthController.login);
router.post('/predict', AuthController.protectGlobal, AuthController.protect, PredictionController.predict);
// router.get('/',AuthController.protectGlobal, AuthController.protect, teamController.get);
// router.post('/', AuthController.protectGlobal, AuthController.protect, AuthController.resetpwd);
// router.post('/forgetpwd', AuthController.protectGlobal, AuthController.forgetpwd);
router.post('/signup', AuthController.protectGlobal, AuthController.signUp);

module.exports = router;