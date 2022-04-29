const { createUser, login, allCourses, courseLessons, courseEnroll, eventRules } = require('./user.controller');
const router = require('express').Router();

router.post("/registration", createUser);
router.post("/login", login);
router.post("/allCourses", allCourses);
router.post("/lessons", courseLessons);
router.post("/courseEnroll", courseEnroll);
router.post("/rules", eventRules);

module.exports = router;

