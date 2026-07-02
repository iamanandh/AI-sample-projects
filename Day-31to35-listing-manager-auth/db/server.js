const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "listing_manager",
  password: "12345",
  port: 5432,
});

const sessions = new Map();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function createToken(userId) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, userId);
  return token;
}

function validateAuthBody(body, mode) {
  const { name, email, password } = body;

  if (mode === "signup" && !name) {
    return { error: "Name is required" };
  }

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  return {
    authData: {
      name,
      email: email.toLowerCase().trim(),
      password,
    },
  };
}

async function requireCurrentUser(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Please log in first" });
  }

  try {
    const userId = sessions.get(token);
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      sessions.delete(token);
      return res.status(401).json({ error: "Please log in again" });
    }

    req.currentUser = result.rows[0];
    next();
  } catch (error) {
    res.status(500).json({ error: "Could not check current user" });
  }
}

function validateListing(body) {
  const { title, location, price_per_month, bedrooms, available } = body;

  if (!title || !location || !price_per_month || !bedrooms) {
    return {
      error: "Title, location, price, and bedrooms are required",
    };
  }

  const priceNumber = Number(price_per_month);
  const bedroomNumber = Number(bedrooms);

  if (Number.isNaN(priceNumber) || Number.isNaN(bedroomNumber)) {
    return {
      error: "Price and bedrooms must be numbers",
    };
  }

  return {
    listing: {
      title,
      location,
      priceNumber,
      bedroomNumber,
      available: available ?? true,
    },
  };
}

app.post("/api/auth/signup", async (req, res) => {
  try {
    const validation = validateAuthBody(req.body, "signup");

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { name, email, password } = validation.authData;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name.trim(), email, passwordHash]
    );

    const user = publicUser(result.rows[0]);
    const token = createToken(user.id);

    res.status(201).json({
      message: "Signup successful",
      user,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const validation = validateAuthBody(req.body, "login");

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { email, password } = validation.authData;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userRecord = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      userRecord.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = publicUser(userRecord);
    const token = createToken(user.id);

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not log in" });
  }
});

app.get("/api/auth/me", requireCurrentUser, (req, res) => {
  res.json({
    message: "Current user loaded",
    user: req.currentUser,
  });
});
app.get("/api/saved-listings", requireCurrentUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*
       FROM saved_listings
       JOIN listings
         ON listings.id = saved_listings.listing_id
       WHERE saved_listings.user_id = $1
       ORDER BY saved_listings.created_at DESC`,
      [req.currentUser.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Could not load saved listings",
    });
  }
});
app.post("/api/saved-listings/:listingId", requireCurrentUser, async (req, res) => {
  try {
    const { listingId } = req.params;

    const result = await pool.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_id) DO NOTHING
       RETURNING *`,
      [req.currentUser.id, listingId]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Listing already saved" });
    }

    res.status(201).json({
      message: "Listing saved",
      savedListing: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(500).json({ error: "Could not save listing" });
  }
});

app.delete("/api/saved-listings/:listingId", requireCurrentUser, async (req, res) => {
  try {
    const { listingId } = req.params;

    const result = await pool.query(
      `DELETE FROM saved_listings
       WHERE user_id = $1 AND listing_id = $2
       RETURNING *`,
      [req.currentUser.id, listingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Saved listing not found" });
    }

    res.json({
      message: "Listing unsaved",
      savedListing: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Could not unsave listing" });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Could not load listings" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM listings WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Could not load listing" });
  }
});

app.post("/api/listings", requireCurrentUser, async (req, res) => {
  try {
    const validation = validateListing(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, location, priceNumber, bedroomNumber, available } =
      validation.listing;

    const result = await pool.query(
  `INSERT INTO listings (user_id, title, location, price_per_month, bedrooms, available)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
  [req.currentUser.id, title, location, priceNumber, bedroomNumber, available]
);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Could not save listing" });
  }
});

app.put("/api/listings/:id", requireCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateListing(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, location, priceNumber, bedroomNumber, available } =
      validation.listing;

    const ownerCheck = await pool.query(
  "SELECT user_id FROM listings WHERE id = $1",
  [id]
);

if (ownerCheck.rows.length === 0) {
  return res.status(404).json({ error: "Listing not found" });
}

if (ownerCheck.rows[0].user_id !== req.currentUser.id) {
  return res.status(403).json({ error: "You cannot edit another user's listing" });
}

const result = await pool.query(
  `UPDATE listings
   SET title = $1,
       location = $2,
       price_per_month = $3,
       bedrooms = $4,
       available = $5
   WHERE id = $6
   RETURNING *`,
  [title, location, priceNumber, bedroomNumber, available, id]
);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Could not update listing" });
  }
});

app.delete("/api/listings/:id", requireCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;

    const ownerCheck = await pool.query(
  "SELECT user_id FROM listings WHERE id = $1",
  [id]
);

if (ownerCheck.rows.length === 0) {
  return res.status(404).json({ error: "Listing not found" });
}

if (ownerCheck.rows[0].user_id !== req.currentUser.id) {
  return res.status(403).json({ error: "You cannot delete another user's listing" });
}

const result = await pool.query(
  "DELETE FROM listings WHERE id = $1 RETURNING *",
  [id]
);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({ message: "Listing deleted", listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Could not delete listing" });
  }
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
