import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/followPage.css";

function FollowingPage() {
  const navigate = useNavigate();

  const [followingData, setFollowingData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [followers, setFollowers] =
    useState(0);

  const [following, setFollowing] =
    useState(0);

  const [activeMenu] =
    useState("profil");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    // =========================
    // GET FOLLOWING
    // =========================
    const getFollowing =
      async () => {
        try {
          const response =
            await axios.get(
              `http://localhost:5000/api/follow/following/${user.id}`
            );

          setFollowingData(
            response.data
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    // =========================
    // GET FOLLOW STATS
    // =========================
    const getFollowStats =
      async () => {
        try {
          const response =
            await axios.get(
              `http://localhost:5000/api/follow/stats/${user.id}`
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

    if (user?.id) {
      getFollowing();
      getFollowStats();
    }
  }, [user?.id]);

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <ProfileSidebar
          user={user}
          activeMenu={
            activeMenu
          }
          followers={
            followers
          }
          following={
            following
          }
        />

        <main className="content">
          <div className="title-card">
            <h2>
              Mengikuti
            </h2>

            <p>
              Akun yang
              Anda ikuti
            </p>
          </div>

          <div className="follow-list">
            {loading ? (
              <p>
                Memuat...
              </p>
            ) : followingData.length >
              0 ? (
              followingData.map(
                (
                  item
                ) => (
                  <div
                    className="follow-card"
                    key={
                      item.id
                    }
                  >
                    <div className="follow-user">
                      <img
                        src={
                          item.photo ||
                          "https://via.placeholder.com/80"
                        }
                        alt={
                          item.name
                        }
                      />

                      <div>
                        <h4>
                          {
                            item.name
                          }
                        </h4>

                        <p>
                          {
                            item.email
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      className="view-profile-btn"
                      onClick={() =>
                        navigate(`/profil-dikunjungi/${item.id}`)
                      }
                    >
                      Lihat
                    </button>
                  </div>
                )
              )
            ) : (
              <p>
                Belum
                mengikuti
                siapa pun
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default FollowingPage;