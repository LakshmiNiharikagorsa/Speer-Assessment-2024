# Speer-Assessment-2024

## 1) Framework/Database/3rd Party Tools Choices:

### Framework: 
The backend API is implemented using Node.js with the ``Express.js`` framework, a popular and lightweight web application framework for Node.js.

### Database: 
``MongoDB`` is chosen as the database, providing flexibility and scalability. Mongoose, an ODM (Object-Document Mapper) for MongoDB, is used to interact with the database in a more convenient way.

### Authentication: 
JSON Web Token (JWT) is chosen for token-based authentication. Bcrypt is used for securely hashing and comparing passwords.

### Search Functionality:
Based on data and keywords we can fetch the data for the notes with high performance.

### Rate Limiting: 
```Express-rate-limit``` is used for rate limiting and request throttling to handle high traffic.

## 2) Instructions to Run the Code:

* Install Node.js and npm if not already installed.
* Install MongoDB and ensure it's running.
* Clone the repository and navigate to the project directory.
* Run npm install to install the required dependencies.
* Set up the .env file with appropriate configurations (e.g., MongoDB connection string, JWT secret key). Modify those Keys accordingly
* Run the application using ```npm start``` or ```node app.js```.
* Ensure all the Modules running debug the code using ``Postman``.

## 3) Instructions to Run Tests:

* Tests are written using Mocha and Chai testing frameworks.
* To Run test cases use ```npm test``` to execute the test suite.

## 4) Necessary Setup Files or Scripts:

* A .env file is required for configuration settings, including the MongoDB connection string and JWT secret key.
* A test script is included in the package.json file for running tests with npm test.

## 5) Commands we can refer using PostMan

### GET /api/notes:

Endpoint: GET http://your-server-url/api/notes
Headers:
Authorization: YOUR_AUTH_TOKEN

### GET /api/notes/:id:

Endpoint: GET http://your-server-url/api/notes/your_note_id
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN

### POST /api/notes:

Endpoint: POST http://your-server-url/api/notes
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN
Body (as JSON):
json
```
{
  "title": "Your Note Title",
  "content": "Your Note Content"
}
```

### PUT /api/notes/:id:

Endpoint: PUT http://your-server-url/api/notes/your_note_id
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN
Body (as JSON):
json
```
{
  "title": "Updated Note Title",
  "content": "Updated Note Content"
}
```

### DELETE /api/notes/:id:

Endpoint: DELETE http://your-server-url/api/notes/your_note_id
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN

### POST /api/notes/:id/share:

Endpoint: POST http://your-server-url/api/notes/your_note_id/share
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN
Body (as JSON):
json
```
{
  "sharedWith": "user_to_share_with"
}
```

### GET /api/search:

Endpoint: GET http://your-server-url/api/search?q=your_search_query
Headers:
Authorization: Bearer YOUR_AUTH_TOKEN

* Ensure that you replace placeholders like your-server-url, your_note_id, YOUR_AUTH_TOKEN, etc., with actual values. Also, make sure your server is running and accessible at the specified endpoints.

