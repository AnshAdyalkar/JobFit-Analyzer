import React, { useState, useEffect } from "react";
import "../App.css";
import { toast } from "react-toastify";

import {
  signup,
  verifyEmail,
  login,
  requestReset,
  resetPassword
} from "../services/api";

import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  // URL mode handling
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m && ["signup", "login", "reset", "verify", "newPassword"].includes(m)) {
      setMode(m);
    }

    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  // Auto redirect if logged in
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if (mode === "signup") {
        const res = await signup(email, password);
        const verificationUrl = res?.data?.verificationUrl || "";
        const verificationToken = verificationUrl.split("/").pop() || "";
        if (verificationToken) {
          setToken(verificationToken);
          setMode("verify");
          toast.success("Signup successful. Please verify your email to continue.");
        } else {
          toast.success("Signup successful. Please verify email.");
          setMode("login");
        }
      }

      else if (mode === "login") {

        const res = await login(email, password);

        const jwtToken = res?.data?.token;

        if (!jwtToken) {
          toast.error("Login failed");
          return;
        }

        if (remember) {
          localStorage.setItem("token", jwtToken);
        } else {
          sessionStorage.setItem("token", jwtToken);
        }

        localStorage.setItem("lastEmail", email);

        toast.success("Login successful");

        navigate("/");
      }

      else if (mode === "reset") {
        await requestReset(email);
        toast.success("Reset link sent to email");
      }

      else if (mode === "verify") {
        await verifyEmail(token);
        toast.success("Email verified");
        setMode("login");
      }

      else if (mode === "newPassword") {
        await resetPassword(token, newPassword);
        toast.success("Password reset successful");
        setMode("login");
      }

    } catch (err) {

      const msg =
        err.response?.data?.error || "Something went wrong";

      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-card">

        <h2 className="auth-title">

          {mode === "login" && "Welcome Back 👋"}
          {mode === "signup" && "Create Account"}
          {mode === "reset" && "Forgot Password"}
          {mode === "verify" && "Verify Email"}
          {mode === "newPassword" && "Reset Password"}

        </h2>

        <form onSubmit={submit} className="auth-form">

          {(mode === "signup" || mode === "login" || mode === "reset") && (

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>
          )}

          {(mode === "signup" || mode === "login") && (

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>
          )}

          {mode === "login" && (

            <div className="remember-section">

              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <span
                className="link-text"
                onClick={() => setMode("reset")}
              >
                Forgot Password?
              </span>

            </div>
          )}

          {mode === "verify" && (

            <div className="input-group">

              <label>Verification Token</label>

              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />

            </div>
          )}

          {mode === "newPassword" && (

            <>
              <div className="input-group">

                <label>Reset Token</label>

                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />

              </div>

              <div className="input-group">

                <label>New Password</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Submit"}
          </button>

          {mode === "login" && (
            <p className="bottom-text">
              Don’t have an account?
              <span
                className="link-text"
                onClick={() => setMode("signup")}
              >
                Signup
              </span>
            </p>
          )}

          {mode === "signup" && (
            <p className="bottom-text">
              Already have an account?
              <span
                className="link-text"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </p>
          )}

          {mode === "verify" && (
            <p className="bottom-text">
              Back to
              <span
                className="link-text"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </p>
          )}

        </form>
      </div>
    </div>
  );
};

export default Auth;
