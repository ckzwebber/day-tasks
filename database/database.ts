import { Client } from "pg";
import { databaseConfig, QueryConfig } from "../types/database";
import dotenv from "dotenv";
dotenv.config();

const config: databaseConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl: true,
};

const query = async (queryObject: QueryConfig) => {
  let client: Client | undefined;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
};

const getNewClient = async (): Promise<Client> => {
  const client = new Client(config);
  await client.connect();
  return client;
};

const database = {
  query,
  getNewClient,
};

export default database;
