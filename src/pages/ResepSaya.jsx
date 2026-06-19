import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/ResepSaya.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFollow } from "../context/FollowContext";

function ResepSaya() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [activeMenu, setActiveMenu] = useState("resepsaya");
  const { followers, following } = useFollow();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const getMyRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recipes/user/${user.id}`
        );

        setRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.id) {getMyRecipes();}
  }, []);

  // Upload foto profil
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      console.log(error);
      alert("Gagal upload foto");
    }
  };

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="profile-page">
        <ProfileSidebar
          user={user}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleUpload={handleUpload}
          followers={followers}
          following={following}
        />

        <div className="content">
          <div className="title-card">
            <h2>Resep Saya</h2>
            <p>
              Daftar resep yang
              telah anda unggah
            </p>
          </div>

          <div className="my-recipe-list">
            {recipes.map((resep) => (
              <div
                className="my-recipe-card"
                key={resep.id}
              >
                <img
                  src={resep.image}
                  alt={resep.title}
                  className="my-recipe-img"
                />

                <div className="my-recipe-info">
                  <div className="my-recipe-text">
                    <h4>
                      {resep.title}
                    </h4>

                    <p>
                      {resep.description?.substring(
                        0,
                        70
                      )}
                      ...
                    </p>

                    <span className="my-recipe-rating">
                      ⭐{" "}
                      {resep.rating ||
                        0}
                    </span>
                  </div>

                  <div className="my-recipe-actions">
                    <button
                      className="my-btn-sunting"
                      onClick={() =>
                        navigate(
                          `/edit-resep/${resep.id}`
                        )
                      }
                    >
                      Sunting
                    </button>

                    <button
                      className="my-btn-lihat"
                      onClick={() =>
                        navigate(
                          `/lihat-resep-saya/${resep.id}`
                        )
                      }
                    >
                      Lihat Resep
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResepSaya;