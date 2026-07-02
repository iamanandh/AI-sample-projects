CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT 
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DELETE FROM listings;
ALTER SEQUENCE listings_id_seq RESTART WITH 1;
TRUNCATE TABLE listings RESTART IDENTITY CASCADE;

INSERT INTO listings (title, location, price, bedrooms, description, image_url)
VALUES
  (
    'Sunny Studio Near Metro',
    'Anna Nagar',
    12000,
    1,
    'A compact studio close to shops and public transport.',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  ),
  (
    'Family Apartment With Balcony',
    'Velachery',
    22000,
    2,
    'A bright two-bedroom apartment with good ventilation and parking.',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  ),
  (
    'Quiet Home Office Rental',
    'Adyar',
    18000,
    1,
    'A calm rental option suited for students or remote workers.',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
  );
  