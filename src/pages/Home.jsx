import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import "../styles/home.css";

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
    recipes.filter((item) => {
      // filter kategori
      let categoryMatch =
        false;

      if (
        activeCategory ===
        "Semua"
      ) {
        categoryMatch =
          true;
      } else if (
        activeCategory ===
        "Populer"
      ) {
        categoryMatch =
          item.totalReviews > 0;
      } else {
        categoryMatch =
          item.category?.toLowerCase() ===
          activeCategory.toLowerCase();
      }

      // filter pencarian nama resep
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
            activeCategory={
              activeCategory
            }
            setActiveCategory={
              setActiveCategory
            }
          />
        </section>

        <div className="recipe-cards-grid">
          {loading ? (
            <p
              style={{
                textAlign:
                  "center",
                gridColumn:
                  "1 / -1",
              }}
            >
              Memuat resep...
            </p>
          ) : filteredRecipes.length >
            0 ? (
            filteredRecipes.map(
              (item) => (
                <RecipeCard
                  key={
                    item._id ||
                    item.id
                  }
                  data={item}
                />
              )
            )
          ) : (
            <div className="empty-state-card">
              <p>
                Tidak ada
                resep ditemukan
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;