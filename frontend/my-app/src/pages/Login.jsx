import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./styles/login.module.css";
import { toggleForm, loginUser, signupUser } from "../redux/action";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showLogin, isLoading, isError, token } = useSelector(
    (state) => state
  );
  const [load, setLoad] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
    let res = await dispatch(loginUser(email, password));
    if (res === "Login success") {
      navigate("/Dashboard");
    }
  };

  const handleSignup = () => {
    if (!email || !password || !resetPassword) {
      alert("Please fill all fields!");
      return;
    }
    if (password !== resetPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(signupUser(email, password, resetPassword));
  };

  const handleResetPasswordClick = () => {
    setIsModalOpen(true);
  };

  const handleResetPasswordCancel = () => {
    setIsModalOpen(false);
  };

  const handleResetPasswordRequest = async () => {
    if (!resetEmail) {
      alert("Please enter your email id!");
      return;
    }
    setLoad(true);
    try {
      const response = await fetch("http://localhost:8080/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      const result = await response.text();
      if (response.ok) {
        alert("Reset password email sent successfully!");
      } else {
        alert("Error sending email: " + result);
      }
    } catch (error) {
      alert("Failed to send email: " + error.message);
    }
    setIsModalOpen(false);
  };

  return (
    <div className={styles.main}>
      <>
        {/* Login Form */}
        <div
          className={`${styles.box1} ${
            showLogin ? styles.active : styles.inactive
          }`}
        >
          <div className={styles.form}>
            <div className={styles.header}>
              <img
                src="https://s3-alpha-sig.figma.com/img/d59b/e01f/869311531ee26032e175620e2d0b5059?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j~Tf~IY5yO0R~kHxm635hlPX5H4VUMJ-ARaGX4JsMH-bxejS2-yKQOiFhdc2j2kwTmB8YtEiMs6olPRfdNyxNzegajnxZzNzWtBC~qvvnv53fvvNOaNIXPwCibsxRohWMgtAmfPCLGcMbjHFVynCS-IDOK6jOpB1LIHzEoSppFVZXSJ27u7INJaKWORhVEe9b4RFVJ2AC-K5XVcD83w01woy4sWg9pDE0~RphkV92yjExZ7zVQdZ97NwSNkdwIn8PTdxytJnayUDGfwfZoDkvZcKwbxi2L3wuHOie0v3gIMQpcBxvS8MkcMbTmUWy-eZY~AbDUFUuTq8ibICm5sXuA__"
                alt=""
              />
              <p>Welcome to TableSprint admin</p>
            </div>
            <form>
              <label className={styles.label}>Email-id</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
            <a href="#" onClick={handleResetPasswordClick}>
              Forgot password?
            </a>
            <button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Loading..." : "Log In"}
            </button>
            {isError && <p className={styles.error}>Login failed</p>}
            <p className={styles.redirect}>
              {" "}
              Don't have an account?{" "}
              <span onClick={() => dispatch(toggleForm())}>Sign Up</span>{" "}
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <div
          className={`${styles.box2} ${
            !showLogin ? styles.active : styles.inactive
          }`}
        >
          <div className={styles.form}>
            <div className={styles.header}>
              <img
                src="https://s3-alpha-sig.figma.com/img/d59b/e01f/869311531ee26032e175620e2d0b5059?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j~Tf~IY5yO0R~kHxm635hlPX5H4VUMJ-ARaGX4JsMH-bxejS2-yKQOiFhdc2j2kwTmB8YtEiMs6olPRfdNyxNzegajnxZzNzWtBC~qvvnv53fvvNOaNIXPwCibsxRohWMgtAmfPCLGcMbjHFVynCS-IDOK6jOpB1LIHzEoSppFVZXSJ27u7INJaKWORhVEe9b4RFVJ2AC-K5XVcD83w01woy4sWg9pDE0~RphkV92yjExZ7zVQdZ97NwSNkdwIn8PTdxytJnayUDGfwfZoDkvZcKwbxi2L3wuHOie0v3gIMQpcBxvS8MkcMbTmUWy-eZY~AbDUFUuTq8ibICm5sXuA__"
                alt=""
              />
              <p>Welcome to TableSprint admin</p>
            </div>
            <form>
              <label className={styles.label}>Email-id</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className={styles.repeat}>Repeat Password</label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </form>
            <button onClick={handleSignup} disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
            {isError && <p className={styles.error}>Signup failed</p>}
            <p className={styles.redirect}>
              {" "}
              Already have an account?{" "}
              <span onClick={() => dispatch(toggleForm())}>Log In</span>{" "}
            </p>
          </div>
        </div>

        {/* Reset Password Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Reset Password</h2>
              <p>Share your email id to send reset password link</p>
              <input
                type="email"
                placeholder="Enter your Email id"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <div className={styles.modalButtons}>
                <button
                  className={styles.cancelButton}
                  onClick={handleResetPasswordCancel}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleResetPasswordRequest}
                >
                  {load ? "Request reset link..." : "Request reset link"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default Login;
