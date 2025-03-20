# Message Center Express App

## Description

This is a message center app built with Express, PostgreSQL, Tailwind, EJS, Bcrypt, PassportJS, and Express-Validator.

## Features

- Add/Send Messages
- Verification using a secret hidden within your `.env` file.
- Members list
- Ability to see messages you've sent/created.

## Features to add

- Add admin role to edit/delete messages and create roles for members.
- Add ability to edit/delete personal messages.
- Possibly integrate Websockets.

## Usage

In order to play with this app on your personal machine, you will need to do some setting up before hand.

Run `npm install` to install all necessary packages.

1. Download and get a PostgreSQL database setup on your local machine.
2. Create an `.env` file and populate it with your Database information.
3. Update the connection string within the `db/populated.js` file.

    ```js
    connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
    ```

4. Run the following command to populate your database:

    ```bash
    node db/populatedb.js
    ```

5. Now that your database is setup all you have left to do is run the server.

    ```bash
    npm run dev
    ```

From there visit `localhost:3000` and have fun!
