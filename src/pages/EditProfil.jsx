import React, {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/EditProfil.css";

import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import axios from "axios";

const EditProfil = () => {
  const navigate =
    useNavigate();

  const [user, setUser] =
    useState({});

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [
    photoPreview,
    setPhotoPreview,
  ] = useState(
    "https://via.placeholder.com/150"
  );

  const [
    photoFile,
    setPhotoFile,
  ] = useState(null);

  const [
    activeMenu,
    setActiveMenu,
  ] = useState("profil");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  // =========================
  // GET FOLLOW STATS
  // =========================
  const getFollowStats =
    async (userId) => {
      try {
        const response =
          await axios.get(
            `http://localhost:5000/api/follow/stats/${userId}`
          );

        setFollowers(
          response.data
            .followers
        );

        setFollowing(
          response.data
            .following
        );

      } catch (error) {
        console.log(error);
      }
    };

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const localUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    if (localUser) {
      setUser(localUser);
      setName(
        localUser.name || ""
      );
      setBio(
        localUser.bio || ""
      );

      setPhotoPreview(
        localUser.photo ||
          "https://via.placeholder.com/150"
      );
      // ambil data follow
      getFollowStats(
        localUser.id
      );
    }
  }, []);

  // =========================
  // HANDLE UPLOAD FOTO
  // =========================
  const handlePhotoChange =
    (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      // Validasi ukuran
      if (
        file.size >
        2 * 1024 * 1024
      ) {
        alert(
          "Ukuran foto maksimal 2MB"
        );
        return;
      }

      // Validasi format
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        alert(
          "Format gambar tidak didukung"
        );
        return;
      }

      setPhotoFile(file);

      // Preview sementara
      setPhotoPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  // =========================
  // HANDLE SAVE
  // =========================
  const handleSave =
    async () => {
      try {
        const formData =
          new FormData();

        formData.append(
          "name",
          name
        );

        formData.append(
          "bio",
          bio
        );

        // jika ada foto baru
        if (photoFile) {
          formData.append(
            "photo",
            photoFile
          );
        }

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.put(
            `http://localhost:5000/api/profile/${
              user.id ||
              user._id
            }`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const updatedUser =
          response.data.user;

        setUser(
          updatedUser
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        // sync navbar
        window.dispatchEvent(
          new Event(
            "storage"
          )
        );

        alert(
          "Profil berhasil diperbarui!"
        );

        navigate(
          "/profile"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "Gagal update profil"
        );
      }
    };

  // =========================
  // HANDLE UPLOAD SIDEBAR
  // =========================
  const handleUpload =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "photo",
        file
      );

      try {
        const response =
          await axios.put(
            `http://localhost:5000/api/profile/${user.id}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const updatedUser =
          response.data.user;

        setUser(
          updatedUser
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        window.dispatchEvent(
          new Event(
            "storage"
          )
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "Gagal upload foto"
        );
      }
    };

  return (
    <>
      <Navbar hideSearch={true} />

      <div className="profile-page">
        <ProfileSidebar
          user={user}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleUpload={handleUpload}
          followers={followers}
          following={following}
        />

        {/* CONTENT */}
        <main className="content">
          <div className="form-card">
            <header className="form-header">
              <h2>
                Edit Profil
              </h2>

              <p>
                Perbarui
                informasi akun
                Anda di sini.
              </p>
            </header>

            <section className="info-section">
              {/* FOTO */}
              <div className="upload-photo-section">
                <img
                  src={
                    photoPreview
                  }
                  alt="Current"
                  className="current-photo"
                  onError={(
                    e
                  ) => {
                    e.target.src =
                      "https://via.placeholder.com/150";
                  }}
                />

                <div className="upload-box">
                  <label
                    htmlFor="file-upload"
                    className="upload-label"
                  >
                    <Camera
                      size={
                        20
                      }
                    />
                    <span>
                      Ganti
                      Foto
                    </span>
                  </label>

                  <input
                    id="file-upload"
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={
                      handlePhotoChange
                    }
                  />
                </div>
              </div>

              {/* NAMA */}
              <div className="input-group">
                <label>
                  Nama
                  Pengguna
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(
                    e
                  ) =>
                    setName(
                      e
                        .target
                        .value
                    )
                  }
                />
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    user?.email ||
                    ""
                  }
                  disabled
                  style={{
                    background:
                      "#f9f9f9",
                    cursor:
                      "not-allowed",
                    color:
                      "#999",
                  }}
                />

                <small
                  style={{
                    fontSize:
                      "0.75rem",
                    color:
                      "#888",
                  }}
                >
                  Email
                  tidak dapat
                  diubah.
                </small>
              </div>

              {/* BIO */}
              <div className="input-group">
                <label>
                  Bio
                </label>

                <textarea
                  rows="4"
                  placeholder="Ceritakan sedikit tentang dirimu..."
                  value={bio}
                  onChange={(
                    e
                  ) =>
                    setBio(
                      e
                        .target
                        .value
                    )
                  }
                />
              </div>

              {/* BUTTON */}
              <div className="action-area">
                <button
                  className="btn-save"
                  onClick={
                    handleSave
                  }
                >
                  Simpan
                  Perubahan
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditProfil;