import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loginpage from "./page/loginpage.jsx";
import Signuppage from "./page/signuppage.jsx";
import "./App.css";

const API_BASE_URL = "http://localhost:8080/api";
const API_URL = `${API_BASE_URL}/listings`;

const emptyForm = {
  title: "",
  location: "",
  price_per_month: "",
  bedrooms: "",
  available: true,
};

function App() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savedListings, setSavedListings] = useState([]);

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function handleSaveListing(listingId) {
  const response = await fetch(`${API_BASE_URL}/saved-listings/${listingId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    showError(data.error || "Could not save listing");
    return;
  }

  showMessage(data.message);
  fetchSavedListings();
}
async function handleUnsaveListing(listingId) {
  const response = await fetch(`${API_BASE_URL}/saved-listings/${listingId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    showError(data.error || "Could not unsave listing");
    return;
  }

  showMessage(data.message);
  fetchSavedListings();
}
async function fetchSavedListings() {
  const response = await fetch(`${API_BASE_URL}/saved-listings`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    showError(data.error || "Could not load saved listings");
    return;
  }

  setSavedListings(data);
}

  const showMessage = (text) => {
    setMessage(text);
    setError("");
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const fetchListings = () => {
    setLoading(true);

    fetch(API_URL)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load listings");
        }

        return data;
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        showError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedListings();
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveListing = (event) => {
    event.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not save listing");
        }

        return data;
      })
      .then(() => {
        showMessage(editingId ? "Listing updated" : "Listing added");
        resetForm();
        fetchListings();
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title,
      location: listing.location,
      price_per_month: listing.price_per_month,
      bedrooms: listing.bedrooms,
      available: listing.available,
    });
    setMessage("");
    setError("");
  };

  const deleteListing = (listing) => {
    const shouldDelete = window.confirm(
      `Delete "${listing.title}" from the database?`
    );

    if (!shouldDelete) {
      return;
    }

    fetch(`${API_URL}/${listing.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not delete listing");
        }

        return data;
      })
      .then(() => {
        showMessage("Listing deleted");
        fetchListings();
      })
      .catch((error) => {
        showError(error.message);
      });
  };
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Loginpage onLogin={setUser} />}
      />

      <Route
        path="/signup"
        element={<Signuppage onLogin={setUser} />}
      />

      <Route
        path="/dashboard"
        element={
          user ? (
            <main>
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Listing Manager</h1>
          <p className="record-count">Logged in as {user.name}</p>
        </div>
        <div className="row-actions">
          <p className="record-count">{listings.length} records</p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
          
        </div>
      </header>

      <section className="panel">
        <h2>{editingId ? "Edit Listing" : "Add Listing"}</h2>

        <form onSubmit={saveListing}>
          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sunny Studio"
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Chennai"
            />
          </label>

          <label>
            Price per month
            <input
              name="price_per_month"
              type="number"
              value={formData.price_per_month}
              onChange={handleChange}
              placeholder="18000"
            />
          </label>

          <label>
            Bedrooms
            <input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="1"
            />
          </label>

          <label className="checkbox-row">
            <input
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Listing" : "Add Listing"}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Database Records</h2>
          <button type="button" className="secondary" onClick={fetchListings}>
            Refresh
          </button>
        </div>

        {loading && <p className="empty-state">Loading listings...</p>}

        {!loading && listings.length === 0 && (
          <p className="empty-state">
            No listings yet. Add the first record using the form above.
          </p>
        )}

        {!loading && listings.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Beds</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.title}</td>
                    <td>{listing.location}</td>
                    <td>Rs. {listing.price_per_month}</td>
                    <td>{listing.bedrooms}</td>
                    <td>
                      <span
                        className={
                          listing.available ? "status available" : "status off"
                        }
                      >
                        {listing.available ? "Available" : "Not available"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" onClick={() => handleSaveListing(listing.id)}>
                          Save
                        </button>
                        {listing.user_id === user.id && (
                          <>
                            <button type="button" onClick={() => startEdit(listing)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger"
                              onClick={() => deleteListing(listing)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="panel">
  <h2>My Saved Listings</h2>

  {savedListings.length === 0 ? (
    <p className="empty-state">No saved listings yet.</p>
  ) : (
    <ul>
      {savedListings.map((listing) => (
        <li key={listing.id}>
  {listing.title} - {listing.location} - Rs. {listing.price_per_month}
  <button type="button" onClick={() => handleUnsaveListing(listing.id)}>
    Unsave
  </button>
</li>
      ))}
    </ul>
  )}
</section>
      
      

            </main>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
