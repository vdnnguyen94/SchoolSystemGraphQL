import Student from '../models/student.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
  console.log(req.body);
  const student = new Student(req.body);
  try {
    await student.save();
    return res.status(200).json({
      message: 'Successfully signed up!',
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.studentNumber) {
      return res.status(400).json({
        error: 'Student number is already taken.',
      });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({
        error: 'Email is already taken.',
      });
    } else {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
};

const list = async (req, res) => {
  try {
    let students = await Student.find().select(
      'studentNumber firstName lastName email address city phoneNumber program hobbies techSkills isAdmin'
    );
    res.json(students);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const studentByStudentNumber = async (req, res, next, studentNumber) => {
  try {
    console.log(`Searching for student with studentNumber: ${studentNumber}`);

    let student = await Student.findOne({ studentNumber: studentNumber });
    if (!student) {
      console.log("Student not found in database.");
      return res.status(404).json({ error: "Student not found" });
    }

    console.log("Student found:", student);
    req.profile = student;
    next();
  } catch (err) {
    console.error("Error retrieving student:", err);
    return res.status(400).json({ error: "Could not retrieve student" });
  }
};


const read = (req, res) => {
  // if (!req.profile) {
  //   return res.status(400).json({ error: "READ Student profile not found" });
  // }

  // console.log("READReturning student profile:", req.profile);
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let student = req.profile;
    student = extend(student, req.body);
    student.updated = Date.now();
    await student.save();
    student.hashed_password = undefined;
    student.salt = undefined;
    res.json({
      message: 'Your Account is Updated Successfully',
      student,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let student = req.profile;
    let deletedStudent = await student.deleteOne();
    deletedStudent.hashed_password = undefined;
    deletedStudent.salt = undefined;
    res.json({
      message: 'Your Account has been successfully removed',
      student: deletedStudent,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;
    const student = req.profile;

    if (!student.authenticate(oldPassword)) {
      return res.status(401).json({
        error: "Incorrect old password",
      });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: "New password and confirmation do not match." });
    }
    student.password = newPassword;
    student.updated = Date.now();

    await student.save();

    student.hashed_password = undefined;
    student.salt = undefined;

    res.json({ message: "Password updated successfully.", student });

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    const { studentNumber, email, newPassword, newPasswordConfirm } = req.body;

    const student = await Student.findOne({ studentNumber, email });
    if (!student) {
      return res.status(401).json({ error: "Student number and email do not match." });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: "New password and confirmation do not match." });
    }

    student.password = newPassword;
    student.updated = Date.now();
    await student.save();

    student.hashed_password = undefined;
    student.salt = undefined;

    res.json({ message: "Password reset successfully.", student });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { studentNumber, currentPassword, newPassword, newPasswordConfirm } = req.body;
    const student = req.profile;

    if (!student || !student.authenticate(currentPassword)) {
      return res.status(401).json({ error: 'Invalid details! Password change request denied.' });
    }

    student.password = newPassword;
    student.updated = Date.now();

    await student.save();

    student.hashed_password = undefined;
    student.salt = undefined;

    res.json({ message: 'Password has been changed successfully.', student });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.json({ error: 'Email is already taken.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const checkStudentNumber = async (req, res) => {
  const { studentNumber } = req.params;

  try {
    const existingStudent = await Student.findOne({ studentNumber });

    if (existingStudent) {
      return res.json({ error: 'Student number is already taken.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const pass = async (req, res, next, id) => {
  try {
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve student',
    });
  }
};



export default { create, studentByStudentNumber, read, list, remove, update, updatePassword, resetPassword, changePassword, checkEmail, checkStudentNumber, pass };
