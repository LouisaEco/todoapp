import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import Alert from "./components/Alert";
import "./App.css";

/*
  App.jsx - Single file version with Login, Signup, Verify, and main app screens.
  FontAwesome icons used for eye / eye-slash (show/hide password).
  Keep this file simple and clear for a beginner.
*/

/* -------------------- Login Form -------------------- */
function LoginForm({ onLogin, switchToSignup, onAlert }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin();
        onAlert("Logged in successfully.", "success");
      } else {
        onAlert(data.message || "Login failed", "error");
      }
    } catch (err) {
      console.error(err);
      onAlert("Server error during login", "error");
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h3 className="text-center mb-3 fw-bold">Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* FontAwesome eye icon */}
            <button
              type="button"
              className="btn btn-sm position-absolute"
              style={{ right: 10, top: "38px", background: "transparent", border: "none" }}
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
            </button>
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <button className="btn btn-link p-0" onClick={switchToSignup}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

/* -------------------- Signup Form -------------------- */
/* Step 1: fill name, email, password, confirm password.
   When signup is submitted: if ok, backend should send verification code to email and response indicates success.
   goToVerify(email) will be called to move to verification screen.
*/
function SignupForm({ switchToLogin, goToVerify, onAlert }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [localError, setLocalError] = useState(""); // quick client-side messages

  useEffect(() => {
    // clear local error if user fixes mismatch
    if (localError && password === confirmPassword) setLocalError("");
  }, [password, confirmPassword, localError]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // client side checks
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      onAlert("Passwords do not match", "error");
      return;
    }

    if (!name.trim() || !email.trim()) {
      onAlert("Please complete all fields", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        onAlert("Signup successful — check your email for a code", "success");
        goToVerify(email);
      } else {
        onAlert(data.message || "Signup failed", "error");
      }
    } catch (err) {
      console.error(err);
      onAlert("Server error during signup", "error");
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h3 className="text-center mb-3 fw-bold">Create Account</h3>

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-sm position-absolute"
              style={{ right: 10, top: "38px", background: "transparent", border: "none" }}
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
            </button>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-sm position-absolute"
              style={{ right: 10, top: "38px", background: "transparent", border: "none" }}
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <i className={showConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
            </button>
          </div>

          {localError && <div className="text-danger mb-2">{localError}</div>}

          <button className="btn btn-success w-100">Sign Up</button>
        </form>

        <p className="text-center mt-3">
          Already registered?{" "}
          <button className="btn btn-link p-0" onClick={switchToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

/* -------------------- Verification Code Form -------------------- */
function VerifyCodeForm({ email, switchToLogin, onAlert }) {
  const [code, setCode] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      onAlert("Enter verification code", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        onAlert("Account verified — now log in", "success");
        switchToLogin();
      } else {
        onAlert(data.message || "Verification failed", "error");
      }
    } catch (err) {
      console.error(err);
      onAlert("Server error during verification", "error");
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h3 className="text-center mb-2 fw-bold">Email Verification</h3>
        <p className="text-muted text-center">A verification code was sent to <b>{email}</b></p>

        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Verification Code</label>
            <input
              className="form-control"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">Verify</button>
        </form>
      </div>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */
function App() {
  // tasks stored locally for now (your backend fetch integration already exists in TaskForm and TaskList)
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [authPage, setAuthPage] = useState("login"); // login | signup | verify
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // alert state used by Alert component
  const [alert, setAlert] = useState({ message: "", type: "error" });

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
      console.error("Failed to save tasks locally", err);
      setAlert({ message: "Failed to save tasks locally", type: "warning" });
    }
  }, [tasks]);

  const goToVerify = (email) => {
    setVerifyEmail(email);
    setAuthPage("verify");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthPage("login");
  };

  // helper to show alert
  const onAlert = (message, type = "error") => setAlert({ message, type });
  const clearAlert = () => setAlert({ message: "", type: "error" });

  // AUTH SCREENS
  if (!isAuthenticated) {
    if (authPage === "login") {
      return (
        <>
          <Alert message={alert.message} type={alert.type} onDismiss={clearAlert} />
          <LoginForm onLogin={() => setIsAuthenticated(true)} switchToSignup={() => setAuthPage("signup")} onAlert={onAlert} />
        </>
      );
    }
    if (authPage === "signup") {
      return (
        <>
          <Alert message={alert.message} type={alert.type} onDismiss={clearAlert} />
          <SignupForm switchToLogin={() => setAuthPage("login")} goToVerify={goToVerify} onAlert={onAlert} />
        </>
      );
    }
    if (authPage === "verify") {
      return (
        <>
          <Alert message={alert.message} type={alert.type} onDismiss={clearAlert} />
          <VerifyCodeForm email={verifyEmail} switchToLogin={() => setAuthPage("login")} onAlert={onAlert} />
        </>
      );
    }
  }

  // MAIN TODO APP (after login)
  return (
    <div className="app-container">
      <Alert message={alert.message} type={alert.type} onDismiss={clearAlert} />
      <Header onLogout={handleLogout} />

      <TaskForm setTasks={setTasks} onAlert={onAlert} />
      <FilterBar />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;
