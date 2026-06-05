import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import "../styles/profilDikunjungi.css";

function ProfilDikunjungi() {
  const { id } = useParams();

  const [user, setUser] =
    useState(null);

  const [recipes, setRecipes] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    getProfile();
  }, [id]);

  const getProfile =
    async () => {
      try {
        // ambil data user
        const userRes =
          await axios.get(
            `http://localhost:5000/api/profile/${id}`
          );

        setUser(userRes.data);

        // ambil resep user
        const recipeRes =
          await axios.get(
            `http://localhost:5000/api/recipes/user/${id}`
          );

        setRecipes(
          recipeRes.data
        );

      } catch (err) {
        console.log(err);
      }
    };

  // filter pencarian
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
        {/* NAVBAR SAMA SEPERTI PROFILE PAGE */}
        <Navbar hideSearch={true} />

        <div className="visited-profile">

        {/* SIDEBAR PROFILE */}
        <div className="profile-card">

            {user.photo ? (
            <img
                src={
                user.photo.startsWith("http")
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

            <div className="stats">
            <span>{recipes.length} Resep</span>
            </div>

            <div className="bio-box">
            {user.bio || "Belum ada bio"}
            </div>

        </div>

        {/* RESEP SECTION */}
        <div className="recipe-section">

            {/* HEADER SAMA STYLE PROFILE PAGE */}
            <div className="header-card">
            <div className="card-header-inline">
                <h2>
                Resep ({filteredRecipes.length})
                </h2>
            </div>
            </div>

            {/* SEARCH (SAMA STYLE NAVBAR PROFILE PAGE) */}
            <div className="search-box">
            <input
                type="text"
                placeholder="Cari resep..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>

            {/* GRID */}
            <div className="recipe-grid">
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((item) => (
                <RecipeCard key={item.id} data={item} />
                ))
            ) : (
                <p>Resep tidak ditemukan</p>
            )}
            </div>

        </div>

        </div>
    </>
    );
}

export default ProfilDikunjungi;