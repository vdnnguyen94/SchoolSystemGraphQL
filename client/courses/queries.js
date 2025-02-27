import { gql } from "@apollo/client";

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      courseCode
      courseName
      section
      semester
      students {
        id
        studentNumber
        firstName
        lastName
        email
        address
        city
        phoneNumber
        program
        hobbies
        techSkills
        created
        isAdmin
        updated
      }
    }
  }
`;

export const GET_UNREGISTERED_COURSES = gql`
  query GetUnregisteredCourses($studentNumber: String!) {
    unregisteredCourses(studentNumber: $studentNumber) {
      id
      courseCode
      courseName
      section
      semester
      students {
        id
        studentNumber
        firstName
        lastName
        email
        address
        city
        phoneNumber
        program
        hobbies
        techSkills
        created
        isAdmin
        updated
      }
    }
  }
`;

export const GET_COURSES_BY_STUDENT = gql`
  query GetCoursesByStudent($studentNumber: String!) {
    coursesByStudent(studentNumber: $studentNumber) {
      id
      courseCode
      courseName
      section
      semester
      students {
        id
        studentNumber
        firstName
        lastName
        email
        address
        city
        phoneNumber
        program
        hobbies
        techSkills
        created
        isAdmin
        updated
      }
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($id: ID!) {
    course(id: $id) {
      id
      courseCode
      courseName
      section
      semester
      students {
        id
        studentNumber
        firstName
        lastName
        email
        address
        city
        phoneNumber
        program
        hobbies
        techSkills
        created
        isAdmin
        updated
      }
    }
  }
`;
