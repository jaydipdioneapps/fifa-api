const Prediction = require("../models/Prediction");
// const User = require("../models/User");
// const Match = require("../models/Match");
const Cup = require("../models/Cup");
const moment = require("moment");
function removeDubeliment(arr) {
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
    let todayUserScore = [];
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
          score += dm[k].score;
        }
        let km = {
          name: dm[i].user.name,
          userId: dm[i].user.id,
          score: score,
        };
        todayUserLeaderboardList = [...todayUserLeaderboardList, km];
      }
    }
    todayUserLeaderboardList.sort((a, b) => {
      return b.score - a.score;
    });
    todayUserLeaderboardList.map((e, i) => {
      if (e.userId === req.body.userId) {
        todayUserScore.push(e);
      }
      e.num = i + 1;
    });
    let GlobalUserList = [];
    let GlobalUserScore = [];
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
    // console.log(GlobalUserList);
    let jk = [];
    for (let i = 0; i < GlobalUserList.length; i++) {
      let find = [];
      for (let j = 0; j < matchs.length; j++) {
        let getData = await Prediction.find(
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
        if (getData.length) {
          find = [...find ,...getData]
          // jk = [...jk, ...find];
        }
      }
      // console.log(find);
      if (find.length) {
        let score = 0;
        for (let k = 0; k < jk.length; k++) {
          score += jk[k].score;
        }
        let km = {
          name: find[0].user.name,
          userId: find[0].user._id,
          score: score,
        };
        GlobalUserLeaderboardList = [...GlobalUserLeaderboardList, km];
        // jk= [];
      } 
    }
    GlobalUserLeaderboardList.sort((a, b) => {
      return b.score - a.score;
    });
    for (let i = 0; i < GlobalUserLeaderboardList.length; i++) {
      console.log(req.body.userId);
      console.log(GlobalUserLeaderboardList[i].userId);
      if (GlobalUserLeaderboardList[i].userId == req.body.userId) {
        GlobalUserScore.push(GlobalUserLeaderboardList[i]);
        break
      }
      GlobalUserLeaderboardList[i]['num'] = i + 1;
    }
    res.status(200).json({
      status: "200",
      // cupData,
      // GlobalUserList,
      todayUserScore,
      todayUserLeaderboardList,
      GlobalUserScore,
      GlobalUserLeaderboardList,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

