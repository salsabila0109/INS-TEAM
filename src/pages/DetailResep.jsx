import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaRegBookmark, FaBookmark, FaShareAlt, FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/detailresep.css";

function DetailResep() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const getReviews =
    async () => {
      try {
        const res =
          await axios.get(
            `http://localhost:5000/api/reviews/${id}`
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
              `http://localhost:5000/api/recipes/${id}`
            );

          setRecipe(res.data);

          // cek bookmark
          if (user?.id) {
            const savedRes =
              await axios.get(
                `http://localhost:5000/api/saved-recipes/check/${user.id}/${id}`
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

  if (loading)
    return <div>Memuat...</div>;

  if (!recipe)
    return <div>Resep tidak ditemukan</div>;

  const handleBookmark =
    async () => {
      try {
        if (!user) {
          alert(
            "Silakan login terlebih dahulu"
          );
          return;
        }

        const response =
          await axios.post(
            "http://localhost:5000/api/saved-recipes",
            {
              userId: user.id,
              recipeId: id,
            }
          );

        setIsSaved(
          response.data.saved
        );

        alert(
          response.data.message
        );
      } catch (error) {
        console.log(error);
        alert(
          "Gagal menyimpan resep"
        );
      }
    };

  const handleReview =
    async () => {
      try {
        if (!user) {
          alert(
            "Silakan login terlebih dahulu"
          );
          return;
        }

        if (!rating) {
          alert(
            "Pilih rating terlebih dahulu"
          );
          return;
        }

        await axios.post(
          "http://localhost:5000/api/reviews",
          {
            userId:
              user.id,
            recipeId: id,
            rating,
            comment,
          }
        );

        alert(
          "Review berhasil dikirim"
        );

        // refresh review
        getReviews();

        // reset form
        setRating(0);
        setComment("");

      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Gagal memberi review"
        );
      }
    };
        
  const handleShare =
    async () => {
      const recipeUrl =
        `${window.location.origin}/detailresep/${id}`;

      try {
        // mobile browser
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
          // desktop
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
        
  return (
    <>
      <Navbar hideSearch={true} />

      <div className="detail-page">
        <div className="detail-container">

          {/* Header */}
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
              ⭐ {recipe.rating || 0} (
              {recipe.totalReviews || 0} Penilaian)
            </p>
          </div>

          {/* Hero */}
          <section className="hero-section">
            <div className="image-frame">
              <img
                src={`http://localhost:5000/uploads/${recipe.image}`}
                alt={recipe.title}
              />
            </div>

            <div className="description-card">
            <div
              className="author-info"
              onClick={() =>
                navigate(`/profil-dikunjungi/${recipe.User?.id}`)
              }
            >
              <div className="author-avatar">
                {recipe.User?.photo ? (
                  <img
                    src={
                      recipe.User.photo.startsWith("http")
                        ? recipe.User.photo
                        : `http://localhost:5000/uploads/${recipe.User.photo}`
                    }
                    alt="user"
                  />
                ) : (
                  <FaUserCircle />
                )}
              </div>

              <span>{recipe.User?.name}</span>
            </div>

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
                    cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                >
                  <FaShareAlt />
                </span>

              </div>
            </div>
          </section>

          {/* Main */}
          <main className="main-content-grid">
            <div className="content-card">
              <div className="section-header">
                <h3>Bahan-Bahan</h3>

                <div className="portion-info">
                  <FaUserCircle className="portion-icon" />
                  <span>{recipe.serving || "1"} Porsi</span>
                </div>
              </div>

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
                            src={`http://localhost:5000/uploads/${img}`}
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

          {/* Komentar */}
          <section className="rating-area">
            <h3>
              Yuk rating resep ini!
            </h3>

            <div className="stars-input">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <span
                    key={star}
                    onClick={() =>
                      user &&
                      setRating(star)
                    }
                    onMouseEnter={() =>
                      setHover(star)
                    }
                    onMouseLeave={() =>
                      setHover(0)
                    }
                    style={{
                      fontSize: "32px",
                      cursor: user
                        ? "pointer"
                        : "not-allowed",
                      color:
                        star <=
                        (hover ||
                          rating)
                          ? "#FFD700"
                          : "#ccc",
                      transition:
                        "0.2s",
                    }}
                  >
                    ★
                  </span>
                )
              )}
            </div>

            <div className="comment-area">
              <div className="comment-box">

                {/* Foto Profil User */}
                <div className="comment-user-photo">
                  {user?.photo ? (
                  <img
                    src={
                      user.photo?.startsWith("http")
                        ? user.photo
                        : `http://localhost:5000/uploads/${user.photo}`
                    }
                    alt="profile"
                  />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>

                {/* Input */}
                <div className="comment-input-wrapper">
                  <input
                    type="text"
                    placeholder={
                      user
                        ? "Berikan komentar..."
                        : "Login untuk memberi komentar"
                    }
                    value={comment}
                    disabled={!user}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                  />

                  <FaPaperPlane
                    className="send-icon"
                    onClick={handleReview}
                    style={{
                      cursor: user
                        ? "pointer"
                        : "not-allowed",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="review-list">
            <h3>Komentar Pengguna</h3>

            {reviews.length > 0 ? (
              reviews.map((item) => (
                <div
                  key={item.id}
                  className="review-card"
                >
                  {/* kiri foto */}
                <div className="review-photo">
                  {item.User?.photo ? (
                    <img
                      src={item.User.photo.startsWith("http")
                        ? item.User.photo
                        : `http://localhost:5000/uploads/${item.User.photo}`
                      }
                      alt="profile"
                    />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>

                  {/* kanan isi */}
                  <div className="review-content">

                    {/* nama & tanggal */}
                    <div className="review-header">
                      <div>
                        <h4>
                          {item.User?.name}
                        </h4>

                        <span className="review-date">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* rating */}
                    <div className="review-stars">
                      {"⭐".repeat(
                        item.rating
                      )}
                    </div>

                    {/* komentar */}
                    <p className="review-comment">
                      {item.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Belum ada review</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default DetailResep;