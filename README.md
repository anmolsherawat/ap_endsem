# Hostel Management System

A comprehensive full-stack hostel management system built with Express.js, Prisma, React, and Tailwind CSS.

## Features

- 🔐 **Authentication System**: JWT-based authentication with role-based access control
- 🏠 **Room Management**: Add, update, delete rooms with filtering by floor and type
- 👥 **Student Management**: Register students and allocate rooms
- 📝 **Complaint Management**: Submit and track complaints with status updates
- ✅ **Attendance Tracking**: Mark and view attendance records
- 📊 **Dashboard**: Role-based dashboards with statistics and charts
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Node.js & Express.js
- Prisma ORM (SQLite)
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- React Router
- Tailwind CSS
- Recharts for data visualization
- Axios for API calls
- React Hot Toast for notifications

## Project Structure

```
/project-root
  /backend
    /src
      /config
      /controllers
      /middlewares
      /routes
      /services
      /utils
      /prisma
    package.json
  /frontend
    /src
      /components
      /pages
      /context
      /hooks
      /utils
      /assets
    package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Seed the database (optional):
```bash
npm run prisma:seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Credentials

After seeding the database, you can use these credentials:

### Admin
- Email: `admin@hostel.com`
- Password: `admin123`

### Warden
- Email: `warden@hostel.com`
- Password: `warden123`

### Student
- Email: `student1@hostel.com`
- Password: `student123`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (Admin/Warden only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin/Warden only)
- `DELETE /api/users/:id` - Delete user (Admin/Warden only)

### Rooms
- `POST /api/rooms` - Create room (Admin/Warden only)
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room (Admin/Warden only)
- `DELETE /api/rooms/:id` - Delete room (Admin/Warden only)

### Students
- `POST /api/students` - Register student (Admin/Warden only)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student (Admin/Warden only)
- `DELETE /api/students/:id` - Delete student (Admin/Warden only)

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get complaints (filtered by role)
- `PUT /api/complaints/:id` - Update complaint status

### Attendance
- `POST /api/attendance/mark` - Mark attendance (Admin/Warden only)
- `GET /api/attendance/student/:id` - Get student attendance

## Features by Role

### Admin/Warden
- Full access to all features
- Manage rooms, students, complaints
- Mark attendance
- View comprehensive dashboard with statistics

### Student
- View own room details
- Submit complaints
- View own attendance history
- View personal dashboard

## Development

### Backend
- Run in development mode: `npm run dev`
- Run in production mode: `npm start`

### Frontend
- Development server: `npm start`
- Build for production: `npm run build`

## Notes

- The database uses SQLite for simplicity. For production, consider using PostgreSQL or MySQL.
- JWT tokens are stored in HttpOnly cookies for security.
- The frontend uses localStorage as a fallback for token storage.
- All API requests include authentication tokens automatically via Axios interceptors.

## License



