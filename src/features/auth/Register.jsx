import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/toastCore.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function Register() {
  const { register, isAuthenticated, user, session } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = register(form.name, form.email, form.password);
    if (result.success) {
      toast.success("Registration successful! Welcome aboard!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } else {
      setError(result.error);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="auth auth--register">
        <h3>Account created!</h3>
        <p className="muted">Welcome, {user.name}!</p>
        <div className="auth-info">
          <p>Your account has been successfully created and you're now logged in.</p>
          <div className="info-row">
            <span>Session started:</span>
            <strong>{session?.startedAt ? new Date(session.startedAt).toLocaleDateString() : "Today"}</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth auth--register">
      <h3>Register</h3>
      <p className="muted">Create your account</p>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ram Sharma"
        />
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
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="••••••"
        />
        {error && <p className="form__error">{error}</p>}
        <Button className="btn--primary" type="submit">
          Register
        </Button>
      </form>
    </section>
  );
}
