import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Auth.css";
import axios from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // state input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {

    // reset error
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setSuccessMessage("");

    // validasi kosong
    if (!name) {
      setNameError("Nama wajib diisi");
    }

    if (!email) {
      setEmailError("Email wajib diisi");
    }

    if (!password) {
      setPasswordError("Password wajib diisi");
    }

    if (!confirmPassword) {
      setConfirmError("Konfirmasi password wajib diisi");
    }

    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    // validasi password sama
    if (password !== confirmPassword) {
      setConfirmError("Password tidak sama");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/register",
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );

      setSuccessMessage("Register berhasil!");

      // reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {

      if (
        err.response?.data?.error ===
        "Email sudah terdaftar"
      ) {
        setEmailError(
          err.response.data.error
        );
      }

      else if (
        err.response?.data?.error ===
        "Email sudah digunakan"
      ) {
        setEmailError(
          err.response.data.error
        );
      }

      else if (
        err.response?.data?.error ===
        "Password tidak sama"
      ) {
        setConfirmError(
          err.response.data.error
        );
      }

      else {
        setEmailError("Register gagal");
      }

    }
  };

  return (
    <div className="auth-page">
      <div className="auth-right">
        <div className="logo-big">🍳</div>

        <div className="title-line">
          <span></span>
          <h2>Daftar</h2>
          <span></span>
        </div>

        {/* NAMA */}
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {nameError && (
          <p className="error-text">
            {nameError}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p className="error-text">
            {emailError}
          </p>
        )}

        {/* PASSWORD */}
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12C4 7 8 5 12 5C16 5 20 7 22 12C20 17 16 19 12 19C8 19 4 17 2 12Z"
                stroke="#999"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2" />
            </svg>
          </span>
        </div>
                
        {passwordError && (
          <p className="error-text">
            {passwordError}
          </p>
        )}

        {/* KONFIRMASI PASSWORD */}
        <div className="password-box">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12C4 7 8 5 12 5C16 5 20 7 22 12C20 17 16 19 12 19C8 19 4 17 2 12Z"
                stroke="#999"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2" />
            </svg>
          </span>
        </div>

        {confirmError && (
          <p className="error-text">
            {confirmError}
          </p>
        )}

        {successMessage && (
          <p className="success-text">
            {successMessage}
          </p>
        )}

        {/* BUTTON REGISTER */}
        <button className="btn primary" onClick={handleRegister}>
          Daftar
        </button>

        <p className="switch">
          Atau sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;