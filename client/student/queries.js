import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
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
      courses {
        id
        courseCode
        courseName
        section
        semester
      }
    }
  }
`;

export const GET_STUDENT_BY_NUMBER = gql`
  query GetStudentByNumber($studentNumber: String!) {
    student(studentNumber: $studentNumber) {
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
      courses {
        id
        courseCode
        courseName
        section
        semester
      }
    }
  }
`;
