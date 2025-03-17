const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR (255),
last_name VARCHAR (255),
username VARCHAR (255),
password VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS messages (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR (255),
body TEXT,
timestamp DATE,
user_id INTEGER
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

async function main() {
    console.log("seeding....");
    const client = new Client({
        connectionString: process.env.CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false,
        }
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();