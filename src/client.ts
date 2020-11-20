import fetch from "node-fetch";
// import { serverPort } from "./config";
const serverPort = 7777; // @refactor - future refactor

const GQL_GET_FRUITS = `{
  allFruits {
    edges {
      node {
        name
      }
    }
  }
}`;

export const getFruits = () =>
  fetch(`http://localhost:${serverPort}/graphql`, {
    method: "post",
    headers: {
      type: "application/json",
    },
    body: JSON.stringify({ query: GQL_GET_FRUITS, variables: {} }),
  });

export const getFruitById = (id: number) =>
  fetch(`http://localhost:${serverPort}/fruits/${id}`);
