const Cup = require("../models/Cup");

exports.add = async function (req, res) {
  try {
    let addData = await Cup.create({
      name: req.body.name,
      match: req.body.match,
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

exports.get = async function (req, res) {
  try {
    let addData = await Cup.find({}, { match: 0 }).exec();
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

exports.getOne = async function (req, res) {
  try {
    let addData = await Cup.findById(req.params.id)
      .populate("match")
      .exec();
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