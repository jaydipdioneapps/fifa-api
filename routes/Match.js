var express = require('express');
var router = express.Router();
var matchController = require("../Controllers/MatchController");
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get('/home', AuthController.protectGlobal, AuthController.protect, matchController.getForHome);
router.get('/today', AuthController.protectGlobal, AuthController.protect, matchController.getTody);
router.get('/Result/:id', AuthController.protectGlobal, AuthController.protect, matchController.getForResult);
router.get('/date/:date', AuthController.protectGlobal, AuthController.protect, matchController.getonDate);
router.get('/upcoming', AuthController.protectGlobal, AuthController.protect, matchController.getForUpcoming);
router.post('/', AuthController.protectGlobal, AuthController.protect, matchController.add);
router.patch('/:id', AuthController.protectGlobal, AuthController.protect, matchController.update, matchController.score);

module.exports = router;
