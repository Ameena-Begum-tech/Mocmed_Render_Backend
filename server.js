// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { protect, authorize } = require("./middleware/authMiddleWare");

// Load env variables
dotenv.config();

// Connect database
connectDB();

const app = express();


// ============================
// CORS CONFIG  (FIXED)
// ============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://mocmed-diagnostic-frontend-emd1.vercel.app", // ❌ NO trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// IMPORTANT for Render preflight requests
app.options("*", cors());


// ============================
// MIDDLEWARES
// ============================

app.use(express.json());


// ============================
// ROUTES
// ============================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));


// ============================
// TEST ROUTES
// ============================

app.get("/", (req, res) => {
  res.send("Mocmed Backend Running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

app.get("/api/admin-only", protect, authorize("SUPERADMIN"), (req, res) => {
  res.json({
    message: "Welcome Super Admin 👑",
    user: req.user,
  });
});


// ============================
// SERVER START
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
