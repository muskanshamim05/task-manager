# Personal Task Manager

Full-stack app: **Java Spring Boot** + **React (Vite)** + **MySQL**

---

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

## 1. Database Setup

Start MySQL and run:

```sql
CREATE DATABASE taskmanager;
```

> Spring Boot will auto-create the `tasks` table on first run.

---

## 2. Backend Setup

### Configure database credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will open at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/tasks                | Get all tasks            |
| GET    | /api/tasks?filter=active  | Filter: active/completed |
| GET    | /api/tasks?search=keyword | Search by title          |
| GET    | /api/tasks/stats          | Get task counts          |
| GET    | /api/tasks/{id}           | Get task by ID           |
| POST   | /api/tasks                | Create a task            |
| PUT    | /api/tasks/{id}           | Update a task            |
| PATCH  | /api/tasks/{id}/toggle    | Toggle done/undone       |
| DELETE | /api/tasks/{id}           | Delete a task            |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/taskmanager/
│       ├── TaskManagerApplication.java
│       ├── controller/
│       │   ├── TaskController.java
│       │   └── GlobalExceptionHandler.java
│       ├── model/
│       │   ├── Task.java
│       │   └── TaskDTO.java
│       ├── repository/
│       │   └── TaskRepository.java
│       └── service/
│           └── TaskService.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api/tasks.js
│       └── components/
│           ├── AddTaskForm.jsx
│           ├── TaskCard.jsx
│           └── DeleteModal.jsx
└── schema.sql
```

---

## Features

- Add tasks with title, description, due date
- View all tasks sorted newest first
- Toggle tasks complete / incomplete
- Edit any task inline
- Delete with confirmation modal
- Filter: All / Active / Completed
- Search tasks by title
- Stats: active, completed, overdue, total
- Overdue tasks highlighted in red
- Empty state UI for each filter
- Data persisted in MySQL
