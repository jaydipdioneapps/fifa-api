const Match = require("../models/Match");
const moment = require("moment");
const Colors = require("../models/Colors");
const Prediction = require("../models/Prediction");
// const ObjectId = require('mongoose').Schema.ObjectId;
const mongoose = require("mongoose");
const Group = require("../models/Group");

exports.add = async function (req, res) {
  try {
    // let data = await Data.find();
    // let addData = await Group.find({
    //   teams: {
    //     $in: [mongoose.Types.ObjectId(req.body.team1id)],
    //   },
    // });

    // console.log(addData);
    let addData = await Match.create({
      team1: req.body.team1id,
      team2: req.body.team2id,
      date: req.body.date,
      time: req.body.time,
      venue: req.body.venue,
      matchType: req.body.matchType,
      group: req.body.group,
    });
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

exports.getForHome = async function (req, res) {
  try {
    // var i;

    var d = new Date();
    d.setDate(new Date().getDate() - 1);
    var g = new Date();
    g.setDate(new Date().getDate() + 1);
    var tomorrow = moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");
    var nextoftomorrow = moment(g).format("YYYY-MM-DD[T00:00:00.000Z]");

    let today = await Match.find({
      date: { $gte: tomorrow, $lt: nextoftomorrow },
    }).populate(
      "team1 team2",
      "-players  -createAt -__v -description -teamphoto "
    );

    today = [today[0]];
    await today.map(async (e, i) => {
      today[i].team1.colors = await Colors.findById(e.team1.colors);
      return 0;
    });
    await today.map(async (e, i) => {
      today[i].team2.colors = await Colors.findById(e.team2.colors);
      return 0;
    });
    today.map(async (e, i) => {
     today[i].time = await today[i].time.toUpperCase();
   });
      //  console.log(today[i].team2.colors);
      // $gte:"Mon May 30 18:47:00 +0000 2015",
    // $lt: "Sun May 30 20:40:36 +0000 2010"
    //2021-05-12T00:00:00.000Z
    //2021-05-12T23:59:59.000Z
    // db.collectionName.find({"start_date":{"$lte":new Date()}}).pretty()
    // db.collectionName.find({"start_date":{"$gte":new Date()}}).pretty()

    let last = await Match.find({ date: { $lt: tomorrow } }).populate(
      "team1 team2",
      "-players  -createAt -__v"
    );
    last.map(async (e, i) => {
      last[i].time = last[i].time.toUpperCase();
    });
    res.status(200).json({
      status: "200",
      today: today,
      last: last,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.getForUpcoming = async function (req, res) {
  try {
    var d = new Date();
    // d.setDate(new Date().getDate() - 1);
    // var g = new Date();
    // g.setDate(new Date().getDate() + 1);
    // var tomorrow = moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");
    // var nextoftomorrow = moment(g).format("YYYY-MM-DD[T00:00:00.000Z]");
    // console.log(d);
    // console.log(g);
    let upcoming = await Match.find({
      date: { $gte: d },
    }).populate(
      "team1 team2",
      "-players  -createAt -__v -description -teamphoto "
    );
    upcoming.map(async (e, i) => {
      upcoming[i].time = upcoming[i].time.toUpperCase();
      console.log(upcoming[i].time);
    });
    res.status(200).json({
      status: "200",
      upcoming: upcoming,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.getTody = async function (req, res) {
  try {
    var d = new Date();
    d.setDate(new Date().getDate());
    var tomorrow = moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");
    console.log(d);
    let today = await Match.find({
      date: tomorrow,
    }).populate(
      "team1 team2",
      "-players  -createAt -__v -description -teamphoto "
    );
    today.map(async (e, i) => {
      today[i].time = today[i].time.toUpperCase();
      console.log(today[i].time);
    });
    res.status(200).json({
      status: "200",
      today,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.getonDate = async function (req, res) {
  try {
    
    let today = await Match.find({
      date: req.params.date,
    }).populate(
      "team1 team2",
      "-players  -createAt -__v -description -teamphoto "
    );
    today.map(async (e, i) => {
      today[i].time = today[i].time.toUpperCase();
      console.log(today[i].time);
    });
    res.status(200).json({
      status: "200",
      today,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.update = async function (req, res, next) {
  try {
    let data = {
      prediction: {
        team1: req.body.team1,
        team2: req.body.team2,
      },
    };
    await Match.findByIdAndUpdate(req.params.id, data);
    // // let predictiont1 = req.body.team1;
    // // let predictiont2 = req.body.team2;
    // res.status(200).json({
    //   status: "200",
    //   updateData: data,
    // });
    console.log("update");
    next();
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.score = async function (req, res, next) {
  try {
    let ids = mongoose.Types.ObjectId(req.params.id);
    let id = await Prediction.find(
      {
        match: ids,
      },
      { _id: 1 }
    );
    id.map(async (e) => {
      let data = await Prediction.findByIdAndUpdate(e.id, { score: 0 });
      console.log(data);
    });
    id = await Prediction.find(
      {
        predictiont1: req.body.team1,
        predictiont2: req.body.team2,
        match: ids,
      },
      { _id: 1 }
    );
    id.map(async (e) => {
      let data = await Prediction.findByIdAndUpdate(e.id, { score: 3 });
      console.log(data);
    });
    if (req.body.team1 > req.body.team2) {
      let id = await Prediction.find(
        {
          $expr: { $and: [{ $gt: ["$predictiont1", "$predictiont2"] }] },
          match: ids,
        },
        { _id: 1 }
      );
      id.map(async (e) => {
        await Prediction.findByIdAndUpdate(e.id, { score: 2 });
      });
    } else if (req.body.team1 < req.body.team2) {
      let id = await Prediction.find(
        {
          $expr: { $and: [{ $lt: ["$predictiont1", "$predictiont2"] }] },
          match: ids,
        },
        { _id: 1 }
      );
      id.map(async (e) => {
        await Prediction.findByIdAndUpdate(e.id, { score: 2 });
      });
    } else if (req.body.team1 == req.body.team2) {
      let id = await Prediction.find(
        {
          $expr: { $and: [{ $eq: ["$predictiont1", "$predictiont2"] }] },
          match: ids,
        },
        { _id: 1 }
      );
      id.map(async (e) => {
        await Prediction.findByIdAndUpdate(e.id, { score: 1 });
      });
    }
    res.status(200).json({
      status: "200",
      message: "success",
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
