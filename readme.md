# Event Management REST API

## Objective

This project is a beginner-friendly implementation of a RESTful API for managing events. It allows users to create, register for, and manage events, while also providing statistics and a list of upcoming events.

## Technologies Used

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **PostgreSQL:** Robust relational database for storing event and user data.
* **Drizzle ORM:** TypeScript/JavaScript ORM for interacting with the PostgreSQL database.
* **Nodemon:** For automatic server restarts during development.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager, comes with Node.js) or **Yarn**
* **PostgreSQL** database server

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/roshan669/Event-Management-Backend-Api
cd Event-Management-Backend-Api
```

### 2. Install Dependencies

```bash
npm install
# Or if you use Yarn:
# yarn install
```
### 3. Database Setup (Drizzle Kit)
```bash
npx drizzle-kit push
```
### 4. Running the Application
```bash
npm start
#or with nodemon:
#npm run dev
```
## Api Description
### a. Create Event
URL: /api/v1/events/create

Method: POST

Description: Creates a new event.
Request Body:

``` JSON
{
  "title": "Annual Tech Conference",
  "datetime": "2025-08-15T09:00:00Z",
  "location": "Convention Center",
  "capacity": 500
}
```
### b. Get Event Details
URL: /api/v1/events/details

Method: GET

Description: Retrieves details for a specific event, including a list of all registered users.

Query Param: api/v1/events/details?eventIs=1

### c. Register as user
URL: /api/v1/users/create

Method: POST

Description: Registers a user.

Request Body:

```JSON

{
  "email": "cody@email.com",
  "name": "cody"
}
```
email (string, required): The email of the user.

name (string, required): The name of the event.

### c. Register for Event
URL: /api/v1/events/register

Method: POST

Description: Registers a user for a specific event.

Request Body:

```JSON

{
  "userId": 101,
  "eventId": 1
}
```
userId (number, required): The ID of the user.

eventId (number, required): The ID of the event.

### d. Cancel Registration
URL: /api/v1/users/cancelregistration

Method: POST

Description: Cancels a user's registration for an event.

Request Body:

``` JSON

{
  "userId": 101,
  "eventId": 1
}
```
userId (number, required): The ID of the user.

eventId (number, required): The ID of the event.

### e. List Upcoming Events
URL: /api/v1/events/upcoming

Method: GET

Description: Returns a list of all future events, sorted by date (ascending) then by location (alphabetically).

Success Response (Status: 200 OK):

``` JSON

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
```
Returns an empty array ([]) in data if no upcoming events are found.

### f. Event Stats
URL: /api/v1/events/stats

Method: GET

Description: Returns registration statistics for a specific event.

Query Parameters:

eventId (number, required): The unique ID of the event. Example: /api/v1/events/stats?eventId=1

Success Response (Status: 200 OK):

``` JSON

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
```


