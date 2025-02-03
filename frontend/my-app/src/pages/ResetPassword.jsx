import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import styles from "./styles/resetPassword.module.css";
import axios from "axios";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [location.search]);

  const handleResetPassword = async () => {
    if (
      password === "" ||
      repeatPassword === "" ||
      password !== repeatPassword
    ) {
      setModalMessage("Passwords do not match");
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/user/update-password",
        {
          email,
          currentPassword: password,
          newPassword: repeatPassword,
        }
      );
      if (response.data === "Password updated success") {
        alert("Password updated successfully")
        navigate("/");
      } else {
        alert("Something went wrong")
      }
    } catch (error) {
      setModalMessage(
        error.response?.data?.msg || "An unexpected error occurred"
      );
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage === "Your password has been reset successfully.") {
      navigate("/");
    }
  };

  return (
    <div>
      <div className={styles.mains}>
        <Navbar />
        <div className={styles.cont}>
          <SideBar />
          <div className={styles.box3}>
            <h2>Reset Password</h2>
            <form className={styles.form1}>
              <div>
                <label>Email</label>
                <input type="email" value={email} disabled />
              </div>
              <div>
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label>Repeat Password</label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>
              <div>
                <button type="button" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
