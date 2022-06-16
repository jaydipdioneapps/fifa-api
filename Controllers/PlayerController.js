const Player = require("../models/Player");
var xlsx = require("xlsx");
var fs = require("fs");
const TeamTwo = require("../models/TeamTwo");
const mongoose = require("mongoose");

exports.add = async function (req, res) {
  try {
    //  console.log(req.files.photosm[0]);
    let data = {
      name: req.body.name,
      sm_photo: req.files.photosm[0].path,
      lg_photo: req.files.photolg[0].path,
      age: req.body.age,
      games: req.body.games,
      goals: req.body.goals,
      biography: req.body.biography,
    };
    // let addData = await Player.create(data);
    res.status(200).json({
      status: "200",
      addData: data,
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
    let addData;
    if (req.params.playerId) {
      addData = await TeamTwo.aggregate([
        { $unwind: "$players" },
        {
          $match: {
            "players._id": mongoose.Types.ObjectId(req.params.playerId),
          },
        },
      ]);
      console.log("ohk");
      res.status(200).json({
        status: "200",
        addData: addData[0].players,
      });
    } else {

      addData = await Player.find();
      res.status(200).json({
        status: "200",
        addData: addData,
      });
    }
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
    xlsxData.map((e) => {
      e.sm_photo = "images/Small_image/" + e.sm_photo;
      e.lg_photo = "images/Large_image/" + e.lg_photo;
    });
    console.log(xlsxData._id);
    let data = await Player.insertMany(xlsxData);

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
