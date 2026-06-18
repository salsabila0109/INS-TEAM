import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import "../styles/Home.css";

function Home() {
  const [recipes, setRecipes] =
    useState([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Semua");

  const [loading, setLoading] =
    useState(true);

  // SEARCH STATE
  const [searchTerm, setSearchTerm] =
    useState("");

  const isAllCategory = activeCategory === "Semua";

  const filteredRecipes = recipes
    .filter((item) => {
      let categoryMatch = false;

      if (activeCategory === "Semua") {
        categoryMatch = true;
      } else if (activeCategory === "Populer") {
        const avgRating = item.averageRating || 0;
        const totalReviews = item.totalReviews || 0;

        categoryMatch = avgRating >= 4 && totalReviews >= 5;
      } else {
        categoryMatch =
          item.category?.toLowerCase() === activeCategory.toLowerCase();
      }

      const searchMatch = item.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (activeCategory !== "Populer") return 0;

      const scoreA =
        (a.averageRating || 0) * 50 +
        (a.totalReviews || 0) * 10;

      const scoreB =
        (b.averageRating || 0) * 50 +
        (b.totalReviews || 0) * 10;

      return scoreB - scoreA;
    });

  useEffect(() => {
    const getRecipes =
      async () => {
        try {
          setLoading(true);

          const response =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/recipes`
            );

          setRecipes(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );
        } catch (error) {
          console.error(
            "Gagal mengambil data:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    getRecipes();
  }, []);


  return (
    <div className="home-page">
      <Navbar
        searchTerm={
          searchTerm
        }
        setSearchTerm={
          setSearchTerm
        }
      />

      <main className="home-main-wrapper">

        <section className="categories-section">
          <Categories
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </section>
        {/* GRID ALL (FILTER KAMU TETAP DIPERTAHANKAN) */}
        <div className="recipe-cards-grid">
          {loading ? (
            <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
              Memuat resep...
            </p>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((item) => (
              <RecipeCard key={item.id} data={item} />
            ))
          ) : ( 
            <div className="empty-state-card">
              <p>Tidak ada resep ditemukan</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Home;