# Doctor Search & Appointment Booking System

## Overview
This project is a **Doctor Search & Appointment Booking System** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). The system allows:
- **Patients** to search for doctors, book/cancel appointments.
- **Doctors** to manage their availability and appointments.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt.js
- **Database:** MongoDB
- **Email Notifications:** Nodemailer


---

## Features
### 1. User Authentication & Role Management
- JWT-based authentication for **Doctors and Patients**.
- Secure password hashing with bcrypt.js.

### 2. Doctor Search & Profile Management
- Patients can search for doctors using:
  - **Specialty** (e.g., Cardiologist, Dentist)
  - **Location** (City, State)
  - **Doctor's Name** (Partial Match Search)
- Doctor profile displays:
  - Name, Specialty, Experience, Location, Availability Slots.

### 3. Appointment Booking System
- **Doctors** set their working hours and consultation locations.
- **Patients** can book available slots.
- **Concurrency handling** to prevent double booking.
- **Patients** can cancel appointments.
- Email notifications sent for bookings and cancellations.

### 4. Web Interface (Frontend)
#### **Patient Portal**
- Search for doctors.
- Book or cancel appointments.

#### **Doctor Dashboard**
- Set up consultation locations.
- Define and update availability.
- View upcoming appointments.

---

## Installation & Setup
### Backend Setup

2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## API Endpoints
### Authentication
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| POST   | /auth/signup | Register a user (Patient/Doctor) |
| POST   | /auth/login | Login and get a JWT token |
| POST   | /auth/logout | Logout and clear cookies |
| POST   | /auth/checkAuth | Checking authentication |

### User Management & Appointments

| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /user/search/doctor | Get list of doctors |
| GET    | /user/doctor/:id | Get doctor details |
| GET    | user/myAppointments | Get user upcoming Appointments |
| POST   | user/cancelAppointment | Cancel scheduled appointment |
| POST   | /user/bookSlot | Book Appointment |

### Doctor Management

| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /doctor/updateData | Update Personal Data |
| PUT    | /doctor/updateSlots | Set availability |

---

## Author
Developed by **Nikhil Sharma** 
