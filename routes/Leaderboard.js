var express = require("express");
var router = express.Router();
// var CupController = require('../Controllers/CupController')
var AuthController = require("../Controllers/AuthController");
var Leaderboard = require("../Controllers/Leaderboard");

/* GET users listing. */
router.get("/:id", AuthController.protectGlobal, AuthController.protect ,Leaderboard.get);

module.exports = router;