const express = require("express");
const userModel = require("../models/User");
var AuthController = require("../Controllers/AuthController");
var socketController = require("../Controllers/socketController");
var jwt = require("jsonwebtoken");

function SocketRouter(io) {
  const router = express.Router();

  io.on("connection", (socket) => {
    console.log("conected");
    // socket.on('disconnect', () => {
    //     console.log("disconnected")
    //     connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
    //     io.emit('updateUserList', connectedUsers)
    // });

    // socket.on('loggedin', function(user) {
    //     // console.log(user);
    //     clientSocketIds.push({socket: socket, userId:  user.user_id});
    //     connectedUsers = connectedUsers.filter(item => item.user_id != user.user_id);
    //     connectedUsers.push({...user, socketId: socket.id})
    //     io.emit('updateUserList', connectedUsers)
    // });

    // socket.on('create', function(data) {
    // console.log("create room")
    // console.log(data);
    // socket.join(data.room);
    // let withSocket = getSocketByUserId(data.withUserId);
    // socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    // });
    socket.on("joinRoom", async function (data) {
      let user = "Dione";
      let password = "Dione&169";

      // console.log(code1);
      if (!data.data_authorization) {
        io.emit("error", "Please send data_authorization token");
      } else {
        let token = data.data_authorization;

        let tokenData = await jwt.verify(token, "malkari");

        if (user != tokenData.user) {
          io.emit("error", "User Not Found in data_authorization");
        } else if (password != tokenData.password) {
          io.emit("error", "data_authorization password is incorrect");
        } else {
          token, (tokenData = "");
          if (!data.user_authorization) {
            io.emit("error", "Please send user_authorization token");
          } else {
            token = data.user_authorization;

            tokenData = await jwt.verify(token, "malkari");
            // req.body.userId = tokenData.data._id;
            let currentPassword = tokenData.data.password;
            let checkUser = await userModel.findById(tokenData.data._id);
            if (!checkUser) {
              io.emit("error", "User Not Found");
            } else {
              if (checkUser.password !== currentPassword) {
                io.emit("error", "Password is changed,So login aging");
              } else {
                if (!data.match) {
                  io.emit("error", "Please match id");
                } else {
                  socket.join(data.match);
                  socket.broadcast.to(data.match);
                }
              }
            }
          }
        }
      }
    });

    socket.on("message",async function (data) {
      let user = "Dione";
      let password = "Dione&169";

      // console.log(code1);
      if (!data.data_authorization) {
        io.emit("error", "Please send data_authorization token");
      } else {
        let token = data.data_authorization;

        let tokenData = await jwt.verify(token, "malkari");

        if (user != tokenData.user) {
          io.emit("error", "User Not Found in data_authorization");
        } else if (password != tokenData.password) {
          io.emit("error", "data_authorization password is incorrect");
        } else {
          token, (tokenData = "");
          if (!data.user_authorization) {
            io.emit("error", "Please send user_authorization token");
          } else {
            token = data.user_authorization;

            tokenData = await jwt.verify(token, "malkari");
            // req.body.userId = tokenData.data._id;
            let currentPassword = tokenData.data.password;
            let checkUser = await userModel.findById(tokenData.data._id);
            if (!checkUser) {
              io.emit("error", "User Not Found");
            } else {
              if (checkUser.password !== currentPassword) {
                io.emit("error", "Password is changed,So login aging");
              } else {
                if (!data.match) {
                  io.emit("error", "Please match id");
                } else {
                  data.user = checkUser;
                  socket.broadcast.to(data.match).emit("message",data);
                }
              }
            }
          }
        }
      }
      
    });
    socket.on("rection",async function (data) {
      let user = "Dione";
      let password = "Dione&169";

      // console.log(code1);
      if (!data.data_authorization) {
        io.emit("error", "Please send data_authorization token");
      } else {
        let token = data.data_authorization;

        let tokenData = await jwt.verify(token, "malkari");

        if (user != tokenData.user) {
          io.emit("error", "User Not Found in data_authorization");
        } else if (password != tokenData.password) {
          io.emit("error", "data_authorization password is incorrect");
        } else {
          token, (tokenData = "");
          if (!data.user_authorization) {
            io.emit("error", "Please send user_authorization token");
          } else {
            token = data.user_authorization;

            tokenData = await jwt.verify(token, "malkari");
            // req.body.userId = tokenData.data._id;
            let currentPassword = tokenData.data.password;
            let checkUser = await userModel.findById(tokenData.data._id);
            if (!checkUser) {
              io.emit("error", "User Not Found");
            } else {
              if (checkUser.password !== currentPassword) {
                io.emit("error", "Password is changed,So login aging");
              } else {
                if (!data.match) {
                  io.emit("error", "Please match id");
                } else {
                  data.user = checkUser;
                  socket.broadcast.to(data.match).emit("rection",data);
                }
              }
            }
          }
        }
      }
      
    });
    // })
  });
  router.post('/', AuthController.protectGlobal, socketController.get);
  return router;
}

module.exports = SocketRouter;