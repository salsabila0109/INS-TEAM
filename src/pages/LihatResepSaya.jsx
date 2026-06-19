import React, {useEffect, useState,} from "react";
import {useParams, useNavigate,} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {FaUserCircle, FaRegBookmark, FaBookmark, FaShareAlt, FaTrash, FaEdit,} from "react-icons/fa";
import "../styles/DetailResep.css";

function LihatResepSaya() {
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate =
    useNavigate();

  const [recipe, setRecipe] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [isSaved, setIsSaved] =
    useState(false);

  const [reviews, setReviews] =
    useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const getReviews =
    async () => {
      try {
        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/reviews/${id}`
          );

        setReviews(
          res.data
        );
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    const getRecipeDetail =
      async () => {
        try {
          const res =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/recipes/${id}`
            );

          setRecipe(
            res.data
          );

          // cek bookmark
          if (user?.id) {
            const savedRes =
              await axios.get(
                `${import.meta.env.VITE_API_URL}/api/saved-recipes/check/${user.id}/${id}`
              );

            setIsSaved(
              savedRes.data.saved
            );
          }
        } catch (err) {
          console.error(
            "Gagal memuat:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    getRecipeDetail();
    getReviews();
  }, [id]);

  const handleBookmark = async () => {
    try {
      if (!user?.id) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/saved-recipes`,
        {
          userId: user.id,
          recipeId: id,
        }
      );

      setIsSaved(response.data.saved);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan resep");
    }
  };

  const handleShare =
    async () => {
      const recipeUrl =
        `${window.location.origin}/detailresep/${id}`;

      try {
        if (
          navigator.share
        ) {
          await navigator.share({
            title:
              recipe.title,
            text:
              `Lihat resep ${recipe.title}`,
            url: recipeUrl,
          });
        } else {
          await navigator.clipboard.writeText(
            recipeUrl
          );

          alert(
            "Link resep berhasil disalin!"
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDelete = async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setShowDeleteModal(false);

        navigate("/resepsaya");
      } catch (error) {
        console.log(error);
        alert("Gagal menghapus resep");
      }
    };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="foodies-spinner"></div>
        <p>Memuat...</p>
      </div>
    );
  }

  if (!recipe)
    return (
      <div>
        Resep tidak ditemukan
      </div>
    );

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="detail-page">
        <div className="detail-container">

          {/* HEADER */}
          <div className="title-section">
            <h1
              onClick={() =>
                navigate(-1)
              }
              className="recipe-title"
            >
              ‹ {recipe.title}
            </h1>

            <p className="recipe-rating">
              ⭐ {recipe.rating || 0} &nbsp;
              (
              {recipe.totalReviews || 0}
              Penilaian)
            </p>
          </div>

          {/* HERO */}
          <section className="hero-section">
            <div className="image-frame">
              <img
                src={recipe.image}
                alt={recipe.title}
              />
            </div>

            <div className="description-card">
              <p>
                {recipe.description}
              </p>

              <div className="recipe-actions">

                {/* BOOKMARK */}
                <span
                  onClick={
                    handleBookmark
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                >
                  {isSaved ? (
                    <FaBookmark
                      color="#C94C4C"
                    />
                  ) : (
                    <FaRegBookmark />
                  )}
                </span>

                {/* SHARE */}
                <span
                  onClick={
                    handleShare
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                >
                  <FaShareAlt />
                </span>
              </div>
            </div>
          </section>

          {/* MAIN */}
          <main className="main-content-grid">
            <div className="content-card">
              <h3>
                Bahan-Bahan
              </h3>

              <ul>
                {recipe.ingredients?.map(
                  (ing, i) => (
                    <li key={i}>
                      {ing}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="content-card steps-card">
              <h3>
                Langkah-Langkah
              </h3>

              {recipe.steps?.map(
                (step, i) => (
                  <div
                    key={i}
                    className="step-item"
                  >
                    <p>
                      <strong>
                        {i + 1}.
                      </strong>{" "}
                      {step.text}
                    </p>

                    <div className="step-images">
                      {step.images?.map(
                        (
                          img,
                          idx
                        ) => (
                          <img
                            key={idx}
                            src={img}
                            alt="step"
                          />
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </main>

    <div className="recipe-owner-actions">
        <button
            className="my-btn-edit-recipe"
            onClick={() =>
            navigate(
                `/edit-resep/${recipe.id}`
            )
            }
        >
            <FaEdit />
            Edit
        </button>

        <button
            className="my-btn-delete-recipe"
            onClick={() => setShowDeleteModal(true)}
        >
            <FaTrash />
            Hapus
        </button>
        </div>
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Hapus Resep?</h3>
              <p>Apakah kamu yakin ingin menghapus resep ini? Tindakan ini tidak bisa dibatalkan.</p>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>

                <button
                  className="btn-delete"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
          {/* KOMENTAR */}
          <section className="review-list">
            <h3>
              Komentar Pengguna
            </h3>

            {reviews.length > 0 ? (
              reviews.map((item) => (
                <div
                  key={item.id}
                  className="review-card"
                >
                  <div className="review-photo">
                    {item.User?.photo ? (
                      <img
                        src={item.User.photo}
                        alt="profile"
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>

                  <div className="review-content">
                    <div className="review-header">
                      <div>
                        <h4>
                          {
                            item.User
                              ?.name
                          }
                        </h4>

                        <span className="review-date">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month:
                                "long",
                              year:
                                "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="review-stars">
                      {"⭐".repeat(
                        item.rating
                      )}
                    </div>

                    <p className="review-comment">
                      {
                        item.comment
                      }
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>
                Belum ada review
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default LihatResepSaya;