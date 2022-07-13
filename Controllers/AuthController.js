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
        var token = await jwt.sign({ data }, "malkari");
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
    var token = await jwt.sign({ newUser }, "malkari");
    var to = req.body.emial;
    var subject = "Welcome !!";
    var html = `<!DOCTYPE html><html lang="en-US"> <head><title>Welcome !!</title> <meta name="description" content="Welcome !! Email" /> <style type="text/css"> * { background: #fff !important } .links { padding: 10px; font-size: 30px; width: 30px; text-align: center; text-decoration: none; border-radius: 50%; margin-right: 7px; } .links img{ margin-top: 10px; width: 60px; height: 60px; } </style> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; width: 100%; background-color: #f2f3f8" leftmargin="0" > <!--100% body table--> <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style=" @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;700&display=swap'); font-family: 'Mulish', sans-serif; " > <tr> <td style="height: 20px"></td> </tr> <tr> <td style="text-align: center"> <a href="http://dioneapps.com" title="logo" target="_blank"> <img src="https://i.ibb.co/5jbQw4r/Group-70-01.png" style="width: 323px; height: 106px" title="logo" alt="logo" /> </a> </td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style=" width: 600px; border-radius: 3px; text-align: center; -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); " > <tr> <td style="width: 600px; height: 400px"> <img src="https://i.ibb.co/Snngyyb/Football-Volunteering-banner-1.png" title="logo" alt="logo" /> </td> </tr> <tr> <td style="height: 30px"></td> </tr> <tr> <td style="padding: 0 35px"> <h1 style=" color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Mulish', sans-serif; " > Welcome !! </h1> <span style=" display: inline-block; vertical-align: middle; border-bottom: 1px solid #cecece; width: 100px; " ></span> <p style=" color: #455056; font-size: 15px; line-height: 24px; margin: 0; " >We’re so happy you’re here. we made fifa application for more interesting thing. we hope you’ll get lost in our application.We’re so happy you’re here.</p> </td> </tr> <tr> <td style="height: 30px">&nbsp;</td> </tr> <tr> <td> <a href="#" ><img src="https://i.ibb.co/kD6DqM4/Group-73.png" width="220px" height="60px" alt=""></a > </td> </tr> <tr> <td style="height: 30px">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td style="height: 20px">&nbsp;</td> </tr> <tr> <td style="text-align: center"> <p style=" margin: 10px 0; font-family: 'Mulish', sans-serif; font-style: normal; font-weight: 600; font-size: 20px; line-height: 25px; text-align: center; color: #9f9f9f; " > Company - 416-417,laxmi enclave-2,near gajera circle, surat,india. </p> <!-- <span style="height: 80px">&nbsp;</span> --> <span style=" display: inline-block; vertical-align: middle; border-bottom: 1px solid #cecece; width: 500px; " > </span> <span style="height: 80px">&nbsp;</span> <p style=" font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0; " > <a href="https://www.facebook.com/DioneApps-106632712060664" target="_blank" class="links"><img src="https://i.ibb.co/VwK3q6w/1.png" alt="facebook"></a> <a href="https://instagram.com/dioneapps_?igshid=YmMyMTA2M2Y=" target="_blank" class="links"><img src="https://i.ibb.co/FKjL4mH/2.png" alt="instagram"></a> <a href="https://www.linkedin.com/company/dioneapps/" target="_blank" class="links"><img src="https://i.ibb.co/MSPqyBQ/3.png" alt="linkedin"></a> <a href="http://dioneapps.com/" target="_blank" class="links"><img src="https://i.ibb.co/zsPgK2M/4.png" alt="dioneapps"></a> </p> </td> </tr> <tr> <td style="height: 80px">&nbsp;</td> </tr> </table> </body></html>`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@dioneapps.com",
        pass: "gztusgabmplteawm",
      },
    });

    var mailOptions = {
      from: "info@dioneapps.com",
      to: to,
      subject: subject,
      text: message,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent: " + info.response);
      }
      res.status(200).json({
        status: "200",
        message: "registration successfully",
        data: newUser,
        token,
      });
      // res.status(200).json({
      //   status: "500",
      //   info,
      // });
    });
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};

exports.ChangePAssword = async function (req, res, next) {
  try {
    let data = await User.findById(req.body.userId);
    let checkUser = await bcrypt.compare(req.body.current, data.password);
    if (!checkUser) {
      throw new Error("Please enter valid Current Password");
    } else {
      let New = req.body.new;
      let confirm = req.body.confirm;
      if (confirm !== New) {
        throw new Error(
          "Please enter new password and confirm password same !!"
        );
      } else {
        if (req.body.current !== New) {
          throw new Error(
            "Please enter new password and current password different !!"
          );
        } else {
          let newPassowrd = await bcrypt.hash(New, 15);
          console.log(data);
          let update = await User.findByIdAndUpdate(data._id, {
            password: newPassowrd,
          });
          let pudated = await User.findById(update._id);
          var token = await jwt.sign({ data: pudated }, "malkari");
          res.status(200).json({
            status: "200",
            message: "password change successfully",
            token,
          });
        }
      }
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
    req.body.userId = tokenData.data._id;
    let currentPassword = tokenData.data.password;
    let checkUser = await User.findById(tokenData.data._id);
    if (!checkUser) {
      throw new Error("User Not Found");
    }
    console.log(checkUser.password);
    console.log(currentPassword);
    if (checkUser.password !== currentPassword) {
      throw new Error("Password is changed,So login aging");
    }
    next();
  } catch (err) {
    res.status(200).json({
      status: "500",
      message: err.message,
    });
  }
};
exports.Logout = async function (req, res, next) {
  try {
    console.log("Middleware call");

    let token = req.headers.user_authorization;
    if (!token) {
      throw new Error("Please send token");
    }

    let tokenData = await jwt.destroy(token);

    if (!checkUser) {
      throw new Error("User Not Found");
    }
    res.status(200).json({
      status: "200",
      message: "logout successfully ",
    });
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
exports.mailSending = async function (req, res, next) {
  try {
    var to = req.body.to;
    var subject = "Forgot paasword!!";
    // var message = req.body.message;
    // var html = `<!DOCTYPE html><html lang="en-US"> <head><title>Welcome !!</title> <meta name="description" content="Welcome !! Email" /> <style type="text/css"> * { background: #fff !important } .links { padding: 10px; font-size: 30px; width: 30px; text-align: center; text-decoration: none; border-radius: 50%; margin-right: 7px; } .links img{ margin-top: 10px; width: 60px; height: 60px; } </style> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; width: 100%; background-color: #f2f3f8" leftmargin="0" > <!--100% body table--> <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style=" @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;700&display=swap'); font-family: 'Mulish', sans-serif; " > <tr> <td style="height: 20px"></td> </tr> <tr> <td style="text-align: center"> <a href="http://dioneapps.com" title="logo" target="_blank"> <img src="https://i.ibb.co/5jbQw4r/Group-70-01.png" style="width: 323px; height: 106px" title="logo" alt="logo" /> </a> </td> </tr> <tr> <td> <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style=" width: 600px; border-radius: 3px; text-align: center; -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); " > <tr> <td style="width: 600px; height: 400px"> <img src="https://i.ibb.co/Snngyyb/Football-Volunteering-banner-1.png" title="logo" alt="logo" /> </td> </tr> <tr> <td style="height: 30px"></td> </tr> <tr> <td style="padding: 0 35px"> <h1 style=" color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Mulish', sans-serif; " > Welcome !! </h1> <span style=" display: inline-block; vertical-align: middle; border-bottom: 1px solid #cecece; width: 100px; " ></span> <p style=" color: #455056; font-size: 15px; line-height: 24px; margin: 0; " >We’re so happy you’re here. we made fifa application for more interesting thing. we hope you’ll get lost in our application.We’re so happy you’re here.</p> </td> </tr> <tr> <td style="height: 30px">&nbsp;</td> </tr> <tr> <td> <a href="#" ><img src="https://i.ibb.co/kD6DqM4/Group-73.png" width="220px" height="60px" alt=""></a > </td> </tr> <tr> <td style="height: 30px">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td style="height: 20px">&nbsp;</td> </tr> <tr> <td style="text-align: center"> <p style=" margin: 10px 0; font-family: 'Mulish', sans-serif; font-style: normal; font-weight: 600; font-size: 20px; line-height: 25px; text-align: center; color: #9f9f9f; " > Company - 416-417,laxmi enclave-2,near gajera circle, surat,india. </p> <!-- <span style="height: 80px">&nbsp;</span> --> <span style=" display: inline-block; vertical-align: middle; border-bottom: 1px solid #cecece; width: 500px; " > </span> <span style="height: 80px">&nbsp;</span> <p style=" font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0; " > <a href="https://www.facebook.com/DioneApps-106632712060664" target="_blank" class="links"><img src="https://i.ibb.co/VwK3q6w/1.png" alt="facebook"></a> <a href="https://instagram.com/dioneapps_?igshid=YmMyMTA2M2Y=" target="_blank" class="links"><img src="https://i.ibb.co/FKjL4mH/2.png" alt="instagram"></a> <a href="https://www.linkedin.com/company/dioneapps/" target="_blank" class="links"><img src="https://i.ibb.co/MSPqyBQ/3.png" alt="linkedin"></a> <a href="http://dioneapps.com/" target="_blank" class="links"><img src="https://i.ibb.co/zsPgK2M/4.png" alt="dioneapps"></a> </p> </td> </tr> <tr> <td style="height: 80px">&nbsp;</td> </tr> </table> </body></html>`;
    var html =
      '<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type" /><title>Reset Password Email Template.</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover {text-decoration: underline !important;}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #fff !important;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"><a href="https://dioneapps.com" title="logo" target="_blank"><img width="60" src="http://13.233.194.118/image/email_logo.png" title="logo" alt="logo"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">You havere quested to reset your password</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;"> We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions. </p><a href="javascript:void(0);"style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">ResetPassword</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.dioneapps.com</strong></p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body></html>';

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@dioneapps.com",
        pass: "gztusgabmplteawm",
      },
    });

    var mailOptions = {
      from: "info@dioneapps.com",
      to: to,
      subject: subject,
      text: message,
      html: html,
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
