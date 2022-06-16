var express = require("express");
var router = express.Router();
var playerController = require("../Controllers/PlayerController");
var multera = require("../Controllers/Multer");
const multer = require("multer");
var AuthController = require('../Controllers/AuthController');

/* GET home page. */
router.get("/:playerId?", AuthController.protectGlobal, playerController.get);

// const cpUpload =
router.post(
  "/", AuthController.protectGlobal,
  multera.upload.fields([
    { name: "photosm", maxCount: 1 },
    { name: "photolg", maxCount: 1 },
  ]),
  playerController.add
);

//store excel files into one folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});
var uploadmulter = upload.single("file");

router.post("/xlsx", AuthController.protectGlobal, uploadmulter, playerController.addbyxlsx);
module.exports = router;
