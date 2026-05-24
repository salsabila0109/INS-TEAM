import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Auth.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const user =
      localStorage.getItem("user");

    if (user) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {

    setEmailError("");
    setPasswordError("");

    // validasi kosong
    if (!email) {
      setEmailError("Email wajib diisi");
    }

    if (!password) {
      setPasswordError("Password wajib diisi");
    }

    if (!email || !password) {
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password,
        }
      );

      const data = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "token",
        data.token
      );

      window.dispatchEvent(
        new Event("storage")
      );
            
      navigate("/");

    } catch (err) {

      console.log(err.response?.data);

      const error =
        err.response?.data?.error;

      const errors =
        err.response?.data?.errors;

      // email tidak ditemukan
      if (
        error ===
        "Email tidak ditemukan"
      ) {
        setEmailError(error);
        return;
      }

      // password salah
      if (
        error ===
        "Password salah"
      ) {
        setPasswordError(error);
        return;
      }

      // express-validator
      if (
        errors &&
        errors.length > 0
      ) {
        errors.forEach((item) => {

          if (
            item.path === "email"
          ) {
            setEmailError(
              item.msg
            );
          }

          if (
            item.path === "password"
          ) {
            setPasswordError(
              item.msg
            );
          }

        });

        return;
      }

      // fallback
      setEmailError(
        error || "Login gagal"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">

        <div className="logo-big">
          🍳
        </div>

        <div className="title-line">
          <span></span>
          <h2>Masuk</h2>
          <span></span>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {emailError && (
          <p className="error-text">
            {emailError}
          </p>
        )}

        <div className="password-box">

          <input
            type={
              show ? "text" : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <span
            className="eye-icon"
            onClick={() =>
              setShow(!show)
            }
          >
            👁
          </span>

        </div>

        {passwordError && (
          <p className="error-text">
            {passwordError}
          </p>
        )}
        <button
          className="btn primary"
          onClick={handleLogin}
        >
          Masuk
        </button>

        <p className="switch">
          Belum punya akun?
          <Link to="/register">
            {" "}
            Daftar
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;