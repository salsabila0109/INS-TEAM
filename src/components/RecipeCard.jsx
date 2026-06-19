import "../styles/RecipeCard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

function RecipeCard({ data }) {
  const navigate =
    useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [isSaved, setIsSaved] =
    useState(false);

  const [loadingBookmark, setLoadingBookmark] =
    useState(false);

  // =========================
  // CEK APAKAH SUDAH DISIMPAN
  // =========================
  useEffect(() => {
    const checkSaved =
      async () => {
        try {
          if (!user?.id) return;

          const response =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/saved-recipes/check/${user.id}/${data.id}`
            );

          setIsSaved(
            response.data.saved
          );
        } catch (error) {
          console.log(
            "Gagal cek bookmark:",
            error
          );
        }
      };

    checkSaved();
  }, [data.id, user?.id]);

  // =========================
  // BOOKMARK TOGGLE
  // =========================
  const handleBookmark =
    async () => {
      try {
        if (!user?.id) return;

        setLoadingBookmark(
          true
        );

        const response =
          await axios.post(
             `${import.meta.env.VITE_API_URL}/api/saved-recipes`,
            {
              userId:
                user.id,
              recipeId:
                data.id,
            }
          );

        // update icon
        setIsSaved(
          response.data.saved
        );
      } catch (error) {
        console.log(error);

        alert(
          "Gagal menyimpan resep"
        );
      } finally {
        setLoadingBookmark(
          false
        );
      }
    };

  return (
    <div className="card">
      {/* IMAGE */}
      <div className="image">
        <img
          src={data.image}
          alt={data.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300";
          }}
        />
      </div>

      <div className="content">
        {/* META */}
        <div className="meta">
          {/* AUTHOR */}
          <span className="author">
            👤{" "}
            {data.User?.name ||
              "User"}
          </span>

          {/* RATING + BOOKMARK */}
          <div className="right-meta">
            <span className="rating">
              {data.totalReviews >
              0 ? (
                <>
                  ⭐{" "}
                  {data.rating} (
                  {
                    data.totalReviews
                  }
                  )
                </>
              ) : (
                <>
                  ⭐ 0.0 (0)
                </>
              )}
            </span>

            {/* BOOKMARK HANYA SAAT LOGIN */}
            {user && (
              <span
                className={`bookmark-icon ${
                  isSaved
                    ? "saved"
                    : ""
                }`}
                onClick={
                  !loadingBookmark
                    ? handleBookmark
                    : undefined
                }
              >
                {isSaved ? (
                  <FaBookmark />
                ) : (
                  <FaRegBookmark />
                )}
              </span>
            )}
          </div>
        </div>

        {/* TITLE */}
        <h3>
          {data.title}
        </h3>

        {/* BUTTON */}
        <button
          className="btn outline small"
          onClick={() =>
            navigate(
              `/detailresep/${data.id}`
            )
          }
        >
          Lihat Resep
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;