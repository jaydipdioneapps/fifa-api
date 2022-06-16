const Group = require("../models/Group");

exports.add = async function (req, res) {
    try {
        let addData = await Group.create({
            group: req.body.group,
            teams: req.body.teams,
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
        let addData = await Group.find()
            .populate("teams.team", "-players -_id -logo -teamphoto -description -createAt -__v")
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

exports.getOne = async function (req, res) {
    try {
        let addData = await Group.findById(req.params.id)
            .populate("teams.team", "-players")
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