require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");

const authMiddleware = require("./middleware/auth");

const app = express();


// ============================
// CORS Configuration
// ============================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://jobats-aded8.web.app"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {

    // allow requests with no origin (mobile apps / postman)
    if (!origin) return callback(null, true);

    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));


// ============================
// Middleware
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================
// API Routes
// ============================

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/resume", authMiddleware, resumeRoutes);
app.use("/api/analysis", authMiddleware, analysisRoutes);
app.use("/api/profile", authMiddleware, profileRoutes);

// Admin
app.use("/api/admin", adminRoutes);


// ============================
// Health Check Route
// ============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀"
  });
});


// ============================
// Error Handling Middleware
// ============================
app.use(errorHandler);


// ============================
// Start Server
// ============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
