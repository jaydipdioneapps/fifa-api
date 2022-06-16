var express = require('express');
var router = express.Router();
var matchController = require("../Controllers/MatchController");
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get('/home', AuthController.protectGlobal, matchController.getForHome);
router.get('/today', AuthController.protectGlobal, matchController.getTody);
router.get('/date/:date', AuthController.protectGlobal, matchController.getonDate);
router.get('/upcoming', AuthController.protectGlobal, matchController.getForUpcoming);
router.post('/', AuthController.protectGlobal, matchController.add);
router.patch('/:id', AuthController.protectGlobal, matchController.update, matchController.score);

module.exports = router;
