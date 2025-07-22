# ERP_Login

ERP_Login is a modular authentication and management system for ERP platforms. It features separate Admin and Backend modules, supporting role-based access for students, teachers, and admins. The project uses modern React (with Vite), Redux Toolkit, Ant Design, Bootstrap, and a Node.js/Express/MongoDB backend.

---

## Features

- Role-based login system for Admins, Students, and Teachers.
- Dashboard for admin with student/teacher management (add, update).
- REST API for user/role management.
- MongoDB integration for persistent storage.
- File upload support (with Cloudinary).
- Modular and scalable codebase.
- Responsive UI with Ant Design & Bootstrap.

---

## Technology Stack

### Frontend (Admin)
- React (with Vite)
- Redux Toolkit
- React Router
- Ant Design (UI library)
- Bootstrap (styling)
- JavaScript (ES2020+)

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Morgan (logging)
- CORS
- express-fileupload
- Cloudinary (file uploads)
- JavaScript (ES Modules)

---

## Folder Structure

```
ERP_Login/
├── Admin/                      # Admin dashboard (React + Vite)
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── Pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Create_Student.jsx
│   │   │   ├── Create_Teacher.jsx
│   │   │   └── Update_Student.jsx
│   │   ├── Components/
│   │   │   └── layout.jsx
│   │   └── features/           # Redux slices, etc.
│   ├── index.html
│   ├── vite.config.js
│   └── README.md
├── Backend/                    # Backend API
│   ├── Database/
│   │   ├── db.js
│   │   └── cloudinaryConfig.js
│   ├── Routes/
│   │   ├── adminRoute.js
│   │   ├── roleRoutes.js
│   │   └── studentRoutes.js
│   ├── server.js
│   └── ...
└── ...
```
> See the [entire repo on GitHub](https://github.com/abhishekmishra0409/ERP_Login) for full details.

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas (or local MongoDB)
- Cloudinary account (for file uploads)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/abhishekmishra0409/ERP_Login.git
cd ERP_Login
```

#### 2. Setup Backend

```bash
cd Backend
npm install
# Set up MongoDB URI and Cloudinary config in Database/db.js and cloudinaryConfig.js
npm start
```

#### 3. Setup Admin Frontend

```bash
cd ../Admin
npm install
npm run dev
```

#### 4. Access

- **Admin Dashboard:** [http://localhost:5173](http://localhost:5173)
- **API Server:** [http://localhost:8080](http://localhost:8080)

---

## Project Structure Details

- **Admin**: Modern React app for admin login and management. Uses Redux Toolkit for state, Ant Design, and Bootstrap for UI.
- **Backend**: RESTful API server. Handles authentication, role management, and CRUD operations for users.

### Example Route Structure (Backend)

- `/api/admin` (admin routes)
- `/api/student` (student routes)
- `/api/teacher` (teacher/role routes)

---

## License

This project is for educational and demonstration purposes.

---

**For full folder and file structure, see the [GitHub repository](https://github.com/abhishekmishra0409/ERP_Login).**
