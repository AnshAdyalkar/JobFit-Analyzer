
# JobFit Analyzer - AI Powered Career Assistan

An advanced MERN stack application that analyzes resumes using AI (Gemini), provides ATS scores, identifies skill gaps, and suggests personalized career roadmaps.

## 🌟 What Makes This Project Unique?

Unlike standard ATS checkers, this platform provides a **complete end-to-end career solution**:

- **Direct Resume-to-Job Comparison**: Don't just get a score. Our AI directly compares your resume against specific job descriptions to find exactly where you stand and what you're missing.
- **Integrated Internship & Job Search**: Once analyzed, you can directly search for and find relevant internships and job opportunities that match your improved profile right from the dashboard.
- **Actionable Gap Closure**: We don't just tell you what's missing; we provide a direct career plan to help you acquire the skills needed for your dream role.

## 🚀 Features

- **Direct Resume-to-Job Comparison**: AI-powered comparison against specific job descriptions.
- **Internship & Job Search**: Integrated search to find relevant opportunities directly from the platform.
- **ATS Scoring**: Instant score breakdown (Formatting, Keywords, Experience, Education, Skills).
- **Skill Gap Analysis**: Identifies missing skills for target job roles.
- **Job Suggestions**: Personalized job matches with match percentages.
- **Career Roadmap**: AI-generated step-by-step plan to improve your profile.
- **User Authentication**: Secure JWT-based login, signup, and profile management.
- **Dark Mode Support**: Modern UI with dark/light theme switching.
- **Persistent Database**: Saves analysis history and user profile to MongoDB.

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios, Framer Motion, React Toastify.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas or In-memory fallback).
- **AI**: Google Gemini Pro (via `@google/generative-ai`).
- **Auth**: JWT (JSON Web Tokens) with Bcrypt password hashing.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (optional, fallback provided)
- Google Gemini API Key

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Job_Seeker-main
   ```

2. **Install all dependencies**
   From the root folder, run:
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**
   Create a `.env` file in `Job_ATS/jobats/backend/`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   GEMINI_API_KEY=your_google_gemini_api_key
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

## 🚀 Running the Project

You can start both frontend and backend simultaneously from the root directory:

```bash
npm start
```

Alternatively, run them separately:

- **Backend**:
  ```bash
  cd Job_ATS/jobats/backend
  node server.js
  ```
- **Frontend**:
  ```bash
  cd Job_ATS/jobats/frontend
  npm start
  ```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

- `Job_ATS/jobats/frontend`: React application source code.
- `Job_ATS/jobats/backend`: Express API with MongoDB integration.
- `Job_ATS/jobats/backend/models`: Mongoose schemas for Users, Resumes, and Analyses.
- `Job_ATS/jobats/backend/controllers`: Business logic for auth, profile, and analysis.

## 🛡️ Security Note

The backend includes an automatic fallback to an in-memory MongoDB if your Atlas IP is not whitelisted. For production use, ensure your IP is whitelisted in MongoDB Atlas and use a strong `JWT_SECRET`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

