import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUtensils,
  faBookmark,
  faUpload,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProfileSidebar({
  user,
  activeMenu,
  handleUpload,
  followers = 0,
  following = 0,
}) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <aside className="sidebar">

      {/* FOTO PROFIL */}
      <div className="avatar-wrapper">
        {user?.photo && !imgError ? (
          <img
            src={user.photo}
            alt="profile"
            className="avatar"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="avatar-fallback">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
      </div>

      {/* INFO USER */}
      <h3>
        {user?.name ||
          "User Foodies"}
      </h3>

      <p className="email">
        {user?.email ||
          "email@example.com"}
      </p>

      {/* FOLLOW INFO */}
      <div className="follow-stats">

        <div
          onClick={() =>
            navigate("/followers")
          }
          style={{
            cursor: "pointer",
          }}
        >
          <strong>{Number(followers) || 0}</strong>

          <span>
            pengikut
          </span>
        </div>

        <div
          onClick={() =>
            navigate("/following")
          }
          style={{
            cursor: "pointer",
          }}
        >
          <strong>{Number(following) || 0}</strong>
          <span>
            mengikuti
          </span>
        </div>

      </div>

      {/* MENU */}
      <nav className="menu">

        <button
          className={
            activeMenu === "profil"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/profile")
          }
        >
          <FontAwesomeIcon icon={faUser} />
          Profil
        </button>

        <button
          className={
            activeMenu === "resepsaya"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/resepsaya")
          }
        >
          <FontAwesomeIcon icon={faUtensils} />
          Resep Saya
        </button>

        <button
          className={
            activeMenu === "tersimpan"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/reseptersimpan")
          }
        >
          <FontAwesomeIcon icon={faBookmark} />
          Resep Tersimpan
        </button>

        <button
          onClick={() =>
            navigate("/uploadresep")
          }
        >
          <FontAwesomeIcon icon={faUpload} />
          Upload Resep
        </button>

        <button
          className={
            activeMenu === "pengaturan"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/pengaturan")
          }
        >
          <FontAwesomeIcon icon={faGear} />
          Pengaturan
        </button>

      </nav>
    </aside>
  );
}

export default ProfileSidebar;