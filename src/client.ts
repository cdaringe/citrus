import nodeFetch from "node-fetch";
import { Config } from "./config";

export const createClient = ({ serverPort }: Config, fetch = nodeFetch) => {
  const GQL_GET_FRUITS = `{
    allFruits {
      edges {
        node {
          name
        }
      }
    }
  }`;
  const getFruits = () =>
    fetch(`http://localhost:${serverPort}/graphql`, {
      method: "post",
      headers: {
        type: "application/json",
      },
      body: JSON.stringify({ query: GQL_GET_FRUITS, variables: {} }),
    });

  const getFruitById = (id: number) =>
    fetch(`http://localhost:${serverPort}/fruits/${id}`);

  return {
    getFruits,
    getFruitById,
  };
};

export type Client = ReturnType<typeof createClient>;
