import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Rental Scout API is running" });
});
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected",
      time: result.rows[0].now,
    });
  } catch (error) {
  console.error("DB TEST ERROR:", error.message);

  res.status(500).json({
    message: "Database connection failed",
    error: error.message,
  });

  }
  
});
app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id");

    res.json(result.rows);
  } catch (error) {
    console.error("LISTINGS ERROR:", error.message);

    res.status(500).json({
      message: "Could not load listings",
      error: error.message,
    });
  }
});
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "Signup successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({
        message: "userId and listingId are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO favorites (user_id, listing_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, listingId]
    );

    res.status(201).json({
      message: "Favorite saved",
      favorite: result.rows[0],
    });
  } catch (error) {
    console.error("FAVORITE ERROR:", error.message);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "This listing is already saved",
      });
    }

    res.status(500).json({
      message: "Could not save favorite",
      error: error.message,
    });
  }
});
app.post("/api/inquiries", async (req, res) => {
  try {
    const { userId, listingId, message } = req.body;

    if (!userId || !listingId || !message) {
      return res.status(400).json({
        message: "userId, listingId, and message are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO inquiries (user_id, listing_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, listingId, message]
    );

    res.status(201).json({
      message: "Request submitted",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("INQUIRY ERROR:", error.message);

    res.status(500).json({
      message: "Could not submit request",
      error: error.message,
    });
  }
});
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const favoritesResult = await pool.query(
      `SELECT favorites.id AS favorite_id, listings.*
       FROM favorites
       JOIN listings ON favorites.listing_id = listings.id
       WHERE favorites.user_id = $1
       ORDER BY favorites.id DESC`,
      [userId]
    );

    const inquiriesResult = await pool.query(
      `SELECT inquiries.id AS inquiry_id,
              inquiries.message,
              inquiries.status,
              inquiries.created_at,
              listings.title,
              listings.location
       FROM inquiries
       JOIN listings ON inquiries.listing_id = listings.id
       WHERE inquiries.user_id = $1
       ORDER BY inquiries.id DESC`,
      [userId]
    );

    res.json({
      favorites: favoritesResult.rows,
      inquiries: inquiriesResult.rows,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error.message);

    res.status(500).json({
      message: "Could not load dashboard",
      error: error.message,
    });
  }
});
app.get("/api/listings/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("LISTING DETAIL ERROR:", error.message);

    res.status(500).json({
      message: "Could not load listing",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});