# Task 5: Database Integration REST API

## Project Description
This project integrates a REST API built with Node.js and Express with a MySQL database. It stores and manages user information, including name, email, and age.

## Technologies Used
- Node.js
- Express.js
- MySQL
- mysql2
- Postman

## Features
- Connects the REST API to a MySQL database.
- Retrieves all users.
- Retrieves a specific user by ID.
- Creates a new user.
- Creates multiple users in one request.
- Updates existing user details.
- Deletes users.
- Validates user input.
- Stores user information persistently in MySQL.

## Project Structure

```text
task5-database-integration/
├── db.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Database Configuration

Database name: `task5_users_db`

Table name: `users`

The table contains the following columns:

| Column | Description |
|---|---|
| id | Unique user ID |
| name | User's name |
| email | User's email address |
| age | User's age |

## Installation

Install the required dependencies:

```bash
npm install express mysql2
```

Configure the MySQL connection in `db.js` using your local database credentials.

**Security:** Do not upload your actual MySQL password to a public GitHub repository.

## Running the Application

Start the server:

```bash
node server.js
```

The API runs at:

`http://localhost:3000`

## API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/users` | Retrieve all users |
| GET | `/users/:id` | Retrieve a user by ID |
| POST | `/users` | Create a user |
| POST | `/users/bulk` | Create multiple users |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

## Testing

The API endpoints can be tested using Postman.

For POST and PUT requests, select **Body → raw → JSON** and provide the required user information.

Example request:

```json
{
  "name": "Ravi",
  "email": "ravi@example.com",
  "age": 25
}
```

## Verify Database Records

Run the following SQL commands to view the stored users:

```sql
USE task5_users_db;
SELECT * FROM users;
```

User records created through the API are stored in MySQL.

## Learning Outcomes

- Learned how to connect Node.js applications to MySQL.
- Practiced creating REST API endpoints using Express.
- Learned to perform SQL INSERT, SELECT, UPDATE, and DELETE operations.
- Tested API requests using Postman.
- Practiced input validation and error handling.

## Conclusion

This project demonstrates database integration with a REST API using Node.js, Express, and MySQL. It provides basic CRUD operations for managing user information.