const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("../../strategies/jsonwtStrategy")(passport);

//Load person model
const Person = require("../../models/Person");

//Load profile model
const Profile = require("../../models/Profile");

//Load Question model
const Question = require("../../models/Question");

//@type  GET
//@route    /api/questions
// @desc    route for getting  questions
// @access  PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort("-date")
    .then(questions => res.json(questions))
    .catch(err => res.json({ noquestions: "No questions to display" }));
});

//@type  POST
//@route    /api/questions/newQuestion
// @desc    route for submitting question
// @access  PRIVATE

router.post(
  "/newQuestion",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("unable to post question" + err));
  }
);

//@type  DELETE
//@route    /api/questions/:id
// @desc    route for deleting question
// @access  PRIVATE

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.find({ _id: req.params.id })
      .remove()
      .then(res.send({ sucess: "Delete Suceess" }))
      .catch(err => console.log(err));
  }
);


//@type - DELETE
//@route -  /api/questions/deleteAll
//@desc - route for deleting all question of a user
//@access - PRIVATE
router.delete(
  "/deleteAll",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user.id);
    Question.find({ user: req.user.id }).deleteMany(() => {
      return res.json({ Deleted_all: "Succesfully deleted!" });
    });
  }
);

//@type  POST
//@route    /api/questions/answers/:id
// @desc    route for submitting answers to questions
// @access  PRIVATE
router.post(
  "/postAnswer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.body.id,
          name: req.body.name,
          text: req.body.text
        };
        question.answers.unshift(newAnswer);
        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type  POST
//@route    /api/questions/upvote/:_id
// @desc    route for upvoting/unvoting
// @access  PRIVATE
router.post(
  "/upvote/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params._id)
          .then(question => {
            if (
              //checking if the user who upvoted is in array or not
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              //if he is found in array we will remove him or unvote hi
              question.upvotes.pop({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            } else {
              //else if someone is not there we will allow him to upvote
              question.upvotes.unshift({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
