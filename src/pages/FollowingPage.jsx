import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import ProfileSidebar from "../components/ProfileSidebar";
import "../styles/followPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useFollow } from "../context/FollowContext";

function FollowingPage() {
  const navigate = useNavigate();

  const [followingData, setFollowingData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const { followers, following } = useFollow();

  const [activeMenu] =
    useState("profil");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    if (!user?.id) return;

    const getFollowing = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/follow/following/${user.id}`
        );

        setFollowingData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getFollowing();
  }, []);
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
              <div className="loading-screen follower-loading">
                <div className="foodies-spinner"></div>
                <p>Memuat...</p>
              </div>
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
                      <div className="follow-avatar">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.name}
                          />
                        ) : (
                          <div className="follow-avatar-fallback">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                        )}
                      </div>

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