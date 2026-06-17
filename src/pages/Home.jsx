import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import "../styles/Home.css";
import { FaFire, FaClock, FaStar } from "react-icons/fa";

const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

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

  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const trendingRecipes = [...recipes]
    .filter((item) => {
      const createdTime = new Date(item.createdAt).getTime();
      return now - createdTime <= SEVEN_DAYS;
    })
    .sort((a, b) => {
      const scoreA =
        (a.totalReviews || 0) * 15 +
        (a.averageRating || 0) * 50 +
        (new Date(a.createdAt).getTime() / 1000000000);

      const scoreB =
        (b.totalReviews || 0) * 15 +
        (b.averageRating || 0) * 50 +
        (new Date(b.createdAt).getTime() / 1000000000);

      return scoreB - scoreA;
    })
    .slice(0, 6);
    
  const latestRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const topRatedRecipes = [...recipes]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 6);
    
  useEffect(() => {
    const getRecipes =
      async () => {
        try {
          setLoading(true);

          const response =
            await axios.get(
              "http://localhost:5000/api/recipes"
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

  // FILTER RESEP
  const filteredRecipes =
  recipes
  .filter((item) => {

    let categoryMatch =
      false;

    // SEMUA
    if (
      activeCategory ===
      "Semua"
    ) {
      categoryMatch =
        true;
    }

    // POPULER
    else if (
      activeCategory ===
      "Populer"
    ) {

      const avgRating =
        item.averageRating || 0;

      const totalReviews =
        item.totalReviews || 0;

      categoryMatch =
        avgRating >= 4 &&
        totalReviews >= 5;
    }

    // KATEGORI
    else {

      categoryMatch =
        item.category
          ?.toLowerCase() ===
        activeCategory.toLowerCase();
    }

    // SEARCH
    const searchMatch =
      item.title
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    return (
      categoryMatch &&
      searchMatch
    );
  })

  .sort((a, b) => {

    // khusus populer
    if (
      activeCategory !==
      "Populer"
    ) {
      return 0;
    }

    const scoreA =
      (
        (a.averageRating || 0)
        * 50
      ) +
      (
        (a.totalReviews || 0)
        * 10
      );

    const scoreB =
      (
        (b.averageRating || 0)
        * 50
      ) +
      (
        (b.totalReviews || 0)
        * 10
      );

    return (
      scoreB -
      scoreA
    );
  });

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
            shuffleArray(filteredRecipes).map((item) => (
              <RecipeCard key={item._id || item.id} data={item} />
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