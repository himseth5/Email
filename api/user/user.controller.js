const { create, getUserByUserEmail, getAllCourses, getCourseLesson, setCourseEnroll, eventRule } = require('./user.service');
const { hashSync, genSaltSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var html_tablify = require('html-tablify');


module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    console.log(req.body);
    const salt = genSaltSync(10);
    body.user_password = hashSync(body.user_password, salt);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error'
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
        message: 'Database Connected'
      });
    })
  },

  login: (req, res, callback) => {
    const body = req.body;

    getUserByUserEmail(body.email, (err, results) => {


      if (err) {
        console.log(err);
      }

      if (!results) {
        return res.status(400).json({
          success: 0,
          data: "Invalid email"
        });
      }

      if (results) {

        bcrypt.compare(body.password, results.user_password).then((result) => {
          if (result) {
            results.password = undefined;
            const jsontoken = sign({ result: results }, "qwe1234", {
              expiresIn: "10m"
            });
            return res.status(200).json({
              success: true,
              message: "authentication successful",
              token: jsontoken,
              userId: results.user_id,
              firstName: results.user_firstName,
              lastName: results.user_lastName,
              email: results.user_email
            });
            // do stuff
          } else {
            return res.status(400).json({
              success: false,
              message: "authentication failed"

            });
            // do other stuff
          }
        }).catch((err) => console.error(err));
      }

    });
  },

  allCourses: (req, res) => {
	  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'email.dev1988@gmail.com',
        pass: 'Supriya@2021'
      }
    });


    var quizArray = req.body.survey_data;
    var htmlTable = '';
    htmlTable += '<h1>';
    htmlTable += 'Clinical Survey';
    htmlTable += '</h1>';
    for (let index = 0; index < quizArray.length; index++) {
      const element = quizArray[index];
      htmlTable += '<h3>';
      htmlTable += 'Ques' + quizArray[index].QuestionNo + ':' + ' ';
      htmlTable += quizArray[index].Question;
      htmlTable += '</h3>';
      htmlTable += '<h3>';
      htmlTable += 'Ans'+  ':';
      htmlTable += '</h3>';
      for (let j = 0; j < quizArray[index].Answer.length; j++) {
        const answers = quizArray[index].Answer[j];
        htmlTable += '<h4>';
        htmlTable +=   [j + 1] + ')' + ' ';
        htmlTable += quizArray[index].Answer[j];
        htmlTable += '</h4>';
      }
     
    }
    htmlTable += '<br>';
    htmlTable += '<h4>';
    htmlTable +=  'With Best Regards,';
    htmlTable += '<br>';
    htmlTable += 'Team Clinical Survey';
    htmlTable += '</h4>';
    console.log(htmlTable,'htmlTable');
    var mailOptions = {
      from: 'email.dev1988@gmail.com',
      to: req.body.email.username,
      subject: `Clinical Survey`,
      html: htmlTable
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return;
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          response: info.response,
        });
      }
    });
  
  },

  courseLessons: (req, res) => {
    const body = req.body;
    getCourseLesson(body.courseId, body.flag, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(400)({
          success: 0,
          message: "Record not Found"
        });
      }
      return res.status(200).json({

        section: results[0],
        lesson: results[1]

      });
    });
  },

  courseEnroll: (req, res) => {
    const body = req.body;
    console.log(body);
    setCourseEnroll(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(400)({
          success: 0,
          message: "Record not Found"
        });
      }
      return res.status(200).json({
        data: results,
        message: 'Successfully Enrolled',
      });
    });
  },

  eventRules: (req, res) => {

    console.log("body");
    eventRule((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(400)({
          success: 0,
          message: "Record not Found"
        });
      }
      return res.json({
        rules_data: results,

      });
    });
  }
}