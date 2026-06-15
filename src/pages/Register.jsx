import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Auth.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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

    // validasi kosong frontend
    if (!name) {
      setNameError(
        "Nama wajib diisi"
      );
    }
    
    // VALIDASI PANJANG NAMA
    if (name.length > 50) {
      setNameError("Nama maksimal 50 karakter");
      return;
    }

    if (!email) {
      setEmailError(
        "Email wajib diisi"
      );
    }

    // VALIDASI EMAIL
    if (email.length > 120) {
      setEmailError("Email maksimal 120 karakter");
      return;
    }

    if (!password) {
      setPasswordError(
        "Password wajib diisi"
      );
    }

    if (!confirmPassword) {
      setConfirmError(
        "Konfirmasi password wajib diisi"
      );
    }

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return;
    }

    // password tidak sama
    if (
      password !==
      confirmPassword
    ) {
      setConfirmError(
        "Password tidak sama"
      );
      return;
    }

    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/register",
          {
            name,
            email,
            password,
            confirmPassword,
          }
        );

      setSuccessMessage(
        "Register berhasil!"
      );

      // reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {

      console.log(
        err.response?.data
      );

      const error =
        err.response?.data?.error;

      const errors =
        err.response?.data?.errors;

      // email sudah ada
      if (
        error ===
          "Email sudah terdaftar" ||
        error ===
          "Email sudah digunakan"
      ) {
        setEmailError(
          error
        );
        return;
      }

      // password tidak sama
      if (
        error ===
        "Password tidak sama"
      ) {
        setConfirmError(
          error
        );
        return;
      }

      // express-validator
      if (
        errors &&
        errors.length > 0
      ) {

        errors.forEach(
          (item) => {

            if (
              item.path ===
              "name"
            ) {
              setNameError(
                item.msg
              );
            }

            if (
              item.path ===
              "email"
            ) {
              setEmailError(
                item.msg
              );
            }

            if (
              item.path ===
              "password"
            ) {
              setPasswordError(
                item.msg
              );
            }

            if (
              item.path ===
              "confirmPassword"
            ) {
              setConfirmError(
                item.msg
              );
            }

          }
        );

        return;
      }

      // fallback
      setEmailError(
        error ||
        "Register gagal"
      );
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
          maxLength={50}
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
          maxLength={120}
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
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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
            <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
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