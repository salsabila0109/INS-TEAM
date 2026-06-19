import Navbar from "../components/Navbar";
import "../styles/uploadResep.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadResep() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [serving, setServing] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stepError, setStepError] = useState([]);
  const [ingredientError, setIngredientError] = useState([]);
  const [ingredients, setIngredients] = useState([{ text: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  // ================= FOTO UTAMA (SINGLE) =================
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessages([
        "Format gambar tidak didukung. Gunakan JPG, JPEG, atau PNG."
      ]);
      setErrorPopup(true);

      e.target.value = "";
      return;
    }

    setImage({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const removeImage = () => {
    setImage(null);
  };

  // ================= LANGKAH =================
  const [steps, setSteps] = useState([
    { text: "", images: [] }
  ]);

  const handleStepText = (value, index) => {
    const updated = [...steps];
    updated[index].text = value;
    setSteps(updated);

    if (submitted) {
      const errors = [...stepError];
      errors[index] = value.trim() === "";
      setStepError(errors);
    }
  };

  const handleStepImage = (e, index) => {
    const files = Array.from(e.target.files);

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrorMessages([
        "Semua gambar langkah harus berformat JPG, JPEG, atau PNG."
      ]);
      setErrorPopup(true);

      e.target.value = "";
      return;
    }

    const newImgs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = [...steps];
    updated[index].images.push(...newImgs);

    setSteps(updated);
  };

  const removeStepImage = (stepIndex, imgIndex) => {
    const updated = [...steps];
    updated[stepIndex].images =
      updated[stepIndex].images.filter((_, i) => i !== imgIndex);

    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { text: "", images: [] }]);
  };

  const handleIngredientText = (value, index) => {

    const updated = [...ingredients];

    updated[index].text = value;

    setIngredients(updated);

  };

  const addIngredient = () => {

    setIngredients([
      ...ingredients,
      { text: "" }
    ]);

  };

  const removeIngredient = (index) => {

    const updated =
      ingredients.filter((_, i) => i !== index);

    setIngredients(updated);

  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const errors = [];

    // ================= VALIDASI =================
    if (!image) errors.push("Foto resep wajib diisi");

    if (!title || !serving || !description || !category)
      errors.push("Informasi resep wajib diisi lengkap");

    const validIngredients = ingredients.filter(
      (item) => item.text.trim() !== ""
    );

    if (validIngredients.length < 1)
      errors.push("Minimal harus ada 1 bahan");

    const validSteps = steps.filter(
      (step) => step.text.trim() !== ""
    );

    if (validSteps.length < 1)
      errors.push("Minimal harus ada 1 langkah");

    // ================= STOP DI SINI =================
    if (errors.length > 0) {
      setErrorMessages(errors);
      setErrorPopup(true);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();

      formData.append("title", title);
      formData.append("serving", serving);
      formData.append("description", description);
      formData.append("category", category);

      formData.append(
        "ingredients",
        JSON.stringify(validIngredients.map((i) => i.text.trim()))
      );

      const formattedSteps = [];

      validSteps.forEach((step) => {
        const imageNames = [];

        step.images.forEach((img) => {
          formData.append("stepImages", img.file);

          imageNames.push(""); // placeholder
        });

        formattedSteps.push({
          text: step.text.trim(),
          images: imageNames,
        });
      });

      formData.append("steps", JSON.stringify(formattedSteps));
      formData.append("userId", user.id);
      console.log(user);

      if (image) {
        formData.append("image", image.file);
      }

      const token = localStorage.getItem("token");

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
console.log(image);
console.log(image.file);
console.log(image.file instanceof File);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recipes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } 
      catch (error) {
        console.log("ERROR :", error);

        if (error.response) {
          console.log("STATUS :", error.response.status);
          console.log("DATA :", error.response.data);
        }

        setErrorMessages([
          error.response?.data?.message || "Gagal upload resep"
        ]);

        setErrorPopup(true);
      }
  };

  return (
    <>
      <Navbar hideSearch={true} />
      
      {errorPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>⚠ Form Belum Lengkap</h3>

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
          <span className="back" onClick={() => navigate(-1)}>
            {"<"} Upload Resep
          </span>
        </div>

        {/* TOP */}
        <div className="upload-grid">

          {/* FOTO UTAMA */}
          <div className="upload-photo">
            <h4>Foto Resep</h4>

            <div className="image-grid">

              {/* PREVIEW FOTO */}
              {image && (
                <div
                  className="image-item"
                  onClick={() =>
                    document.getElementById("uploadMain").click()
                  }
                >
                  <img src={image.url} alt="preview" />

                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* KOTAK UPLOAD (HANYA MUNCUL KALAU BELUM ADA FOTO) */}
              {!image && (
                <label className="upload-box small">
                  +
                  <input
                    id="uploadMain"
                    type="file"
                    hidden
                    onChange={handleImage}
                  />
                </label>
              )}

              {/* INPUT HIDDEN UNTUK REPLACE */}
              {image && (
                <input
                  id="uploadMain"
                  type="file"
                  hidden
                  onChange={handleImage}
                />
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="upload-form">
            <h4>Informasi Resep</h4>
            <p className="section-hint">
              Isi informasi dasar resep sebelum
              menambahkan bahan dan langkah.
            </p>

            <input
              placeholder="Judul Resep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Porsi (Contoh: 1)"
              value={serving}
              onChange={(e) => setServing(e.target.value)}
            />
            <textarea
              placeholder="Deskripsikan resep anda"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Kategori</option>
              <option>Makanan</option>
              <option>Minuman</option>
              <option>Dessert</option>
              <option>Cemilan</option>
            </select>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="upload-bottom">

          {/* BAHAN */}
          <div className="bahan-box">

            <h4>Bahan-Bahan</h4>
            <p className="section-hint">
              Tambahkan satu bahan per kolom, lalu klik <b>+ Tambah Bahan</b> untuk menambah bahan lainnya.
            </p>

            {ingredients.map((item, index) => (

              <div
                key={index}
                className="langkah-item"
              >

                <span>{index + 1}</span>

                <div className="step-box">

                  <input
                    className={submitted && ingredientError[index]? "input-error": ""}
                    value={item.text}
                    onChange={(e) =>
                      handleIngredientText(e.target.value, index)
                    }
                    placeholder="Tambahkan bahan..."
                  />

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeIngredient(index)
                    }
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}

            <button
              type="button"
              className="btn-add right"
              onClick={addIngredient}
            >
              + Tambah Bahan
            </button>

          </div>
          {/* LANGKAH */}
          <div className="langkah-box">
            <h4>Langkah-Langkah</h4>
            <p className="section-hint">
              Tulis langkah memasak satu per satu.
              Anda juga dapat menambahkan foto
              pada setiap langkah.
            </p>

            {steps.map((step, index) => (
              <div key={index} className="langkah-item">
                <span>{index + 1}</span>

                <div className="step-box">

                  <input
                    className={submitted && stepError[index]? "input-error": ""}
                    value={step.text}
                    onChange={(e) =>
                      handleStepText(e.target.value, index)
                    }
                    placeholder="Tambahkan langkah..."
                  />

                  <div className="image-grid">
                    {step.images.map((img, i) => (
                      <div key={i} className="image-item">
                        <img src={img.url} alt="" />

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() =>
                            removeStepImage(index, i)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <label className="upload-box small">
                      +
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) =>
                          handleStepImage(e, index)
                        }
                      />
                    </label>
                  </div>

                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add right"
              onClick={addStep}
            >
              + Tambah Langkah
            </button>
          </div>

        </div>

        {/* SUBMIT */}
        <div className="submit-box">
          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmit}
          >
            Publikasikan Resep
          </button>
        </div>

      </div>
    </>
  );
}

export default UploadResep;