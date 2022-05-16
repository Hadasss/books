import { gql } from "@apollo/client";

// TODO
// queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        description
        image
        link
        title
      }
    }
  }
`;
