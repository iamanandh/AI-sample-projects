import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SIGNUP_URL = "http://localhost:8080/api/auth/signup";

function Signuppage({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main>
      <section className="panel">
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength="6"
              required
            />
          </label>

          <button type="submit">Create Account</button>
        </form>

        {error && <p className="error">{error}</p>}
        <p>Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}

export default Signuppage;
