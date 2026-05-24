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

  const [ingredients, setIngredients] = useState([
    { text: "" }
  ]);

  // ================= FOTO UTAMA (SINGLE) =================
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
  };

  const handleStepImage = (e, index) => {
    const files = Array.from(e.target.files);

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

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const formData = new FormData();

      formData.append("title", title);
      formData.append("serving", serving);
      formData.append("description", description);
      formData.append("category", category);

      formData.append(
        "ingredients",
        JSON.stringify(
          ingredients.map((item) => item.text)
        )
      );

      // simpan step + nama file gambar
      const formattedSteps = [];

      steps.forEach((step, stepIndex) => {

        const imageNames = [];

        step.images.forEach((img, imgIndex) => {

          const fileName =
            `step-${stepIndex}-${imgIndex}-${img.file.name}`;

          imageNames.push(fileName);

          formData.append(
            "stepImages",
            img.file
          );

        });

        formattedSteps.push({
          text: step.text,
          images: imageNames,
        });

      });

      formData.append(
        "steps",
        JSON.stringify(formattedSteps)
      );

      formData.append("userId", user.id);

      // upload gambar jika ada
      if (image) {
        formData.append(
          "image",
          image.file
        );
      }

const token =
  localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/recipes",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Resep berhasil dipublikasikan!");

      navigate("/");

    } catch (error) {

      console.log(error);

      console.log(error.response?.data);

      alert("Gagal upload resep");

    }

  };

  return (
    <>
      <Navbar />

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

            <input
              placeholder="Judul Resep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Porsi"
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

            {ingredients.map((item, index) => (

              <div
                key={index}
                className="langkah-item"
              >

                <span>{index + 1}</span>

                <div className="step-box">

                  <input
                    value={item.text}
                    onChange={(e) =>
                      handleIngredientText(
                        e.target.value,
                        index
                      )
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

            {steps.map((step, index) => (
              <div key={index} className="langkah-item">
                <span>{index + 1}</span>

                <div className="step-box">

                  <input
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