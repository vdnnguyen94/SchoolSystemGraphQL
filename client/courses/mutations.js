import { gql } from "@apollo/client";

export const REGISTER_COURSE = gql`
  mutation RegisterStudentToCourse($studentNumber: String!, $courseId: ID!) {
    registerStudentToCourse(
      studentNumber: $studentNumber
      courseId: $courseId
    ) {
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

export const DROP_COURSE = gql`
  mutation DropStudentFromCourse($studentNumber: String!, $courseId: ID!) {
    dropStudentFromCourse(studentNumber: $studentNumber, courseId: $courseId) {
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

export const CHANGE_COURSE_SECTION = gql`
  mutation ChangeStudentSection(
    $studentNumber: String!
    $oldCourseId: ID!
    $newCourseId: ID!
  ) {
    changeStudentSection(
      studentNumber: $studentNumber
      oldCourseId: $oldCourseId
      newCourseId: $newCourseId
    ) {
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

export const CREATE_COURSE = gql`
  mutation CreateCourse(
    $courseCode: String!
    $courseName: String!
    $section: String!
    $semester: String!
  ) {
    createCourse(
      courseCode: $courseCode
      courseName: $courseName
      section: $section
      semester: $semester
    ) {
      id
      courseCode
      courseName
      section
      semester
    }
  }
`;
