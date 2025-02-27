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
 
const jwtExpirySeconds = 86400; 

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
    // Check if login
    isLoggedIn: {
      type: GraphQLBoolean,
      resolve: (root, args, context) => {
        //console.log("Cookie Token: ", context.req.cookies);
        console.log("Debug: context.user is", context.user);
        return !!context.user; //No need to check if token
      },
    },
    isAdmin: {
      type: GraphQLBoolean,
      resolve: (root, args, context) => {
        return context.user?.isAdmin || false; 
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
        isAdmin: { type: GraphQLBoolean }, 
      },
      resolve: async (_, args) => {
        const student = new Student({
          studentNumber: args.studentNumber,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          address: args.address,
          city: args.city,
          phoneNumber: args.phoneNumber,
          program: args.program,
          hobbies: args.hobbies,
          techSkills: args.techSkills,
          isAdmin: args.isAdmin === true ? true : undefined,
        });
    
        student.password = args.password;
    
        return await student.save();
      }
    },
    logIn: {
      type: GraphQLBoolean,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { studentNumber, password }, context) => {
        const student = await Student.findOne({ studentNumber });
        if (!student) {
          throw new Error("Student not found");
        }

        if (!student.authenticate(password)) {
          throw new Error("Invalid password");
        }
        //console.log("Debug: context.res is", context.res);
        console.log(`Signing IN ${studentNumber} with ${password}`);
        //console.log(`config jwtSecret ${config.jwtSecret}`);
        const token = jwt.sign(
          { _id: student._id, isAdmin: student.isAdmin || false }, 
          config.jwtSecret,
          { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
        );
        console.log('Generated token:', token);
        // Store token in an HTTP-only cookie
        if (!context.res) {
          throw new Error("Response object is missing in context");
        }
        context.res.cookie("SchoolSystem", token, {
          maxAge: 4 * 60 * 60 * 1000, // 24 hours
          httpOnly: true,
          path: "/"
        });
        console.log("COOKIE SET");
        //console.log("Debug: Reading cookie after setting it:", context.req.cookies);
        return true;
      },
    },

    logOut: {
      type: GraphQLString,
      resolve: (parent, args, context) => {
        context.res.clearCookie("SchoolSystem"); // ✅ Clears authentication cookie
        return "Logged out successfully!";
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
