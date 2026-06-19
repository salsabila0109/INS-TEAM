import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/ResepSaya.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFollow } from "../context/FollowContext";

function ResepTersimpan() {
  const navigate = useNavigate();

  const [savedRecipes, setSavedRecipes] =
    useState([]);

  const [activeMenu] =
    useState("tersimpan");

  const { followers, following } = useFollow();
      
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // AMBIL RESEP TERSIMPAN DARI DATABASE
  useEffect(() => {
    const getSavedRecipes =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/saved-recipes/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setSavedRecipes(
            response.data
          );
        } catch (error) {
          console.log(error);
        }
      };

    if (user?.id) {
      getSavedRecipes();
    }
  }, [user?.id]);

  // HAPUS BOOKMARK
  const handleRemove =
    async (recipeId) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/saved-recipes/${recipeId}/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // update UI tanpa refresh
        setSavedRecipes(
          savedRecipes.filter(
            (item) =>
              item.id !==
              recipeId
          )
        );
      } catch (error) {
        console.log(error);
        alert(
          "Gagal menghapus resep"
        );
      }
    };

  // Upload foto profil
  const handleUpload =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "photo",
        file
      );

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/profile/${user.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const updatedUser =
          response.data.user;

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        window.dispatchEvent(
          new Event("storage")
        );
      } catch (error) {
        console.log(error);
        alert(
          "Gagal upload foto"
        );
      }
    };

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="profile-page">
        <ProfileSidebar
          user={user}
          activeMenu={activeMenu}
          handleUpload={handleUpload}
          followers={followers}
          following={following}
        />

        <div className="content">
          <div className="title-card">
            <h2>
              Resep yang
              Disimpan
            </h2>
          </div>

          <div className="my-recipe-list">
            {savedRecipes.length >
            0 ? (
              savedRecipes.map(
                (resep) => (
                  <div
                    className="my-recipe-card"
                    key={
                      resep.id
                    }
                  >
                    <img
                      src={resep.image}
                      alt={
                        resep.title
                      }
                      className="my-recipe-img"
                    />

                    <div className="my-recipe-info">
                      <div className="my-recipe-text">
                        <h4>
                          {
                            resep.title
                          }
                        </h4>

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
                            handleRemove(
                              resep.id
                            )
                          }
                        >
                          Hapus
                        </button>

                        <button
                          className="my-btn-lihat"
                          onClick={() =>
                            navigate(
                              `/detailresep/${resep.id}`
                            )
                          }
                        >
                          Lihat
                          Resep
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <p>
                Belum ada resep
                yang disimpan
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResepTersimpan;