import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import "../styles/profilDikunjungi.css";

function ProfilDikunjungi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  const [followers, setFollowers] =
    useState(0);

  const [following, setFollowing] =
    useState(0);

  const [isFollowing, setIsFollowing] =
    useState(false);

  // user login
  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    getProfile();
  }, [id]);

  const getProfile = async () => {
    try {
      // ========================
      // PROFILE USER
      // ========================
      const userRes =
        await axios.get(
          `http://localhost:5000/api/profile/${id}`
        );

      setUser(userRes.data);

      // ========================
      // RESEP USER
      // ========================
      const recipeRes =
        await axios.get(
          `http://localhost:5000/api/recipes/user/${id}`
        );

      setRecipes(recipeRes.data);

      // ========================
      // FOLLOW STATS
      // ========================
      const followRes =
        await axios.get(
          `http://localhost:5000/api/follow/stats/${id}`,
          {
            params: {
              currentUserId:
                currentUser?.id,
            },
          }
        );

      setFollowers(
        followRes.data.followers
      );

      setFollowing(
        followRes.data.following
      );

      setIsFollowing(
        followRes.data.isFollowing
      );

    } catch (err) {
      console.log(
        "Error ambil profile:",
        err
      );
    }
  };

  // ========================
  // FOLLOW / UNFOLLOW
  // ========================
  const handleFollow =
    async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/follow/toggle",
          {
            followerId:
              currentUser.id,
            followingId: id,
          }
        );

        // refresh data
        getProfile();

      } catch (err) {
        console.log(
          "Error follow:",
          err
        );
      }
    };

  // ========================
  // SEARCH RECIPE
  // ========================
  const filteredRecipes =
    recipes.filter((recipe) =>
      recipe.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (!user)
    return <p>Loading...</p>;

  return (
    <>
      {/* NAVBAR */}
      <Navbar hideSearch={true} />

      <div className="visited-profile-wrapper">

        {/* BACK BUTTON */}
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ‹ Kembali
        </button>

        <div className="visited-profile">

          {/* =======================
              SIDEBAR PROFILE
          ======================= */}
          <div className="profile-card">

            {user.photo ? (
              <img
                src={
                  user.photo.startsWith(
                    "http"
                  )
                    ? user.photo
                    : `http://localhost:5000/uploads/${user.photo}`
                }
                alt={user.name}
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo"></div>
            )}

            <h2>{user.name}</h2>
            <p>{user.email}</p>

            {/* FOLLOW STATS */}
            <div className="stats">

              <div>
                <strong>
                  {followers}
                </strong>
                <p>Pengikut</p>
              </div>

              <div>
                <strong>
                  {following}
                </strong>
                <p>Mengikuti</p>
              </div>

            </div>

            {/* BUTTON FOLLOW */}
            {currentUser?.id !==
              Number(id) && (
              <button
                className="follow-btn"
                onClick={
                  handleFollow
                }
              >
                {isFollowing
                  ? "Berhenti Mengikuti"
                  : "Ikuti"}
              </button>
            )}

            {/* BIO */}
            <div className="bio-box">
              {user.bio ||
                "Belum ada bio"}
            </div>

          </div>

          {/* =======================
              RECIPE SECTION
          ======================= */}
          <div className="recipe-section">

            {/* HEADER */}
            <div className="header-card">
              <div className="card-header-inline">
                <h2>
                  Resep (
                  {
                    filteredRecipes.length
                  }
                  )
                </h2>
              </div>
            </div>

            {/* SEARCH */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari resep..."
                value={search}
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            {/* GRID RECIPE */}
            <div className="recipe-grid">
              {filteredRecipes.length >
              0 ? (
                filteredRecipes.map(
                  (item) => (
                    <RecipeCard
                      key={item.id}
                      data={item}
                    />
                  )
                )
              ) : (
                <p>
                  Resep tidak
                  ditemukan
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilDikunjungi;