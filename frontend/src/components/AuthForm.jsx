import { useState } from "react";

export default function AuthForm({ mode, onSubmit, loading }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isRegister ? "Create account" : "Sign in"}</h2>
      {isRegister && (
        <input
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={6}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
      </button>
    </form>
  );
}
