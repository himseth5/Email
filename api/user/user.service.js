// const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into user_master(user_firstName, user_lastName, user_email, user_password) 
                values(?,?,?,?)`,
      [
        data.user_firstName,
        data.user_lastName,
        data.user_email,
        data.user_password
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from user_master where user_email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },


  getAllCourses: (userId, callBack) => {

    // if (userId == 0) {
      // var sql = "SELECT * FROM edutatva.courses";
    // } else {
      // var sql = "SELECT * FROM edutatva.courses; SELECT user_id_fk, course_id, lesson_count, isFree, isActive FROM edutatva.user_course_mapping where user_id_fk = ?";
    // }
	
	let sql = {
      interests: 1,
      question: 2,
    };
	return callBack(null, sql);
    // pool.query(sql, [userId], function (error, results, fields) {
      // if (error) {
        // return callBack(error);
      // }

      // return callBack(null, results);
    // }
    // );
  },

  getCourseLesson: (courseId, flag, callBack) => {
    console.log(flag);

    if (flag == 1) {
      var sql = "SELECT * FROM edutatva.courses_section where courses_id_fk = ?; SELECT cl_id, courses_id_fk, section_id_fk, lesson_data, is_active, start_date,end_time,lesson_name FROM edutatva.courses_lessons where courses_id_fk = ?";
    } else {
      var sql = "SELECT * FROM edutatva.courses_section where courses_id_fk = ?; SELECT cl_id, courses_id_fk, section_id_fk,lesson_name FROM edutatva.courses_lessons where courses_id_fk = ?";

    }
	
    pool.query(sql, [courseId, courseId], function (error, results, fields) {
      if (error) {
        return callBack(error);
      }
      console.log(results);
      return callBack(null, results);
    }
    );
  },

  setCourseEnroll: (data, callBack) => {
    pool.query(
      `insert into user_course_mapping(user_id_fk, course_id, lesson_count, isFree) 
                values(?,?,?,?)`,
      [
        data.user_id,
        data.course_id,
        data.lesson_count,
        data.isFree
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  eventRule: (callBack) => {
    pool.query(
      `SELECT *
      FROM event_rules er
      LEFT JOIN rules_struct_normal rsn ON er.rule_id = rsn.rule_id and er.rule_struct_type = rsn.rule_struct_type
      where er.rule_struct_type = 1 AND rsn.rule_struct_type= 1;
      
      SELECT *
      FROM event_rules er
      LEFT JOIN rules_struct_complex rsc ON er.rule_id = rsc.rule_id and er.rule_struct_type = rsc.rule_struct_type
      where er.rule_struct_type = 2 AND rsc.rule_struct_type= 2
      `,

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

};
