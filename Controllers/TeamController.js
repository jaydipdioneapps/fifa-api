const Team = require("../models/Team");
const TeamTwo = require("../models/TeamTwo");
var xlsx = require("xlsx");
var fs = require('fs');

exports.add = async function (req, res) {
  try {
    let find = await Team.find({ name: req.body.name });
    if (find[0]) {
      res.status(200).json({
        status: "500",
        message: "This team is already added !",
      });
    } else {
      let first_data = await Team.create({
        name: req.body.name,
        logo: req.file.path,
        teamphoto: req.file.path,
        description: req.body.description,
        colors: req.body.colorsid,
        players: req.body.players,
      });
      let secondData = await Team.findById(first_data._id)
        .populate("players.player")
        .exec();
      var mg = [];

      secondData.players.map((e) => {
        let newplayer = {
          name: e.player.name,
          sm_photo: e.player.sm_photo,
          lg_photo: e.player.lg_photo,
          age: e.player.age,
          games: e.player.games,
          goals: e.player.goals,
          biography: e.player.biography,
          role: e.role,
        };

        mg = [...mg, newplayer];
      });

      let finalData = await TeamTwo.create({
        name: secondData.name,
        logo: secondData.logo,
        teamphoto: secondData.teamphoto,
        description: secondData.description,
        colors: secondData.colorsid,
        players: mg,
      });
      res.status(200).json({
        status: "200",
        addData: finalData,
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
    let ws = workbook.Sheets[workbook.SheetNames[2]];
    var xlsxData = xlsx.utils.sheet_to_json(ws);
    fs.unlinkSync(filePath);

    var mg = [];
    xlsxData.map((e) => {
      mg.push({
        player: e.id,
        role: e.role,
      });
    });
    let insert = {
      name: req.body.name,
      logo: req.body.logo,
      teamphoto: req.body.teamphoto,
      description: req.body.description,
      colors: req.body.colorsid,
      players: mg,
    };
    console.log(insert);
    let data = await Team.create(insert);
    let secondData = await Team.findById(data._id)
      .populate("players.player")
      .exec();
    var mg = [];

    secondData.players.map((e) => {
      let newplayer = {
        name: e.player.name,
        sm_photo: e.player.sm_photo,
        lg_photo: e.player.lg_photo,
        age: e.player.age,
        games: e.player.games,
        goals: e.player.goals,
        biography: e.player.biography,
        role: e.role,
      };

      mg = [...mg, newplayer];
    });

    let finalData = await TeamTwo.create({
      name: secondData.name,
      logo: secondData.logo,
      teamphoto: secondData.teamphoto,
      description: secondData.description,
      colors: req.body.colorsid,
      players: mg,
    });
    res.status(201).json({
      status: "success",
      data: finalData,
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
    let addData = await TeamTwo.find()
      // .select("name players teamphoto description logo colors")
      .populate("colors")
      .exec();
    res.status(200).json({
      status: "200",
      teams: addData,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.getOne = async function (req, res) {
  try {
    let addData = await TeamTwo.findById(req.params.id)
    // .populate("colors")
    // .exec();
    res.status(200).json({
      status: "200",
      teams: addData,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
