const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

//bringing all routes
const auth = require("./routes/api/auth");
const questions = require("./routes/api/questions");
const profile = require("./routes/api/profile");

const app = express();

//middleware for bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//mongoDB configuration
const db = require("./setup/myurl").mongoURL;

//attempt to connect database
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(console.log("mongodb connected successfully...."))
  .catch(err => console.log(err));

//passport middleware
app.use;

//just for testing -> routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

//actual routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", questions);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
