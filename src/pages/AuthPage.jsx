import Login from "../features/auth/Login.jsx";
import Register from "../features/auth/Register.jsx";

export default function AuthPage() {
  return (
    <section className="panel" id="auth">
      <div className="section-header">
        <h2>Mock Auth</h2>
        <span className="section-tag">Optional</span>
      </div>
      <div className="grid-2">
        <Login />
        <Register />
      </div>
    </section>
  );
}
