import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUtensils,
  faBookmark,
  faUpload,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ProfileSidebar({
  user,
  activeMenu,
  handleUpload,
}) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* FOTO PROFIL */}
      <label
        htmlFor="upload"
        className="avatar-wrapper"
      >
        <img
          src={
            user?.photo ||
            "https://via.placeholder.com/150"
          }
          alt="profile"
          className="avatar"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/150";
          }}
        />

        <div className="upload-overlay">
          Ganti Foto
        </div>
      </label>

      <input
        id="upload"
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />

      {/* INFO USER */}
      <h3>{user?.name || "User Foodies"}</h3>

      <p className="email">
        {user?.email ||
          "email@example.com"}
      </p>

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
          <FontAwesomeIcon
            icon={faUser}
          />{" "}
          Profil
        </button>

        <button
          className={
            activeMenu ===
            "resepsaya"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate(
              "/resepsaya"
            )
          }
        >
          <FontAwesomeIcon
            icon={faUtensils}
          />{" "}
          Resep Saya
        </button>

        <button
          className={
            activeMenu ===
            "tersimpan"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate(
              "/reseptersimpan"
            )
          }
        >
          <FontAwesomeIcon
            icon={faBookmark}
          />{" "}
          Resep Tersimpan
        </button>

        <button
          onClick={() =>
            navigate(
              "/uploadresep"
            )
          }
        >
          <FontAwesomeIcon
            icon={faUpload}
          />{" "}
          Upload Resep
        </button>

        <button
        className={
            activeMenu ===
            "pengaturan"
            ? "active"
            : ""
        }
        onClick={() =>
            navigate("/pengaturan")
        }
        >
        <FontAwesomeIcon
            icon={faGear}
        />{" "}
        Pengaturan
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSidebar;