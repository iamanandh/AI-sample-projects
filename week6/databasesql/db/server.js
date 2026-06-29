const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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

app.post("/api/listings", async (req, res) => {
  try {
    const validation = validateListing(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, location, priceNumber, bedroomNumber, available } =
      validation.listing;

    const result = await pool.query(
      `INSERT INTO listings (title, location, price_per_month, bedrooms, available)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, location, priceNumber, bedroomNumber, available]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Could not save listing" });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateListing(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, location, priceNumber, bedroomNumber, available } =
      validation.listing;

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

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

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

app.listen(3020, () => {
  console.log("Server running on http://localhost:3020");
});
