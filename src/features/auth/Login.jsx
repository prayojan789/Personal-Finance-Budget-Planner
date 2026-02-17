import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/toastCore.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function Login() {
  const { login, isAuthenticated, user, session } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = login(form.email, form.password);
    if (result.success) {
      toast.success("Login successful!");
      setForm({ email: "", password: "" });
    } else {
      setError(result.error);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="auth auth--login">
        <h3>Welcome back!</h3>
        <p className="muted">You're logged in as {user.email}</p>
        <div className="auth-info">
          <div className="info-row">
            <span>Name:</span>
            <strong>{user.name}</strong>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <strong>{user.email}</strong>
          </div>
          <div className="info-row">
            <span>Member since:</span>
            <strong>{session?.startedAt ? new Date(session.startedAt).toLocaleDateString() : "Today"}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth auth--login">
      <h3>Login</h3>
      <p className="muted">Access your budget planner</p>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••"
        />
        {error && <p className="form__error">{error}</p>}
        <Button className="btn--primary" type="submit">
          Login
        </Button>
      </form>
      <p className="muted" style={{ marginTop: "12px", fontSize: "0.85rem" }}>
        Demo: Use any email and password (6+ chars)
      </p>
    </section>
  );
}
