# Pool CMS - Consultant Management System

Pool CMS is a comprehensive, full-stack application for managing consultant bench status, skills tracking, and project opportunities. It features a React-based frontend and a powerful Python FastAPI backend with an embedded SQLite database.

## 🚀 Features

- **Consultant Profiles**: Track skills, experience, and current bench availability.
- **Skills Management**: Add and manage both technical and soft skills.
- **Project Opportunities**: Match available consultants to open roles based on skill requirements.
- **Attendance Tracking**: Monitor consultant attendance and utilization rates.
- **Responsive Dashboard**: Beautiful UI built with React, Vite, and Tailwind CSS.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite (No external database setup required!)
- **Authentication**: JWT-based session management

## 💻 Running the Application

To run the application locally, you will need to start both the backend server and the frontend interface in separate terminal windows.

### 1. Start the Backend API
Make sure you are in the root directory of the project, then start the FastAPI server:
```bash
python simple_backend.py
```
*The backend will be available at `http://localhost:8000`*

### 2. Start the Frontend
Open a new terminal window, navigate to the `frontend` folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:3000` or `http://localhost:5173`*

## 🔑 Demo Credentials

Once the application is running, you can log in using the following test credentials:

**Admin Access**
- Email: `admin@benchsync.com` (or `hari@company.com`)
- Password: `password123`

**Consultant Access**
- Email: `consultant@benchsync.com` (or `kisshore@company.com`)
- Password: `password123`

## 📦 Deployment

The frontend of this application is fully configured to be deployed on **Firebase Hosting**. 

To deploy the frontend:
1. Navigate to the `frontend` directory.
2. Build the production application: `npm run build`
3. Initialize Firebase: `firebase init hosting`
4. Deploy: `firebase deploy`

*(Note: The Python backend must be hosted separately on a platform like Render, Railway, or Google Cloud Run, and the `API_BASE_URL` in `AuthContext.tsx` should be updated to point to your live backend).*
