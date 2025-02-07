import Course from '../models/course.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';
import authCtrl from './auth.controller.js';
import Student from '../models/student.model.js';

const create = async (req, res) => {
  try {
    const { courseCode, courseName, semester, section } = req.body;

    if (!courseCode || !courseName || !semester || !section) {
      return res.status(400).json({ message: 'All fields (courseCode, courseName, semester, section) are required.' });
    }
    // Check if the course with the same courseCode, semester, and section already exists
    const existingCourse = await Course.findOne({ courseCode, semester, section });
    if (existingCourse) {
      return res.status(400).json({ message: 'This course section already exists for the given semester.' });
    }
    // Create and save the course
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json({
      message: 'Course created successfully.',
      course,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating course.',
      error: err.message, // Improved error handling
    });
  }
};
const listAllCourse = async (req, res) => {
  try {
    const courses = await Course.find(); 
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found.' });
    }
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving courses.',
      error: err.message,
    });
  }
};

const courseByID = async (req, res, next, id) => {
  try {
    const course = await Course.findById(id).populate('students', 'firstName lastName studentNumber');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    req.course = course;
    next();
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving course.',
      error: err.message,
    });
  }
};
const read = (req, res) => {
  return res.json(req.course);
};
const register = async (req, res) => {
  console.log("student: ", req.student);
  console.log("course: ", req.course);
  try {
    const course = req.course;
    const student = req.profile;
    // Check if student is already registered
    if (course.students.includes(student._id)) {
      console.log("Student is already registered:", student.studentNumber);
      return res.status(400).json({ message: 'Student is already registered in this course.' });
    }
    course.students.push(student._id);
    await course.save();

    console.log("Student registered successfully:", student.studentNumber);
    res.status(200).json({
      message: 'Student registered successfully.',
      course,
      student,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({
      message: 'Error registering student to course.',
      error: error.message,
    });
  }
};

const listCoursesByStudent = async (req, res) => {
  try {
    const student = req.profile;

    // Find all courses where the student is registered
    const courses = await Course.find({ students: student._id });
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found for this student.' });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving courses for student.',
      error: error.message,
    });
  }
};


const dropCourse = async (req, res) => {
  try {
    const course = req.course;
    const student = req.profile;

    // Check if student is enrolled using .some()
    if (!course.students.some(s => s._id.toString() === student._id.toString())) {
      return res.status(400).json({ error: 'Student is not registered in this course.' });
    }

    // Remove student from course using .filter()
    course.students = course.students.filter(s => s._id.toString() !== student._id.toString());

    // Save the updated course
    await course.save();

    res.status(200).json({
      message: 'Student dropped from course successfully.',
      course,
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error dropping student from course.',
      error: error.message,
    });
  }
};

const changeSection = async (req, res) => {
  try {
    const oldCourse = req.course;
    const student = req.profile;
    const newSection = req.body.newSection;
    if (!newSection) {
      return res.status(400).json({ error: 'New section number is required.' });
    }
    // Find new course by matching courseCode, semester, and newSection
    const newCourse = await Course.findOne({
      courseCode: oldCourse.courseCode,
      semester: oldCourse.semester,
      section: newSection,
    });

    if (!newCourse) {
      return res.status(404).json({ error: 'New section not found for this course and semester.' });
    }

    // Check if student is already in the new section
    if (newCourse.students.includes(student._id)) {
      return res.status(400).json({ error: 'Student is already registered in the new section.' });
    }


    // Remove student from course using .filter()
    oldCourse.students = oldCourse.students.filter(s => s._id.toString() !== student._id.toString());
    await oldCourse.save();

    // Add student to new course
    newCourse.students.push(student._id);
    await newCourse.save();

    res.status(200).json({
      message: 'Student successfully changed sections.',
      oldCourse,
      newCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error changing student section.',
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    let course = req.course;
    course = extend(course, req.body);

    // Save the updated course
    await course.save();

    res.status(200).json({
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating course.',
      error: error.message,
    });
  }
};

const listUnregisteredCourses = async (req, res) => {
  try {
    const student = req.profile;

    const courses = await Course.find({ students: { $ne: student._id } });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving unregistered courses.',
      error: error.message,
    });
  }
};


export default {create, listAllCourse, read, courseByID, listCoursesByStudent,register, dropCourse, changeSection, updateCourse, listUnregisteredCourses };
