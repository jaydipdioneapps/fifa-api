var express = require("express");
var router = express.Router();
var colorsController = require("../Controllers/ColorsController");
var multera = require("../Controllers/Multer");
const multer = require("multer");
var AuthController = require('../Controllers/AuthController');

/* GET users listing. */
router.get("/:id?", AuthController.protectGlobal, colorsController.get);
router.post("/", AuthController.protectGlobal, colorsController.add);

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

router.post("/xlsx", AuthController.protectGlobal, uploadmulter, colorsController.addbyxlsx);

module.exports = router;
