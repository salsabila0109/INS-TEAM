import "../styles/Navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// IMPORT LOGO
import logoFoodies from "../assets/logo-foodies.png";

function Navbar({
  hideSearch = false,
  searchTerm = "",
  setSearchTerm,
}) {
  const navigate = useNavigate();

  // USER LOGIN
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showPopup, setShowPopup] = useState(false);

  const handleCekDapur = () => {

    if (!user) {
      setShowPopup(true);
      return;
    }

    navigate("/cekdapur");
  };

  // SYNC STORAGE
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <nav className="navbar">

      <div className="navbar-inner">

        {/* LEFT */}
        <div
          className="nav-left"
          onClick={() => navigate("/")}
        >

          <div className="logo">

            {/* LOGO */}
            <img
              src={logoFoodies}
              alt="FoodiesHub"
              className="logo-img"
            />

            {/* TEXT */}
            <span className="logo-text">
              Foodies
              <span className="highlight">
                Hub
              </span>
            </span>

          </div>
        </div>

        {/* SEARCH */}
        {!hideSearch && (
          <div className="nav-center">

            <div className="search-box">
              <input
                type="text"
                placeholder="Cari resep..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm?.(
                    e.target.value
                  )
                }
              />
            </div>

          </div>
        )}

        {/* RIGHT */}
        <div className="nav-right">

          <span
            className="link"
            onClick={() => navigate("/")}
          >
            Resep
          </span>

          <span
            className="link"
            onClick={handleCekDapur}
          >
            Cek Dapur
          </span>

          {user ? (
            <div className="profile-box">

              <img
                src={
                  user?.photo ||
                  "https://via.placeholder.com/150"
                }
                alt="profile"
                className="profile-img"
                onClick={() => navigate("/profile")}
              />

            </div>
          ) : (
            <Link to="/login">

              <button className="btn outline">
                Masuk / Daftar
              </button>

            </Link>
          )}

        </div>

      </div>

      {showPopup && (
        <div className="popup-overlay">

          <div className="popup-box">

            <h3>Login Diperlukan</h3>

            <p>
              Silakan login terlebih dahulu
              untuk mengakses fitur Cek Dapur.
            </p>

            <div className="popup-buttons">

              <button
                className="btn outline"
                onClick={() => setShowPopup(false)}
              >
                Batal
              </button>

              <button
                className="btn primary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </div>

          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;