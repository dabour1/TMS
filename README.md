# TMS

# Express Task Management API

This is a Node.js and Express-based API for managing tasks and user authentication. It includes features for user registration, login, and CRUD operations for tasks.

## Features

- User authentication with hashed passwords.
- Task management (Create, Read, Update, Delete).
- Grouped routes for modular structure.
- Error handling with custom middleware.

---

## Setup Instructions

### Prerequisites

- Node.js (>=16.x)
- MongoDB (running locally or a connection URI)
- Postman or any REST client for testing

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret
```

### Run the Server

```bash
npm run dev 
```

The server will run on `http://localhost:5000` using nodemon .

---

## API Endpoints

### Authentication Routes

#### **Register User**

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password@123"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

#### **Login User**

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "johndoe@example.com",
  "password": "password@123"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

---

### Task Routes

**Note:** All task routes require a Bearer token in the Authorization header.

#### **Create a Task**

**POST** `/api/tasks`

**Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "title": "Task 1",
  "description": "This is task 1",
  "status": "Pending",
  "dueDate": "2024-12-31"
}
```

**Response:**

```json
{
  "_id": "64f99dcd1234567890abcdef",
  "title": "Task 1",
  "description": "This is task 1",
  "status": "Pending",
  "dueDate": "2024-12-31",
  "userId": "64f98bcd1234567890abcdef",
  "createdAt": "2024-12-20T16:10:44.880Z",
  "updatedAt": "2024-12-20T16:10:44.880Z",
  "__v": 0
}
```

#### **Get All Tasks**

**GET** `/api/tasks`

**Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response:**

```json
[
  {
    "_id": "64f99dcd1234567890abcdef",
    "title": "Task 1",
    "description": "This is task 1",
    "status": "Pending",
    "dueDate": "2024-12-31",
    "userId": "64f98bcd1234567890abcdef"
    "createdAt": "2024-12-20T16:10:44.880Z",
    "updatedAt": "2024-12-20T16:10:44.880Z",
    "__v": 0
  }
]
```

#### **Update a Task**

**PUT** `/api/tasks/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "status": "Completed"
}
```

**Response:**

```json
{
  "_id": "64f99dcd1234567890abcdef",
  "title": "Task 1",
  "description": "This is task 1",
  "status": "Completed",
  "dueDate": "2024-12-31",
  "userId": "64f98bcd1234567890abcdef"
  "createdAt": "2024-12-20T16:10:44.880Z",
  "updatedAt": "2024-12-20T16:10:44.880Z",
  "__v": 0
}
```

#### **Delete a Task**

**DELETE** `/api/tasks/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response:**

```json
{
  "message": "Task deleted successfully."
}
```

---

## Testing

### Run Unit Tests

Use Mocha and Chai to run unit tests.

```bash
npm test
```
### Coverage
 For test coverage use

```bash
npm run coverage
```
 
 

 
