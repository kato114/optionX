import { createConnection } from "mysql";

import { DB_CONFIG } from "../config/database.js";

// Create a connection to the database
const connection = createConnection(DB_CONFIG);

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default connection;
