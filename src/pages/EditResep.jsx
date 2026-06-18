import Navbar from "../components/Navbar";
import "../styles/uploadResep.css";

import {
  useState,
  useEffect,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

function EditResep() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [title, setTitle] =
    useState("");

  const [
    serving,
    setServing,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    ingredients,
    setIngredients,
  ] = useState([]);

  const [image, setImage] =
    useState(null);

  const [steps, setSteps] =
    useState([]);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  // =========================
  // GET DATA RECIPE
  // =========================
  useEffect(() => {
    const getRecipe =
      async () => {
        try {
          const res = await axios.get(`${API}/api/recipes/${id}`);

          const recipe =
            res.data;

          setTitle(
            recipe.title
          );

          setServing(
            recipe.serving
          );

          setDescription(
            recipe.description
          );

          setCategory(
            recipe.category
          );

          setIngredients(
            recipe.ingredients.map(
              (
                item
              ) => ({
                text:
                  item,
              })
            )
          );

          if (
            recipe.image
          ) {
            setImage({
              url: recipe.image,
              oldImage:
                recipe.image,
            });
          }

          setSteps(
            recipe.steps.map(
              (
                step
              ) => ({
                text:
                  step.text,
                images:
                  step.images.map(
                    (
                      img
                    ) => ({
                      url: img,
                      oldImage:
                        img,
                    })
                  ),
              })
            )
          );
        } catch (error) {
          console.log(
            error
          );

          alert(
            "Gagal mengambil resep"
          );
        }
      };

    getRecipe();
  }, [id]);

  // =========================
  // FOTO UTAMA
  // =========================
  const handleImage =
    (e) => {
      const file =
        e.target
          .files[0];

      if (!file)
        return;

      setImage({
        file,
        url:
          URL.createObjectURL(
            file
          ),
      });
    };

  const removeImage =
    () => {
      setImage(null);
    };

  // =========================
  // BAHAN
  // =========================
  const handleIngredientText =
    (
      value,
      index
    ) => {
      const updated =
        [
          ...ingredients,
        ];

      updated[
        index
      ].text = value;

      setIngredients(
        updated
      );
    };

  const addIngredient =
    () => {
      setIngredients([
        ...ingredients,
        {
          text: "",
        },
      ]);
    };

  const removeIngredient =
    (index) => {
      setIngredients(
        ingredients.filter(
          (
            _,
            i
          ) =>
            i !==
            index
        )
      );
    };

  // =========================
  // STEP
  // =========================
  const handleStepText =
    (
      value,
      index
    ) => {
      const updated =
        [...steps];

      updated[
        index
      ].text = value;

      setSteps(
        updated
      );
    };

  const handleStepImage =
    (
      e,
      index
    ) => {
      const files =
        Array.from(
          e.target.files
        );

      const newImgs =
        files.map(
          (
            file
          ) => ({
            file,
            url:
              URL.createObjectURL(
                file
              ),
          })
        );

      const updated =
        [...steps];

      updated[
        index
      ].images.push(
        ...newImgs
      );

      setSteps(
        updated
      );
    };

  const removeStepImage =
    (
      stepIndex,
      imgIndex
    ) => {
      const updated =
        [...steps];

      updated[
        stepIndex
      ].images =
        updated[
          stepIndex
        ].images.filter(
          (
            _,
            i
          ) =>
            i !==
            imgIndex
        );

      setSteps(
        updated
      );
    };

  const addStep =
    () => {
      setSteps([
        ...steps,
        {
          text: "",
          images:
            [],
        },
      ]);
    };

  const removeStep =
    (index) => {
      setSteps(
        steps.filter(
          (
            _,
            i
          ) =>
            i !==
            index
        )
      );
    };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    const errors = [];

    const validIngredients = ingredients.filter(
      (i) => i.text.trim() !== ""
    );

    const validSteps = steps.filter(
      (s) => s.text.trim() !== ""
    );

    // ================= VALIDASI =================
    if (!image?.url && !image?.file) {
      errors.push("Foto resep wajib diisi");
    }

    if (!title || !serving || !description || !category) {
      errors.push("Informasi resep wajib diisi lengkap");
    }

    if (validIngredients.length < 1) {
      errors.push("Minimal harus ada 1 bahan");
    }

    if (validSteps.length < 1) {
      errors.push("Minimal harus ada 1 langkah");
    }

    // ================= STOP =================
    if (errors.length > 0) {
      setErrorMessages(errors);
      setErrorPopup(true);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("serving", serving);
      formData.append("description", description);
      formData.append("category", category);

      formData.append(
        "ingredients",
        JSON.stringify(validIngredients.map((i) => i.text))
      );

      const formattedSteps = [];

      validSteps.forEach((step, stepIndex) => {
        const imageNames = [];

        step.images.forEach((img, imgIndex) => {
          if (img.file) {
            const name = `step-${stepIndex}-${imgIndex}-${img.file.name}`;
            imageNames.push(name);
            formData.append("stepImages", img.file);
          } else {
            imageNames.push(img.oldImage);
          }
        });

        formattedSteps.push({
          text: step.text,
          images: imageNames,
        });
      });

      formData.append("steps", JSON.stringify(formattedSteps));

      if (image?.file) {
        formData.append("image", image.file);
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/api/recipes/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/resepsaya");
    } catch (error) {
      setErrorMessages(["Gagal update resep"]);
      setErrorPopup(true);
    }
  };

  return (
    <>
      <Navbar hideSearch={true} />
      {errorPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>⚠ Data Belum Lengkap</h3>

            <ul>
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>

            <div className="popup-buttons">
              <button
                className="popup-btn primary"
                onClick={() => setErrorPopup(false)}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="upload-page">

        {/* HEADER */}
        <div className="upload-header">
          <span
            className="back"
            onClick={() =>
              navigate(-1)
            }
          >
            {"<"} Edit Resep
          </span>
        </div>

        {/* TOP */}
        <div className="upload-grid">

          {/* FOTO RESEP */}
          <div className="upload-photo">
            <h4>Foto Resep</h4>

            <div className="image-grid">

              {/* Preview */}
              {image && (
                <div
                  className="image-item"
                  onClick={() =>
                    document
                      .getElementById(
                        "uploadMain"
                      )
                      .click()
                  }
                >
                  <img
                    src={image.url}
                    alt="preview"
                  />

                  <button
                    className="remove-btn"
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Upload */}
              {!image && (
                <label className="upload-box small">
                  +
                  <input
                    id="uploadMain"
                    type="file"
                    hidden
                    onChange={
                      handleImage
                    }
                  />
                </label>
              )}

              {image && (
                <input
                  id="uploadMain"
                  type="file"
                  hidden
                  onChange={
                    handleImage
                  }
                />
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="upload-form">
            <h4>
              Informasi Resep
            </h4>

            <input
              placeholder="Judul Resep"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Porsi"
              value={serving}
              onChange={(e) =>
                setServing(
                  e.target.value
                )
              }
            />

            <textarea
              placeholder="Deskripsikan resep anda"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >
              <option value="">
                Kategori
              </option>
              <option>
                Makanan
              </option>
              <option>
                Minuman
              </option>
              <option>
                Dessert
              </option>
              <option>
                Cemilan
              </option>
            </select>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="upload-bottom">

          {/* BAHAN */}
          <div className="bahan-box">
            <h4>
              Bahan-Bahan
            </h4>

            {ingredients.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="langkah-item"
                >
                  <span>
                    {index + 1}
                  </span>

                  <div className="step-box">
                    <input
                      value={
                        item.text
                      }
                      onChange={(
                        e
                      ) =>
                        handleIngredientText(
                          e.target
                            .value,
                          index
                        )
                      }
                      placeholder="Tambahkan bahan..."
                    />

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeIngredient(
                          index
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              className="btn-add right"
              onClick={
                addIngredient
              }
            >
              + Tambah Bahan
            </button>
          </div>

          {/* LANGKAH */}
          <div className="langkah-box">
            <h4>
              Langkah-Langkah
            </h4>

            {steps.map(
              (
                step,
                index
              ) => (
                <div
                  key={index}
                  className="langkah-item"
                >
                  <span>
                    {index + 1}
                  </span>

                  <div className="step-box">

                    <input
                      value={
                        step.text
                      }
                      onChange={(
                        e
                      ) =>
                        handleStepText(
                          e.target
                            .value,
                          index
                        )
                      }
                      placeholder="Tambahkan langkah..."
                    />

                    <div className="image-grid">
                      {step.images.map(
                        (
                          img,
                          i
                        ) => (
                          <div
                            key={i}
                            className="image-item"
                          >
                            <img
                              src={
                                img.url
                              }
                              alt=""
                            />

                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() =>
                                removeStepImage(
                                  index,
                                  i
                                )
                              }
                            >
                              ✕
                            </button>
                          </div>
                        )
                      )}

                      <label className="upload-box small">
                        +
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={(
                            e
                          ) =>
                            handleStepImage(
                              e,
                              index
                            )
                          }
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeStep(
                          index
                        )
                      }
                    >
                      Hapus Langkah
                    </button>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              className="btn-add right"
              onClick={addStep}
            >
              + Tambah Langkah
            </button>
          </div>
        </div>

        {/* SAVE */}
        <div className="submit-box">
          <button
            type="button"
            className="submit-btn"
            onClick={
              handleSave
            }
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </>
  );
}

export default EditResep;