import { useEffect, useState } from "react";

function App() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [signupForm, setSignupForm] = useState({
  name: "",
  email: "",
  password: "",
});

const [authMessage, setAuthMessage] = useState("");
function handleSignup(event) {
  event.preventDefault();

  fetch("http://localhost:3001/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupForm),
  })
    .then((res) => res.json())
    .then((data) => {
      setAuthMessage(data.message);
      setSignupForm({ name: "", email: "", password: "" });
    })
    .catch((error) => console.log(error));
}
const [loginForm, setLoginForm] = useState({
  email: "",
  password: "",
});

const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((error) => console.log(error));
  }, []);
  function handleViewDetails(id) {
  fetch(`http://localhost:3001/api/listings/${id}`)
    .then((res) => res.json())
    .then((data) => setSelectedListing(data))
    .catch((error) => console.log(error));
}
function handleLogin(event) {
  event.preventDefault();

  fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginForm),
  })
    .then((res) => res.json())
    .then((data) => {
      setAuthMessage(data.message);

      if (data.user) {
        setCurrentUser(data.user);
        setLoginForm({ email: "", password: "" });
      }
    })
    .catch((error) => console.log(error));
}
function handleSaveFavorite(listingId) {
  if (!currentUser) {
    setAuthMessage("Please login before saving favorites");
    return;
  }
  const [inquiryMessage, setInquiryMessage] = useState("");
  function handleSubmitInquiry(listingId) {
  if (!currentUser) {
    setAuthMessage("Please login before submitting a request");
    return;
  }

  if (!inquiryMessage) {
    setAuthMessage("Please type a message first");
    return;
  }

  fetch("http://localhost:3001/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: currentUser.id,
      listingId: listingId,
      message: inquiryMessage,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      setAuthMessage(data.message);
      setInquiryMessage("");
    })
    .catch((error) => console.log(error));
}

  fetch("http://localhost:3001/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: currentUser.id,
      listingId: listingId,
    }),
  })
    .then((res) => res.json())
    .then((data) => setAuthMessage(data.message))
    .catch((error) => console.log(error));
}

  return (
    <div>
      <h1>Rental Scout</h1>
      <form onSubmit={handleSignup}>
  <h2>Sign up</h2>

  <input
    type="text"
    placeholder="Name"
    value={signupForm.name}
    onChange={(event) =>
      setSignupForm({ ...signupForm, name: event.target.value })
    }
  />

  <input
    type="email"
    placeholder="Email"
    value={signupForm.email}
    onChange={(event) =>
      setSignupForm({ ...signupForm, email: event.target.value })
    }
  />

  <input
    type="password"
    placeholder="Password"
    value={signupForm.password}
    onChange={(event) =>
      setSignupForm({ ...signupForm, password: event.target.value })
    }
  />

  <button type="submit">Sign up</button>
</form>
<form onSubmit={handleLogin}>
  <h2>Login</h2>

  <input
    type="email"
    placeholder="Email"
    value={loginForm.email}
    onChange={(event) =>
      setLoginForm({ ...loginForm, email: event.target.value })
    }
  />

  <input
    type="password"
    placeholder="Password"
    value={loginForm.password}
    onChange={(event) =>
      setLoginForm({ ...loginForm, password: event.target.value })
    }
  />

  <button type="submit">Login</button>
</form>
{currentUser && (
  <div>
    <p>Logged in as {currentUser.name}</p>

    <button onClick={() => setCurrentUser(null)}>
      Logout
    </button>
  </div>
)}

<p>{authMessage}</p>

      {listings.map((listing) => (
        <div key={listing.id}>
          <img
            src={listing.image_url}
            alt={listing.title}
            width="250"
          />
          <h2>{listing.title}</h2>
          <p>{listing.location}</p>
          <p>Rs. {listing.price}</p>
          <p>{listing.bedrooms} bedrooms</p>
          <button onClick={() => handleViewDetails(listing.id)}>
            View details
          </button>
          <button onClick={() => handleSaveFavorite(listing.id)}>
            Save Favorite
          </button>
        </div>
      ))}
      {selectedListing && (
  <div>
    <h2>{selectedListing.title}</h2>
    <p>{selectedListing.location}</p>
    <p>Rs. {selectedListing.price}</p>
    <p>{selectedListing.bedrooms} bedrooms</p>
    <p>{selectedListing.description}</p>

    <button onClick={() => setSelectedListing(null)}>
      Close
    </button>
    <textarea
  placeholder="Write your request message"
  value={inquiryMessage}
  onChange={(event) => setInquiryMessage(event.target.value)}
></textarea>

<button onClick={() => handleSubmitInquiry(selectedListing.id)}>
  Submit Request
</button>
  </div>
)}
    </div>
  );
}

export default App;