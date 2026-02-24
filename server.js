// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js"; // adjust path if needed

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE (ORDER MATTERS)
========================= */

// JSON parser
app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: "https://mocmed-diagnostic-frontend-emd1.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/*
IMPORTANT:
REMOVE this old line completely:
app.options("*", cors());
Express 5 no longer supports "*"
cors() already handles preflight automatically.
*/

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);

// Health check route (useful for Render wake-up)
app.get("/", (req, res) => {
  res.send("Backend running...");
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
