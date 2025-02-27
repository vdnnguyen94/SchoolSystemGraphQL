import { gql } from "@apollo/client";

export const CREATE_STUDENT = gql`
  mutation CreateStudent(
    $studentNumber: String!
    $firstName: String
    $lastName: String
    $email: String!
    $password: String!
    $address: String
    $city: String
    $phoneNumber: String
    $program: String
    $hobbies: String
    $techSkills: String
  ) {
    createStudent(
      studentNumber: $studentNumber
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      address: $address
      city: $city
      phoneNumber: $phoneNumber
      program: $program
      hobbies: $hobbies
      techSkills: $techSkills
    ) {
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
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $studentNumber: String!
    $firstName: String
    $lastName: String
    $email: String
    $address: String
    $city: String
    $phoneNumber: String
    $program: String
    $hobbies: String
    $techSkills: String
  ) {
    updateStudent(
      studentNumber: $studentNumber
      firstName: $firstName
      lastName: $lastName
      email: $email
      address: $address
      city: $city
      phoneNumber: $phoneNumber
      program: $program
      hobbies: $hobbies
      techSkills: $techSkills
    ) {
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
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($studentNumber: String!) {
    deleteStudent(studentNumber: $studentNumber) {
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
`;
