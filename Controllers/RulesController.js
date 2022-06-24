const Rules = require("../models/Rules");

exports.add = async function (req, res) {
    try {
        // console.log(req.body);
        let data = {
            name: req.body.name,
            rule: req.body.rule
        };
        // let addData = await Rules.create(data);
        res.status(200).json({
            status: "200",
            data,
        });
    } catch (err) {
        res.status(200).json({
            status: "500",
            message: err.message,
        });
    }
};

exports.get = async function (req, res, next) {
    try {
        let data = await Rules.findOne({ name: req.body.name });
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
}

exports.update = async function (req, res, next) {
    try {
        let newdata = await Rules.findOneAndUpdate({ name: req.body.name },
            {
                name: req.body.name,
                rule: req.body.rule,
            })
        res.status(200).json({
            status: "200",
            data: newdata,
        });
    } catch (err) {
        res.status(200).json({
            status: "500",
            message: err.message,
        });
    }
};