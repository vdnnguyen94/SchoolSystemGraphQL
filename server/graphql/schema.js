import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
} from "graphql";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
 
// Student Type
const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    id: { type: GraphQLID },
    studentNumber: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    program: { type: GraphQLString },
    hobbies: { type: GraphQLString },
    techSkills: { type: GraphQLString },
    created: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
    updated: { type: GraphQLString },
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        console.log("Fetching courses for student ID:", parent.id); // Debugging log
        return Course.find({ students: parent.id })
          .then((courses) => {
            console.log("Fetched courses:", courses); // Debugging log
            return courses;
          })
          .catch((err) => {
            console.error("Error fetching courses:", err); // Error log
            throw err;
          });
      },
    },
  }),
});
 
// Course Type
const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    courseCode: { type: GraphQLString },
    courseName: { type: GraphQLString },
    section: { type: GraphQLString },
    semester: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),
      resolve(parent, args) {
        console.log("Fetching students for course:", parent.id); // Debugging log
        return Student.find({ _id: { $in: parent.students } })
          .then((students) => {
            console.log("Fetched students:", students); // Debugging log
            return students;
          })
          .catch((err) => {
            console.error("Error fetching students:", err); // Error log
            throw err;
          });
      },
    },
  }),
});
 
// Query Type
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    // Get all students
    students: {
      type: new GraphQLList(StudentType),
      resolve: async () => {
        return await Student.find();
      },
    },
    // Get a single student by studentNumber
    student: {
      type: StudentType,
      args: { studentNumber: { type: GraphQLString } },
      resolve: async (_, { studentNumber }) => {
        return await Student.findOne({ studentNumber });
      },
    },
    // Get all courses
    courses: {
      type: new GraphQLList(CourseType),
      resolve: async () => {
        return await Course.find().populate("students");
      },
    },
    // Get a single course by ID
    course: {
      type: CourseType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        return await Course.findById(id).populate("students");
      },
    },
    // Get courses for a specific student
    coursesByStudent: {
      type: new GraphQLList(CourseType),
      args: { studentNumber: { type: GraphQLString } },
      resolve: async (_, { studentNumber }) => {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error("Student not found");
        return await Course.find({ students: student._id }).populate(
          "students"
        );
      },
    },
    // Get unregistered courses for a specific student
    unregisteredCourses: {
      type: new GraphQLList(CourseType),
      args: { studentNumber: { type: GraphQLString } },
      resolve: async (_, { studentNumber }) => {
        const student = await Student.findOne({ studentNumber });
        if (!student) throw new Error("Student not found");
        return await Course.find({ students: { $ne: student._id } }).populate(
          "students"
        );
      },
    },
  },
});
 
// Mutation Type
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Create a new student
    createStudent: {
      type: StudentType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        program: { type: GraphQLString },
        hobbies: { type: GraphQLString },
        techSkills: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const hashedPassword = bcrypt.hashSync(args.password, 10);
        const student = new Student({
          ...args,
          hashed_password: hashedPassword,
        });
        return await student.save();
      },
    },
    // Update a student's details
    updateStudent: {
      type: StudentType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        program: { type: GraphQLString },
        hobbies: { type: GraphQLString },
        techSkills: { type: GraphQLString },
      },
      resolve: async (_, { studentNumber, ...updates }) => {
        const student = await Student.findOneAndUpdate(
          { studentNumber },
          { $set: updates },
          { new: true }
        );
        if (!student) throw new Error("Student not found");
        return student;
      },
    },
    // Delete a student
    deleteStudent: {
      type: StudentType,
      args: { studentNumber: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { studentNumber }) => {
        const student = await Student.findOneAndDelete({ studentNumber });
        if (!student) throw new Error("Student not found");
        return student;
      },
    },
    // Register a student to a course
    registerStudentToCourse: {
      type: CourseType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        courseId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { studentNumber, courseId }) => {
        const student = await Student.findOne({ studentNumber });
        const course = await Course.findById(courseId);
        if (!student || !course) throw new Error("Student or Course not found");
        if (course.students.includes(student._id)) {
          throw new Error("Student is already registered in this course");
        }
        course.students.push(student._id);
        await course.save();
        return course;
      },
    },
    // Drop a student from a course
    dropStudentFromCourse: {
      type: CourseType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        courseId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { studentNumber, courseId }) => {
        const student = await Student.findOne({ studentNumber });
        const course = await Course.findById(courseId);
        if (!student || !course) throw new Error("Student or Course not found");
        course.students = course.students.filter(
          (s) => s.toString() !== student._id.toString()
        );
        await course.save();
        return course;
      },
    },
    // Change a student's course section
    changeStudentSection: {
      type: CourseType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        oldCourseId: { type: new GraphQLNonNull(GraphQLID) },
        newCourseId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { studentNumber, oldCourseId, newCourseId }) => {
        const student = await Student.findOne({ studentNumber });
        const oldCourse = await Course.findById(oldCourseId);
        const newCourse = await Course.findById(newCourseId);
        if (!student || !oldCourse || !newCourse)
          throw new Error("Student or Course not found");
        oldCourse.students = oldCourse.students.filter(
          (s) => s.toString() !== student._id.toString()
        );
        await oldCourse.save();
        newCourse.students.push(student._id);
        await newCourse.save();
        return newCourse;
      },
    },
  },
});
 
// Export GraphQL Schema
export default new GraphQLSchema({ query: Query, mutation: Mutation });
