# RRRS - Restaurant Review & Rating System

A full-stack web application that allows users to discover restaurants, leave reviews, and rate their experiences.

---

## 🚀 Tech Stack

### Frontend
- React
- Vite
- Vitest

### Backend
- Node.js
- Express

### Databases
- MySQL (Users & Restaurants)
- MongoDB (Reviews)

### DevOps
- Docker
- Docker Compose

---

## 📦 Project Structure

```
RRRS/
│
├── frontend/        # React + Vite frontend
├── backend/         # Express API
├── database/        # MySQL initialization scripts
├── .github/         # CI workflow
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Run the Project Locally

### 1. Start backend and databases

```
docker compose up --build
```

This will start:

- MySQL database
- MongoDB database
- Express backend API

---

### 2. Start the frontend

Open another terminal:

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Application URLs

Frontend  
http://localhost:5173  

Backend API  
http://localhost:5000

---

## 📌 Features

- User authentication (JWT)
- Create and manage restaurants
- Write and update reviews
- Rating system with average score
- RESTful API
- Dockerized development environment

---

## 🧪 Testing

Frontend testing is implemented using **Vitest**.

Run tests with:

```
npm run test
```

---

## 📄 License

This project is for educational purposes.