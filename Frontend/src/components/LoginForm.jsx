import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Modal } from "antd";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting login:", formData);

    fetch("http://localhost:3001/api/v1/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⬅️ This is correct for cookie-based auth
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }
          return data;
        });
      })
      .then((data) => {
        console.log("Login successful. Admin data:", data.data.admin);
        setAdmin(data.data.admin);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        showError(error.message || "Server error during login.");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      {/* Error Modal */}
      <Modal
        title={
          <span style={{ color: '#ff4d4f' }}>
            ⚠️ Login Error
          </span>
        }
        open={showErrorModal}
        onOk={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
        centered
        footer={[
          <button
            key="ok"
            onClick={() => setShowErrorModal(false)}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        ]}
      >
        <div style={{ color: '#ff4d4f', fontSize: '16px', marginTop: '10px' }}>
          {errorMessage}
        </div>
      </Modal>
    </>
  );
}