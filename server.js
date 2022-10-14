const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const { Socket } = require("socket.io");
const app = express();

mongoose
  .connect(
    "mongodb+srv://dione_apps:Dione&169@cluster0.5yxff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log("DB connected established"))
  .catch((err) => console.log("DB connection error: ", err));

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let socketRequire = require("./routes/socket")(io);
// socket connection
app.use("/player", require("./routes/Player"));
app.use("/group", require("./routes/Group"));
app.use("/cup", require("./routes/Cup"));
app.use("/team", require("./routes/Team"));
app.use("/match", require("./routes/Match"));
app.use("/user", require("./routes/User"));
app.use("/colors", require("./routes/Colors"));
app.use("/rules", require("./routes/Rules"));
app.use("/leaderboard", require("./routes/Leaderboard"));
app.use("/", socketRequire);``
// app.use("/", require("./routes/home"));
 
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});
// io.on("connection", (socket) => {
//     console.log(socket.id);
// });
server.listen(3002);