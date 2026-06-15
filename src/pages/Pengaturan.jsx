import React, {
  useState,
  useEffect,
} from "react";
import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pengaturan.css";

function Pengaturan() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      ) || {}
    );

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [isChanging, setIsChanging] =
    useState(false);

  // Menu aktif sidebar
  const [activeMenu] =
    useState("pengaturan");
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

  // Get user dari localStorage
  useEffect(() => {
    const localUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    if (localUser) {
      setUser(
        localUser
      );

      // ambil jumlah follow
      getFollowStats(
        localUser.id
      );
    }
  }, []);

  // Upload foto profil
  const handleUpload = async (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    // Validasi max 2MB
    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Ukuran foto maksimal 2MB"
      );
      return;
    }

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

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

      // Sync Navbar
      window.dispatchEvent(
        new Event("storage")
      );

      alert(
        "Foto profil berhasil diperbarui"
      );
    } catch (error) {
      console.log(error);

      alert(
        "Gagal upload foto"
      );
    }
  };

  // Ganti password
  const handleChangePassword =
    async (e) => {
      e.preventDefault();

      if (
        newPassword !==
        confirmPassword
      ) {
        alert(
          "Konfirmasi kata sandi baru tidak cocok!"
        );
        return;
      }

      const userId =
        user.id || user._id;

      if (!userId) {
        alert(
          "Sesi habis. Silakan login kembali."
        );
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `http://localhost:5000/api/profile/change-password/${userId}`,
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Kata sandi berhasil diperbarui!"
        );

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChanging(false);
      } catch (error) {
        console.error(
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Gagal mengubah kata sandi"
        );
      }
    };

  // Logout
  const handleLogout =
    () => {
      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      navigate("/login");
    };

  return (
    <>
      <Navbar
        hideSearch={true}
      />

      <div className="profile-page">
        <ProfileSidebar
          user={user}
          activeMenu={activeMenu}
          handleUpload={handleUpload}
          followers={followers}
          following={following}
        />

        {/* Content */}
        <main className="content">
          <h2 className="section-main-title">
            Pengaturan
          </h2>

          <div className="settings-white-box">
            <h3 className="box-sub-title">
              Pengaturan Akun
            </h3>

            {/* Email */}
            <div className="input-group-layout">
              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  user?.email ||
                  ""
                }
                className="input-field-style disabled-input"
                disabled
              />
            </div>

            {/* Password */}
            {!isChanging ? (
            <div className="input-group-layout">
              <label>Password</label>

              <input
                type="password"
                value="••••••••"
                className="input-field-style disabled-input"
                disabled
              />
            </div>
            ) : (
              <form
                onSubmit={
                  handleChangePassword
                }
                className="password-change-form"
              >
                <div className="input-group-layout">
                  <label>
                    Kata Sandi
                    Lama
                  </label>

                  <input
                    type="password"
                    className="input-field-style"
                    value={
                      oldPassword
                    }
                    onChange={(
                      e
                    ) =>
                      setOldPassword(
                        e.target
                          .value
                      )
                    }
                    required
                  />
                </div>

                <div className="input-group-layout">
                  <label>
                    Kata Sandi
                    Baru
                  </label>

                  <input
                    type="password"
                    className="input-field-style"
                    value={
                      newPassword
                    }
                    onChange={(
                      e
                    ) =>
                      setNewPassword(
                        e.target
                          .value
                      )
                    }
                    required
                  />
                </div>

                <div className="input-group-layout">
                  <label>
                    Konfirmasi
                    Kata Sandi
                    Baru
                  </label>

                  <input
                    type="password"
                    className="input-field-style"
                    value={
                      confirmPassword
                    }
                    onChange={(
                      e
                    ) =>
                      setConfirmPassword(
                        e.target
                          .value
                      )
                    }
                    required
                  />
                </div>

                <div className="password-action-buttons">
                  <button
                    type="button"
                    className="btn-cancel-style"
                    onClick={() =>
                      setIsChanging(
                        false
                      )
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn-save-style"
                  >
                    Simpan
                    Password
                  </button>
                </div>
              </form>
            )}

            {/* ACTION FOOTER */}
            {!isChanging && (
              <div className="action-footer-row">
                <button
                  type="button"
                  className="btn-ubah-style"
                  onClick={() => setIsChanging(true)}
                >
                  Ubah Password
                </button>

                <button
                  type="button"
                  className="logout-action-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Pengaturan;