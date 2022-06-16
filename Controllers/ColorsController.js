const Colors = require("../models/Colors");
var xlsx = require("xlsx");
var fs = require('fs');

exports.add = async function (req, res) {
    try {
        //  console.log(req.files.photosm[0]);
        let data = {
            country_name: req.body.country_name,
            logocolor: req.body.logocolor,
            Excolor: req.body.Excolor,
            Bgcolor: req.body.Bgcolor,
            Bgtopcolor: req.body.Bgtopcolor,
            Rlightcolor: req.body.Rlightcolor,
            Rdarkcolor: req.body.Rdarkcolor,
            shadow: req.body.shadow,
            shadow20: req.body.shadow20,
            fontcolor: req.body.fontcolor,
        };
        // let addData = await Colors.create(data);
        res.status(200).json({
            status: "200",
            addData: "addData",
        });
    } catch (err) {
        res.status(200).json({
            status: "500",
            message: err.message,
        });
    }
};

exports.addbyxlsx = async function (req, res) {
    try {
        let filePath = "./public/" + req.file.filename;
        let workbook = xlsx.readFile(filePath);
        let ws = workbook.Sheets[workbook.SheetNames[0]];
        var xlsxData = xlsx.utils.sheet_to_json(ws);
        fs.unlinkSync(filePath);
        // xlsxData.map((e) => {
        //     e.sm_photo = "images/Small_image/" + e.sm_photo;
        //     e.lg_photo = "images/Large_image/" + e.lg_photo;
        // })
        console.log(xlsxData._id);
        let data = await Colors.insertMany(xlsxData);

        res.status(200).json({
            status: "200",
            data: data,
        });
    } catch (err) {
        res.status(200).json({
            status: "500",
            message: err.message,
        });
    }
};

exports.get = async function (req, res) {
    try {
        let addData
        if (req.params.id) {
            addData = await Colors.findById(req.params.id)
        } else {

            addData = await Colors.find();
        }
        res.status(200).json({
            status: "200",
            addData: addData,
        });
    } catch (err) {
        res.status(200).json({
            status: "500",
            message: err.message,
        });
    }
};