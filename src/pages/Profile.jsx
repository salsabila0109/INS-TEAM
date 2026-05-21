import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUtensils,
  faBookmark,
  faUpload,
  faGear,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [myRecipes, setMyRecipes] = useState([]);
  const [activeMenu, setActiveMenu] = useState("profil");

  // =========================
  // UPLOAD FOTO PROFIL
  // =========================
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validasi ukuran max 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Sync navbar
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.log(error);
      alert("Gagal upload foto");
    }
  };

  // =========================
  // GET PROFILE & RESEP
  // =========================
  useEffect(() => {
    const localUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (localUser) {
      setUser(localUser);
    }

    const getProfile = async () => {
      try {
        if (!localUser?.id) return;

        const response = await axios.get(
          `http://localhost:5000/api/profile/${localUser.id}`
        );

        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.log(error);
      }
    };

    const getMyRecipes = async () => {
      try {
        if (!localUser?.id) return;

        const response = await axios.get(
          `http://localhost:5000/api/recipes/user/${localUser.id}`
        );

        setMyRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
    getMyRecipes();
  }, []);

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="profile-page">
        {/* ========================= */}
        {/* SIDEBAR */}
        {/* ========================= */}
        <ProfileSidebar
          user={user}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleUpload={handleUpload}
        />

        {/* ========================= */}
        {/* CONTENT PANEL */}
        {/* ========================= */}
        <main className="content">
          {/* TAB: PROFIL */}
          {activeMenu === "profil" && (
            <section className="fade-in">
              <div className="header-card">
                <div className="card-header-inline">
                  <h2>Profil</h2>

                  <button
                    className="btn-view"
                    onClick={() => navigate("/edit-profil")}
                  >
                    Edit Profil
                  </button>
                </div>

                <div className="profile-details-text">
                  <p>
                    <strong>Nama :</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email :</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Bio :</strong> {user?.bio || "Penjelajah rasa yang hobi memasak"}
                  </p>
                </div>
              </div>

              <div className="header-card" style={{ marginTop: "20px" }}>
                <h3>Informasi Tambahan</h3>
                <p>Bergabung sejak : {formatDate(user?.createdAt)}</p>
                <p>Resep diunggah : {user?.totalRecipes || 0}</p>
              </div>
            </section>
          )}

          {/* TAB: RESEP SAYA */}
          {activeMenu === "resepsaya" && (
            <section className="header-card fade-in">
              <h3 style={{ marginBottom: "20px" }}>Resep Anda</h3>

              <div className="recipe-grid">
                {myRecipes.length > 0 ? (
                  myRecipes.map((recipe) => (
                    <div className="recipe-horizontal-card" key={recipe.id}>
                      <img
                        src={`http://localhost:5000/uploads/${recipe.image}`}
                        alt={recipe.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/140x95";
                        }}
                      />

                      <div className="recipe-details">
                        <div className="recipe-info-text">
                          <h4>{recipe.title}</h4>
                          <span className="rating-badge">
                            <FontAwesomeIcon icon={faStar} /> {recipe.rating || 0}
                          </span>
                        </div>

                        <button
                          className="btn-view"
                          onClick={() => navigate(`/editresep/${recipe.id}`)}
                        >
                          Lihat Resep
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Belum ada resep yang diupload.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;