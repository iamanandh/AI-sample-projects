# Listing Manager with Database

Week 6 Day 26 checkpoint: plan and create the first PostgreSQL data model.

## Data Model

Table: `listings`

Each row is one rental listing.

Columns:

- `id`: unique number for each listing
- `title`: listing name shown to the user
- `location`: city or area
- `price_per_month`: monthly rent as a number
- `bedrooms`: number of bedrooms
- `available`: whether the listing can be rented now
- `created_at`: when the row was created

## Run The Schema

After you create a PostgreSQL database, run:

```powershell
psql -d listing_manager -f db/schema.sql
```

Then check the rows:

```sql
SELECT * FROM listings;
```
