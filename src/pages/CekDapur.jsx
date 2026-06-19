import Navbar from "../components/Navbar";
import "../styles/CekDapur.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CekDapur() {
  const navigate =
    useNavigate();

  const [input, setInput] =
    useState("");

  const [bahan, setBahan] =
    useState([]);

  const [
    showResult,
    setShowResult,
  ] = useState(false);

  const [recipes, setRecipes] =
    useState([]);

  const [
    resultRecipes,
    setResultRecipes,
  ] = useState([]);

  // =========================
  // AMBIL RESEP DARI DB
  // =========================
  useEffect(() => {
    const getRecipes =
      async () => {
        try {
          const response =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/api/recipes`
            );

          setRecipes(
            response.data
          );
        } catch (error) {
          console.log(
            error
          );
        }
      };

    getRecipes();
  }, []);

  // =========================
  // TAMBAH BAHAN
  // =========================
  const handleTambah =
    () => {
      if (
        !input.trim()
      )
        return;

      // hindari duplikat
      const newBahan =
        input
          .trim()
          .toLowerCase();

      if (
        bahan.includes(
          newBahan
        )
      ) {
        setInput("");
        return;
      }

      setBahan([
        ...bahan,
        newBahan,
      ]);

      setInput("");
    };

  // =========================
  // ENTER = TAMBAH
  // =========================
  const handleKey =
    (e) => {
      if (
        e.key ===
        "Enter"
      ) {
        handleTambah();
      }
    };

  // =========================
  // HAPUS BAHAN
  // =========================
  const handleHapus = (
    index
  ) => {
    setBahan(
      bahan.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  // =========================
  // CARI RESEP
  // =========================
  const handleCari = () => {
    if (bahan.length === 0) return;

    const filtered = recipes
      .map((recipe) => {
        let ingredients = [];

        try {
          ingredients = JSON.parse(
            recipe.ingredients
          );
        } catch {
          ingredients = [];
        }

        // lowercase
        const recipeIngredients =
          ingredients.map((item) =>
            item.toLowerCase()
          );

        // hitung jumlah bahan yang cocok
        const matchedCount =
          bahan.filter((item) =>
            recipeIngredients.some(
              (ingredient) =>
                ingredient.includes(item)
            )
          ).length;

        return {
          ...recipe,
          matchedCount,
        };
      })

      // hanya ambil yang punya kecocokan
      .filter(
        (recipe) =>
          recipe.matchedCount > 0
      )

      // urutkan terbanyak dulu
      .sort(
        (a, b) =>
          b.matchedCount -
          a.matchedCount
      );

    setResultRecipes(filtered);
    setShowResult(true);
  };

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="cek-page">
        <h2 className="title">
          Cek Dapur
        </h2>

        <p className="desc">
          Masukkan bahan
          yang ada di
          dapur Anda, dan
          kami akan
          memberikan
          rekomendasi
          resep
          berdasarkan
          bahan-bahan
          tersebut.
        </p>

        <div className="cek-container">
          {/* LEFT */}
          <div className="cek-left">
            <h4>Bahan di Dapur Anda</h4>

            <div className="instruction-box">
              <p className="guide-title">
                Cara Menggunakan
              </p>

              <p className="guide-text">
                Ketik <b>1 bahan</b>, lalu klik 
                <b> + Tambah</b>. 
                Ulangi untuk menambahkan bahan lain,
                kemudian klik <b>Cari Resep</b>.
              </p>

              <p className="example-text">
                Contoh bahan:
                <span> telur</span>,
                <span> ayam</span>,
                <span> mie</span>,
                <span> cabai</span>,
                <span> tomat</span>,
                <span> bawang</span>
              </p>
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Masukkan 1 bahan (contoh: telur)"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKey}
              />

              <button
                onClick={handleTambah}
              >
                + Tambah
              </button>
            </div>

            <p className="ingredient-status">
              {bahan.length === 0
                ? "Belum ada bahan ditambahkan"
                : `${bahan.length} bahan ditambahkan ✓`}
            </p>
            {/* CHIP */}
            <div className="chip-container">
              {bahan.map(
                (
                  item,
                  index
                ) => (
                  <div
                    className="chip"
                    key={
                      index
                    }
                  >
                    {
                      item
                    }

                    <span
                      onClick={() =>
                        handleHapus(
                          index
                        )
                      }
                    >
                      ×
                    </span>
                  </div>
                )
              )}
            </div>

            {/* BUTTON */}
            <button
              className="btn-search"
              onClick={handleCari}
              disabled={
                bahan.length === 0
              }
            >
              Cari Resep
            </button>
          </div>

          {/* RIGHT */}
          <div className="cek-right">
            <img
              src="/src/assets/cekdapur.png"
              alt="cekdapur"
            />
          </div>
        </div>

        {/* HASIL */}
        {showResult && (
          <div className="result-section">
            <div className="line"></div>

            <div className="recipe-list">
              {resultRecipes.length >
              0 ? (
                resultRecipes.map(
                  (
                    item
                  ) => (
                    <div
                      className="recipe-card"
                      key={item.id}
                    >
                      {/* IMAGE */}
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.title}
                      />

                      <div className="recipe-content">
                        {/* AUTHOR + RATING */}
                        <div className="recipe-meta">
                          <span className="author">
                            👤{" "}
                            {item.User?.name ||
                              "User"}
                          </span>

                          <span className="rating">
                            {item.totalReviews >
                            0 ? (
                              <>
                                ⭐ {item.rating} (
                                {
                                  item.totalReviews
                                }
                                )
                              </>
                            ) : (
                              <>
                                ⭐ Belum ada
                                penilaian
                              </>
                            )}
                          </span>
                        </div>

                        {/* TITLE */}
                        <h3 className="recipe-title">
                          {item.title}
                        </h3>

                        {/* MATCHED */}
                        <span className="match-badge">
                          ✅{" "}
                          {
                            item.matchedCount
                          }{" "}
                          bahan cocok
                        </span>

                        {/* BUTTON */}
                        <button
                          className="outline-btn"
                          onClick={() =>
                            navigate(
                              `/detailresep/${item.id}`
                            )
                          }
                        >
                          Lihat Resep
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p>
                  Tidak ada
                  resep yang
                  cocok
                  dengan
                  bahan
                  tersebut.
                </p>
              )}
            </div>

            <div className="more-btn">
              <button
                onClick={() =>
                  navigate(
                    "/"
                  )
                }
              >
                Lihat
                Resep
                Lainnya →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CekDapur;