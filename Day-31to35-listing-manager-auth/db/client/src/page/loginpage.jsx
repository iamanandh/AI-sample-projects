import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LOGIN_URL = "http://localhost:8080/api/auth/login";
function Loginpage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
      event.preventDefault();
      setError("");
      try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ email , password }),

        });
        const data =await response.json();

        if(!response.ok){
            throw new Error(data.error || "Login failed");
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
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
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
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}
        <p>Need an account? <Link to="/signup">Sign up</Link></p>
      </section>
    </main>
  );

}

export default Loginpage;
