const Prediction = require("../models/Prediction");
const User = require("../models/User");
const Match = require("../models/Match");
const Cup = require("../models/Cup");
const moment = require("moment");

exports.get = async function (req, res, next) {
  try {
    req.body.createAt = moment(new Date()).format("YYYY-MM-DD[T00:00:00.000Z]");
    let find = await Cup.findById(req.params.id);
//     let find = await Prediction.find({match : req.body.match , createAt : req.body.createAt});
//     if (!find) {
      res.status(200).json({
        status: "500",
        // message: "this Match not found !",
        find,
      });
//     } else {
//       req.body.user = req.body.userId;
//       find = await Prediction.find({
//         match: req.body.match,
//         user: req.body.userId,
//       });
      
//       console.log(find.length);
//       if (find.length === 1) {
//         res.status(200).json({
//           status: "500",
//           message: "this User allready pridict !",
//         });
//       } else {
//         let addData = await Prediction.create(req.body);
//         res.status(200).json({
//           status: "200",
//           addData: addData,
//         });
//       }
//     }
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
