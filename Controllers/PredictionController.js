const Prediction = require("../models/Prediction");
const User = require("../models/User");
const Match = require("../models/Match");

// exports.add = async function (req, res) {
//   try {
//     User.updateMany
//     res.status(201).json({
//       status: "success",
//       addData: addData,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

exports.predict = async function (req, res, next) {
  try {
    let find = await Match.findById(req.body.match);
    if (!find) {
      res.status(200).json({
        status: "500",
        message: "this Match not found !",
      });
    }
    else {
      req.body.user = req.params.id;
      let addData = await Prediction.create(req.body)
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
}