const Prediction = require("../models/Prediction");
const User = require("../models/User");
const Match = require("../models/Match");
const Cup = require("../models/Cup");
const moment = require("moment");
function removeDubeliment(arr) {
  // const duplicateIds = arr
  //   .map((v) => v.user.toString())
  //   .filter((v, i, vIds) => vIds.indexOf(v.toString()) !== i);
  // const duplicates = arr.filter((obj) => duplicateIds.includes(obj.user));
  let duplicateIds = Object.values(
    arr.reduce(
      (acc, cur) => Object.assign(acc, { [cur.user.toString()]: cur }),
      {}
    )
  );
  return duplicateIds;
}

exports.get = async function (req, res, next) {
  try {
    let today = moment(new Date()).format("YYYY-MM-DD[T00:00:00.000Z]");
    let cupData = await Cup.findById(req.params.id);
    let todayUserList = [];
    let todayUserLeaderboardList = [];

    let matchs = cupData.match;
    for (let i = 0; i < matchs.length; i++) {
      let find = await Prediction.find(
        { match: matchs[i], createAt: today },
        {
          _id: 0,
          predictiont1: 0,
          predictiont2: 0,
          match: 0,
          createAt: 0,
          __v: 0,
          score: 0,
        }
      );

      if (find.length) {
        todayUserList = [...todayUserList, ...find];
      }
    }
    todayUserList = removeDubeliment(todayUserList);
    let dm = [];
    for (let i = 0; i < todayUserList.length; i++) {
      let find = [];
      for (let j = 0; j < matchs.length; j++) {
        find = await Prediction.find(
          { match: matchs[j], createAt: today, user: todayUserList[i].user },
          {
            _id: 0,
            predictiont1: 0,
            predictiont2: 0,
            match: 0,
            createAt: 0,
            __v: 0,
          }
        ).populate("user");
        if (find.length) {
          dm = [...dm, ...find];
        }
      }
      if (dm.length) {
        let score = 0;
        for (let k = 0; k < dm.length; k++) {
          score += dm[k].score ;
        }
        let km = {
          name: dm[0].user.name,
          score: score,
        };
        todayUserLeaderboardList = [...todayUserLeaderboardList, km];
      }
    }
    let GlobalUserList = [];
    let GlobalUserLeaderboardList = [];
    for (let i = 0; i < matchs.length; i++) {
      let find = await Prediction.find(
        { match: matchs[i] },
        {
          _id: 0,
          predictiont1: 0,
          predictiont2: 0,
          match: 0,
          createAt: 0,
          __v: 0,
          score: 0,
        }
      );

      if (find.length) {
        GlobalUserList = [...GlobalUserList, ...find];
      }
    }
    GlobalUserList = removeDubeliment(GlobalUserList);
    dm = [];
    for (let i = 0; i < GlobalUserList.length; i++) {
      let find = [];
      for (let j = 0; j < matchs.length; j++) {
        find = await Prediction.find(
          { match: matchs[j], user: GlobalUserList[i].user },
          {
            _id: 0,
            predictiont1: 0,
            predictiont2: 0,
            match: 0,
            createAt: 0,
            __v: 0,
          }
        ).populate("user");
        if (find.length) {
          dm = [...dm, ...find];
        }
      }
      if (dm.length) {
        let score = 0;
        for (let k = 0; k < dm.length; k++) {
          score += dm[k].score ;
        }
        let km = {
          name: dm[0].user.name,
          score: score,
        };
        GlobalUserLeaderboardList = [...GlobalUserLeaderboardList, km];
      }
    }

    res.status(200).json({
      status: "200",
      todayUserLeaderboardList,
      GlobalUserLeaderboardList
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
