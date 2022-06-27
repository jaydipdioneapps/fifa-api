const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
var nodemailer = require("nodemailer");

exports.login = async function (req, res, next) {
  try {
    let email = req.body.email;

    let data = await User.findOne({ email });

    if (!data) {
      throw new Error("Please enter valid email");
    } else {
      let pass = req.body.password;
      let checkUser = await bcrypt.compare(pass, data.password);
      if (!checkUser) {
        throw new Error("Please enter valid password");
      } else {
        var token = await jwt.sign({ id: data._id }, "malkari");
        res.status(200).json({
          status: "200",
          message: "login successfully",
          data: data,
          token,
        });
      }
    }
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.signUp = async function (req, res, next) {
  try {
    let email = req.body.email;
    let check = await User.find({ email: email });
    let pass = req.body.password;
    let cPass = req.body.cPassword;
    if (check[0]) {
      throw new Error("this emailId is already exist!!");
    }
    if (pass.length < 6) {
      throw new Error("Password minlength is 8");
    }
    if (pass != cPass) {
      throw new Error("Password must be same");
    }
    let user = { ...req.body };
    user.password = await bcrypt.hash(pass, 15);
    user.cPassword = undefined;
    let newUser = await User.create(user);
    var token = await jwt.sign({ id: newUser._id }, "malkari");
    res.status(200).json({
      status: "200",
      message: "registration successfully",
      data: newUser,
      token,
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.forgotPwd = async function (req, res, next) {
  try {
    let email = req.body.email;

    let data = await User.findOne({ email });

    if (!data) {
      throw new Error("Please enter valid email");
    } else {
      // let pass = req.body.password;
      // let checkUser = await bcrypt.compare(pass, data.password);
      // if (!checkUser) {
      //   throw new Error("Please enter valid password");
      // } else {
      //   var token = await jwt.sign({ id: data._id }, "malkari");
      //   res.status(200).json({
      //     status: "200",
      //     message: "login successfully",
      //     data: data,
      //     token,
      //   });
      // }

    }
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.protect = async function (req, res, next) {
  try {
    console.log("Middleware call");

    let token = req.headers.user_authorization;
    if (!token) {
      throw new Error("Please send token");
    }

    let tokenData = await jwt.verify(token, "malkari");
    req.body.userId = tokenData.id;

    let checkUser = await User.findById(tokenData.id);

    if (!checkUser) {
      throw new Error("User Not Found");
    }
    next();
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};


exports.protectGlobal = async function (req, res, next) {
  try {
    let user = "Dione";
    let password = "Dione&169";

    // console.log(code1);
    let token = req.headers.data_authorization;
    if (!token) {
      throw new Error("Please send token");
    }

    let tokenData = await jwt.verify(token, "malkari");


    if (user != tokenData.user) {
      throw new Error("User Not Found");
    } else if (password != tokenData.password) {
      throw new Error("password is incorrect");
    }
    next();
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.mainsending = async function (req, res, next) {
  try {
    
      var from = req.body.from;
      var to = req.body.to;
      var subject = req.body.subject;
      var message = req.body.message;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sojitraayush2101@gmail.com",
          pass: "lngmthisstvznooy",
        },
      });

      var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email Sent: " + info.response);
        }
        res.status(200).json({
          status: "500",
          info,
        });
      });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};