var express = require("express");
var router = express.Router();
var teamController = require("../Controllers/TeamController");
var multera = require("../Controllers/Multer");
const multer = require("multer");
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get("/", AuthController.protectGlobal, teamController.get);
router.get("/:id", AuthController.protectGlobal, teamController.getOne);
router.post(
  "/", AuthController.protectGlobal,
  multera.upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "teamphoto", maxCount: 1 },
  ]),
  teamController.add
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

router.post("/xlsx", AuthController.protectGlobal, uploadmulter, teamController.addbyxlsx);

module.exports = router;
