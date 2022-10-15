const Match = require("../models/Match");
const moment = require("moment");
const Colors = require("../models/Colors");
const Prediction = require("../models/Prediction");
// const ObjectId = require('mongoose').Schema.ObjectId;
const mongoose = require("mongoose");
// const Group = require("../models/Group");

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

    // var d = new Date();
    // d.setDate(new Date().getDate());
    // var tomorrow = moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");
    // console.log(d);
    // let today = await Match.find({
    //   date: tomorrow,
    // }).populate(
    //   "team1 team2",
    //   "-players  -createAt -__v -description -teamphoto "
    // );
    // today.map(async (e, i) => {
    //   today[i].time = today[i].time.toUpperCase();
    //   console.log(today[i].time);
    // });
    if (today.length){
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
      // let data = [];
      // today[0].date.setDate(new Date(today[0].date).getDate() + 1);
      let raju = await Prediction.find({
        user: req.body.userId,
        match: today[0]._id,
      });
      // today[0].date.setDate(new Date(today[0].date).getDate() + 1);
      let cnt = await Prediction.find({ match: today[0]._id });
      if (raju.length === 0) {
        today[0] = {
          result: today[0].prediction,
          _id: today[0]._id,
          team1: today[0].team1,
          team2: today[0].team2,
          date: today[0].date,
          time: today[0].time,
          venue: today[0].venue,
          matchType: today[0].matchType,
          ispredict: false,
          userPrediction: {
            predictiont1: 0,
            predictiont2: 0,
          },
          totalPrediction: cnt.length,
        };
      } else {
        today[0] = {
          result: today[0].prediction,
          _id: today[0]._id,
          team1: today[0].team1,
          team2: today[0].team2,
          date: today[0].date,
          time: today[0].time,
          venue: today[0].venue,
          matchType: today[0].matchType,
          ispredict: true,
          userPrediction: {
            predictiont1: raju[0].predictiont1,
            predictiont2: raju[0].predictiont2,
          },
          totalPrediction: cnt.length,
        };
      }
    }

    // today[0].date


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
      return false;
    });
    await last.map(async (e, i) => {
      last[i].team1.colors = await Colors.findById(e.team1.colors);
      return 0;
    });
    await last.map(async (e, i) => {
      last[i].team2.colors = await Colors.findById(e.team2.colors);
      return 0;
    });
    let data = [];
    for (let index = 0; index < last.length; index++) {
      let raju = await Prediction.find({
        user: req.body.userId,
        match: last[index]._id,
      });
      let cnt = await Prediction.find({ match: last[index]._id });
      last[index].date.setDate(new Date(last[index].date).getDate() + 1);
      if (raju.length === 0) {
        data[index] = {
          result: last[index].prediction,
          _id: last[index]._id,
          team1: last[index].team1,
          team2: last[index].team2,
          date: last[index].date,
          time: last[index].time,
          venue: last[index].venue,
          matchType: last[index].matchType,
          ispredict: false,
          userPrediction: {
            predictiont1: 0,
            predictiont2: 0,
          },
          totalPrediction: cnt.length,
        };
      } else {
        data[index] = {
          result: last[index].prediction,
          _id: last[index]._id,
          team1: last[index].team1,
          team2: last[index].team2,
          date: last[index].date,
          time: last[index].time,
          venue: last[index].venue,
          matchType: last[index].matchType,
          ispredict: true,
          userPrediction: {
            predictiont1: raju[0].predictiont1,
            predictiont2: raju[0].predictiont2,
          },
          totalPrediction: cnt.length,
        };
      }
    }
    last = data;
    res.status(200).json({
      status: "200",
      today: today,
      last: last,
      // data,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.getForResult = async function (req, res) {
  try {
    // var i;

    var d = new Date();
    d.setDate(new Date().getDate() - 1);
    var tomorrow = moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");

    let main = await Match.findById(req.params.id).populate(
      "team1 team2",
      "-players  -createAt -__v -description -teamphoto "
    );

    main = [main];
    // console.log(main);
    await main.map(async (e, i) => {
      main[i].team1.colors = await Colors.findById(e.team1.colors);
      return 0;
    });
    await main.map(async (e, i) => {
      main[i].team2.colors = await Colors.findById(e.team2.colors);
      return 0;
    });
    main.map(async (e, i) => {
      main[i].time = await main[i].time.toUpperCase();
    });

    // main[0].date

    main[0].date.setDate(new Date(main[0].date).getDate() + 1);
    let raju = await Prediction.find({
      user: req.body.userId,
      match: main[0]._id,
    });
    if (raju.length === 0) {
      main[0] = {
        result: main[0].prediction,
        _id: main[0]._id,
        team1: main[0].team1,
        team2: main[0].team2,
        date: main[0].date,
        time: main[0].time,
        venue: main[0].venue,
        matchType: main[0].matchType,
        ispredict: false,
        userPrediction: {
          predictiont1: 0,
          predictiont2: 0,
        },
        reaction:
          "http://13.233.194.118:3002/images/reactions/noprediction.png",
        message: " ",
      };
    } else {
      var reaction = "";
      if (raju[0].score === 0) {
        reaction = "http://13.233.194.118:3002/images/reactions/oops!!.png";
        message = "Your Prediction was tottally wrong.";
      } else if (raju[0].score === 2) {
        reaction = "http://13.233.194.118:3002/images/reactions/uufff!!.png";
        message =
          "What you Predicted is wrong but the team you think wins has won, so you get 2 point.";
      } else if (raju[0].score === 3) {
        reaction = "http://13.233.194.118:3002/images/reactions/woohoo!!.png";
        message = "Your Prediction came true, so you get 3 point.";
      }
      main[0] = {
        result: main[0].prediction,
        _id: main[0]._id,
        team1: main[0].team1,
        team2: main[0].team2,
        date: main[0].date,
        time: main[0].time,
        venue: main[0].venue,
        matchType: main[0].matchType,
        ispredict: true,
        userPrediction: {
          predictiont1: raju[0].predictiont1,
          predictiont2: raju[0].predictiont2,
        },
        reaction,
        message,
      };
    }

    //  console.log(main[i].team2.colors);
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
      return false;
    });
    await last.map(async (e, i) => {
      last[i].team1.colors = await Colors.findById(e.team1.colors);
      return 0;
    });
    await last.map(async (e, i) => {
      last[i].team2.colors = await Colors.findById(e.team2.colors);
      return 0;
    });
    let data = [];
    let k = 0;
    for (let index = 0; index < last.length; index++) {
      if (last[index]._id == req.params.id) {
        k++;
        continue;
      }
      let raju = await Prediction.find({
        user: req.body.userId,
        match: last[index]._id,
      });
      last[index].date.setDate(new Date(last[index].date).getDate() + 1);
      if (raju.length === 0) {
        data[index - k] = {
          result: last[index].prediction,
          _id: last[index]._id,
          team1: last[index].team1,
          team2: last[index].team2,
          date: last[index].date,
          time: last[index].time,
          venue: last[index].venue,
          matchType: last[index].matchType,
          ispredict: false,
          userPrediction: {
            predictiont1: 0,
            predictiont2: 0,
          },
          reaction:
            "http://13.233.194.118:3002/images/reactions/noprediction.png",
          message: " ",
        };
      } else {
        var reaction = "";
        if (raju[0].score === 0) {
          reaction = "http://13.233.194.118:3002/images/reactions/oops!!.png";
          message = "Your Prediction was tottally wrong.";
        } else if (raju[0].score === 2) {
          reaction = "http://13.233.194.118:3002/images/reactions/uufff!!.png";
          message =
            "What you Predicted is wrong but the team you think wins has won, so you get 2 point.";
        } else if (raju[0].score === 3) {
          reaction = "http://13.233.194.118:3002/images/reactions/woohoo!!.png";
          message = "Your Prediction came true, so you get 3 point.";
        }
        data[index - k] = {
          result: last[index].prediction,
          _id: last[index]._id,
          team1: last[index].team1,
          team2: last[index].team2,
          date: last[index].date,
          time: last[index].time,
          venue: last[index].venue,
          matchType: last[index].matchType,
          ispredict: true,
          userPrediction: {
            predictiont1: raju[0].predictiont1,
            predictiont2: raju[0].predictiont2,
          },
          reaction,
          message,
        };
      }
    }
    last = data;
    // console.log(i);
    // console.log(last);
    res.status(200).json({
      status: "200",
      main: main,
      last: last,
      // data,
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
    let upcoming = await Match.find({
      date: { $gte: d },
    }).populate(
      "team1 team2 team1.colors",
      "-players  -createAt -__v -description -teamphoto "
    );
    upcoming.map(async (e, i) => {
      upcoming[i].time = upcoming[i].time.toUpperCase();
    });
    for (let i = 0; i < upcoming.length; i++) {
      upcoming[i].team2.colors = await Colors.findById(upcoming[i].team2.colors);
      upcoming[i].team1.colors = await Colors.findById(upcoming[i].team1.colors);
    }
    // await upcoming.map(async (e, i) => {
    //   console.log(upcoming[i].team2.colors);
    //   return 0;
    // });
    // await upcoming.map(async (e, i) => {
    //   console.log(upcoming[i].team1.colors);
    //   return 0;
    // });
    let data = [];
    let k = 0;
    for (let index = 0; index < upcoming.length; index++) {
      if (upcoming[index]._id == req.params.id) {
        k++;
        continue;
      }
      let raju = await Prediction.find({
        user: req.body.userId,
        match: upcoming[index]._id,
      });
      upcoming[index].date.setDate(
        new Date(upcoming[index].date).getDate() + 1
      );
      if (raju.length === 0) {
        data[index - k] = {
          result: upcoming[index].prediction,
          _id: upcoming[index]._id,
          team1: upcoming[index].team1,
          team2: upcoming[index].team2,
          date: upcoming[index].date,
          time: upcoming[index].time,
          venue: upcoming[index].venue,
          matchType: upcoming[index].matchType,
          ispredict: false,
          userPrediction: {
            predictiont1: 0,
            predictiont2: 0,
          },
          reaction: "No Prediction",
        };
      } else {
        var reaction = "";
        if (raju[0].score === 0) {
          reaction = "Oops!! 🥵";
        } else if (raju[0].score === 2) {
          reaction = "Uufff!! 😮‍💨";
        } else if (raju[0].score === 3) {
          reaction = "Woohoo!! 🎉";
        }
        data[index - k] = {
          result: upcoming[index].prediction,
          _id: upcoming[index]._id,
          team1: upcoming[index].team1,
          team2: upcoming[index].team2,
          date: upcoming[index].date,
          time: upcoming[index].time,
          venue: upcoming[index].venue,
          matchType: upcoming[index].matchType,
          ispredict: true,
          userPrediction: {
            predictiont1: raju[0].predictiont1,
            predictiont2: raju[0].predictiont2,
          },
          reaction,
        };
      }
    }
    upcoming = data;
    res.status(200).json({
      status: "200",
      upcoming,
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
    });
    for (var i = 0; i < today.length; i++) {
      today[i].team1.colors = await Colors.findById(today[i].team1.colors);
      today[i].team2.colors = await Colors.findById(today[i].team2.colors);
    }
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
    });
    if (req.body.team1 > req.body.team2) {
      let id = await Prediction.find(
        {
          $expr: { $and: [{ $gt: ["$predictiont1", "$predictiont2"] }] },
          match: ids,
        },
        { _id: 1 }
        );
        // console.log(ids);
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

