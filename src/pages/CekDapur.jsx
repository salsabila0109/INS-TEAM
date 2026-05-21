import Navbar from "../components/Navbar";
import "../styles/cekDapur.css";
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
              "http://localhost:5000/api/recipes"
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
  const handleCari =
    () => {
      if (
        bahan.length ===
        0
      )
        return;

      const filtered =
        recipes.filter(
          (recipe) => {
            // parse ingredients
            let ingredients =
              [];

            try {
              ingredients =
                JSON.parse(
                  recipe.ingredients
                );
            } catch {
              ingredients =
                [];
            }

            // ubah ke lowercase
            const recipeIngredients =
              ingredients.map(
                (
                  item
                ) =>
                  item.toLowerCase()
              );

            // cek apakah ada bahan cocok
            return bahan.some(
              (
                item
              ) =>
                recipeIngredients.some(
                  (
                    ingredient
                  ) =>
                    ingredient.includes(
                      item
                    )
                )
            );
          }
        );

      setResultRecipes(
        filtered
      );

      setShowResult(
        true
      );
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
            <h4>
              Bahan di
              Dapur Anda
            </h4>

            <div className="input-box">
              <input
                type="text"
                placeholder="Tambah bahan...."
                value={
                  input
                }
                onChange={(
                  e
                ) =>
                  setInput(
                    e
                      .target
                      .value
                  )
                }
                onKeyDown={
                  handleKey
                }
              />

              <button
                onClick={
                  handleTambah
                }
              >
                + Tambah
              </button>
            </div>

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
              onClick={
                handleCari
              }
            >
              Cari
              Resep
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
                      key={
                        item.id
                      }
                    >
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={
                          item.title
                        }
                      />

                      <div className="recipe-info">
                        <p>
                          {
                            item.title
                          }
                        </p>

                        <span className="rating">
                          ⭐{" "}
                          {item.rating ||
                            0}
                        </span>
                      </div>

                      <button
                        className="outline-btn"
                        onClick={() =>
                          navigate(
                            `/detailresep/${item.id}`
                          )
                        }
                      >
                        Lihat
                        Resep
                      </button>
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