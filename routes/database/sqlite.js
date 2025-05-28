import { open } from "sqlite";
import sqlite3 from "sqlite3";

import path from "path";

import { fileURLToPath } from "url";

// Equivalent to __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbpath = path.join(__dirname, "todoApplication.db");

let dbInstance = null;

export const getDb = () => dbInstance;

const installDatabase = async () => {
  try {
    dbInstance = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default installDatabase;
