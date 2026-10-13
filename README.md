# StudentHub | MERN Student Record Manager

A beginner-friendly full-stack CRUD application built with **MongoDB, Express.js, React, and Node.js**.

StudentHub helps a user manage student records from a simple dashboard.

## Features

- Add student records
- View all students
- Edit student details
- Delete student records
- Search by student name, roll number, or department
- Validate required fields and marks
- Responsive dashboard UI

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- CSS

## Folder Structure

```text
studenthub-mern/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── server/
│   ├── models/Student.js
│   ├── routes/students.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Requirements

Install Node.js (LTS recommended), npm, and have access to MongoDB locally or through MongoDB Atlas.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/studenthub-mern.git
cd studenthub-mern
```

### 2. Start the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and configure your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/studenthub
```

For MongoDB Atlas, use your own connection string. Do not commit real credentials or `.env` files.

Start the API:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

Health check: `http://localhost:5000/api/health`

### 3. Start the frontend

Open a second terminal at the project root:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | List students |
| GET | `/students/:id` | Get one student |
| POST | `/students` | Create a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |
| GET | `/health` | API health check |

### Example student document

```json
{
  "rollNumber": "CSE101",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "department": "CSE",
  "year": 2,
  "marks": 85
}
```

## How It Works

1. React collects form input and displays the student list.
2. React sends HTTP requests to the Express REST API.
3. Express validates the request and uses the Mongoose model.
4. Mongoose reads or writes records in MongoDB.
5. The backend returns JSON.
6. React refreshes the dashboard.

| Project    | Website                      | Backend API                   |
| ---------- | ---------------------------- | ----------------------------- |
| StudentHub | `studenthub-mern.vercel.app` | `studenthub-api.onrender.com` |
