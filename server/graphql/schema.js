import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Student from '../models/student.model.js';
import Course from '../models/course.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

// Student Type
const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLID },
    studentNumber: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean }
  })
});

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
      id: { type: GraphQLID },
      courseCode: { type: GraphQLString },
      courseName: { type: GraphQLString },
      section: { type: GraphQLString },
      semester: { type: GraphQLString },
      students: { type: new GraphQLList(StudentType) } 
    })
  });

  
// Query Type
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    students: {
      type: new GraphQLList(StudentType),
      resolve: async (_, __) => {
        return await Student.find();
      }
    },
    student: {
      type: StudentType,
      args: { studentNumber: { type: GraphQLString } },
      resolve: async (_, { studentNumber }, context) => {
        if (!context.auth) throw new Error("Unauthorized!");
        return await Student.findOne({ studentNumber });
      }
    },
    courses: {
        type: new GraphQLList(CourseType),
        resolve: async () => {
          return await Course.find().populate('students');
        }
      }
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    registerStudent: {
      type: StudentType,
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        const hashedPassword = bcrypt.hashSync(args.password, 10);
        const student = new Student({ ...args, hashed_password: hashedPassword });
        return await student.save();
      }
    },
    loginStudent: {
      type: GraphQLString, // Returns a JWT token
      args: {
        studentNumber: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { studentNumber, password }) => {
        const student = await Student.findOne({ studentNumber });
        if (!student || !student.authenticate(password)) throw new Error("Invalid credentials");
        return jwt.sign({ id: student._id, isAdmin: student.isAdmin }, config.jwtSecret, { expiresIn: "24h" });
      }
    }
  }
});

// Export GraphQL Schema
export default new GraphQLSchema({ query: Query, mutation: Mutation });
