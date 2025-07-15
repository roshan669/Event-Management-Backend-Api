* Event Management REST API
  *** Objective
  This project is a beginner-friendly implementation of a RESTful API for managing events. It allows users to create, register for, and manage events, while also providing statistics and a list of upcoming events.

** Technologies Used
**** Node.js: JavaScript runtime environment.

**** Express.js: Web application framework for Node.js.

**** PostgreSQL: Robust relational database for storing event and user data.

**** Drizzle ORM: TypeScript/JavaScript ORM for interacting with the PostgreSQL database.

**** Nodemon: For automatic server restarts during development.

** Setup Instructions
**** Follow these steps to get the project up and running on your local machine.

** Prerequisites
**** Make sure you have the following installed:

Node.js (LTS version recommended)

npm (Node Package Manager, comes with Node.js) or Yarn

**** PostgreSQL database server

1. Clone the Repository
   First, clone this repository to your local machine:

git clone <your-repository-url>
cd event-management-api

2. Install Dependencies
   Navigate into the project directory and install the required npm packages:

npm install

# Or if you use Yarn:

# yarn install

3. Environment Variables
   Create a .env file in the root of your project and add your PostgreSQL database connection string.

DATABASE_URL="postgresql://username:password@host:port/database_name"
PORT=8000 # Or any port you prefer for your API

Replace username, password, host, port, and database_name with your actual PostgreSQL database credentials.

4. Database Setup (Drizzle Kit)
   Drizzle Kit helps you manage your database schema and migrations.

Push Schema to Database: This command will create the tables (users, events, registrations) in your PostgreSQL database based on your Drizzle schema definitions.

npx drizzle-kit push

If this runs successfully, your database is set up!

5. Running the Application
   To start the API server:

npm start

# Or using Nodemon for development (recommended, it will restart on code changes):

# npm run dev

The API will now be running, typically on http://localhost:8000 (or the PORT you specified in your .env file).

API Description
Here's a detailed overview of the available API endpoints. All requests and responses are in JSON format.

a. Create Event
URL: /api/v1/events

Method: POST

Description: Creates a new event.

Request Body:

{
"title": "Annual Tech Conference",
"datetime": "2025-08-15T09:00:00Z",
"location": "Convention Center",
"capacity": 500
}

title (string, required)

datetime (string, required, ISO format e.g., "YYYY-MM-DDTHH:mm:ssZ")

location (string, required)

capacity (number, required, positive integer, max 1000)

Success Response (Status: 201 Created):

{
"statusCode": 201,
"data": {
"eventId": 1
},
"message": "Event created successfully."
}

Error Responses (Examples):

400 Bad Request: If required fields are missing or capacity / datetime format is invalid.

500 Internal Server Error: If a database error occurs.

b. Get Event Details
URL: /api/v1/events/details

Method: GET

Description: Retrieves details for a specific event, including a list of all registered users.

Query Parameters:

eventId (number, required): The unique ID of the event. Example: /api/v1/events/details?eventId=1

Success Response (Status: 200 OK):

{
"statusCode": 200,
"data": {
"event": {
"id": 1,
"title": "Annual Tech Conference",
"datetime": "2025-08-15T09:00:00Z",
"location": "Convention Center",
"capacity": 500,
"createdAt": "2025-07-15T14:00:00Z",
"updatedAt": null
},
"registeredUsers": [
{
"id": 101,
"name": "Alice Wonderland",
"email": "alice@example.com",
"registeredAt": "2025-07-15T15:30:00Z"
},
{
"id": 102,
"name": "Bob The Builder",
"email": "bob@example.com",
"registeredAt": "2025-07-16T10:00:00Z"
}
]
},
"message": "Event details fetched successfully."
}

Error Responses:

404 Not Found: If the event with the given eventId does not exist.

400 Bad Request: If eventId is invalid.

c. Register for Event
URL: /api/v1/events/register

Method: POST

Description: Registers a user for a specific event.

Request Body:

{
"userId": 101,
"eventId": 1
}

userId (number, required): The ID of the user.

eventId (number, required): The ID of the event.

Success Response (Status: 201 Created):

{
"statusCode": 201,
"data": {
"message": "Successfully registered for the event."
},
"message": "Registration successful."
}

Error Responses:

400 Bad Request: If userId or eventId are missing or invalid.

404 Not Found: If the event or user does not exist.

403 Forbidden: If trying to register for a past event or if event capacity is full.

409 Conflict: If the user is already registered for this event (duplicate registration).

500 Internal Server Error: If a database error occurs.

d. Cancel Registration
URL: /api/v1/events/cancel-registration

Method: POST

Description: Cancels a user's registration for an event.

Request Body:

{
"userId": 101,
"eventId": 1
}

userId (number, required): The ID of the user.

eventId (number, required): The ID of the event.

Success Response (Status: 200 OK):

{
"statusCode": 200,
"data": {
"userId": 101,
"eventId": 1
},
"message": "Registration cancelled successfully."
}

Error Responses:

400 Bad Request: If userId or eventId are missing or invalid.

404 Not Found: If the event or user does not exist, or if the registration itself is not found.

403 Forbidden: If trying to cancel registration for a past event.

500 Internal Server Error: If a database error occurs.

e. List Upcoming Events
URL: /api/v1/events/upcoming

Method: GET

Description: Returns a list of all future events, sorted by date (ascending) then by location (alphabetically).

Success Response (Status: 200 OK):

{
"statusCode": 200,
"data": [
{
"id": 2,
"title": "Web Dev Workshop",
"datetime": "2025-08-20T14:00:00Z",
"location": "Online",
"capacity": 200,
"createdAt": "2025-07-16T08:00:00Z",
"updatedAt": null
},
{
"id": 1,
"title": "Annual Tech Conference",
"datetime": "2025-08-15T09:00:00Z",
"location": "Convention Center",
"capacity": 500,
"createdAt": "2025-07-15T14:00:00Z",
"updatedAt": null
}
],
"message": "Successfully fetched upcoming events."
}

Returns an empty array ([]) in data if no upcoming events are found.

Error Responses:

500 Internal Server Error: If a database error occurs.

f. Event Stats
URL: /api/v1/events/stats

Method: GET

Description: Returns registration statistics for a specific event.

Query Parameters:

eventId (number, required): The unique ID of the event. Example: /api/v1/events/stats?eventId=1

Success Response (Status: 200 OK):

{
"statusCode": 200,
"data": {
"eventId": 1,
"eventTitle": "Annual Tech Conference",
"totalRegistrations": 50,
"remainingCapacity": 450,
"percentageCapacityUsed": 10
},
"message": "Event statistics fetched successfully."
}

Error Responses:

400 Bad Request: If eventId query parameter is missing or invalid.

404 Not Found: If the event with the given eventId does not exist.

500 Internal Server Error: If a database error occurs.

The API enforces the following rules:

Registration Limits: Capacity limits are enforced for each event.

Prevent Double Registration: Users cannot register for the same event more than once.

Disallow Past Event Operations: Users cannot register for or cancel registration for events that have already occurred.

Clear Feedback: All API calls provide appropriate HTTP status codes and detailed messages for success and failure scenarios.

Input Validation: All incoming data is rigorously validated to ensure data integrity and prevent errors.
