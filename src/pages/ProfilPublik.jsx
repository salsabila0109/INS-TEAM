import React from "react";
import Navbar from "../components/Navbar";
import "../styles/ProfilPublik.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";

const ProfilPublik = () => {
  return (
    <div className="public-profile-page">
      <Navbar />

      <div className="public-profile-container">
        <div className="profile-layout-grid">
          
          {/* SISI KIRI: INFO USER */}
          <aside className="user-info-card">
            <div className="user-main-detail">
              <img src="/src/assets/luna-profile.png" alt="Luna" className="user-avatar-large" />
              <h2>Luna</h2>
              <p className="user-handle">foodieshub@gmail.com</p>
              
              <div className="stats-row">
                <p><strong>10rb+</strong> Pengikut</p>
                <p><strong>107</strong> Mengikuti</p>
              </div>

              <button className="btn-follow">Ikuti</button>
            </div>

            <div className="user-bio-box">
              <p>
                "Penjelajah rasa yang hobi membedah resep klasik dengan sentuhan modern. 
                Di profil ini, kamu akan menemukan eksperimen bumbu dan teknik memasak 
                yang sudah saya uji coba sendiri di dapur. Let's elevate your cooking game together!"
              </p>
            </div>
          </aside>

          {/* SISI KANAN: DAFTAR RESEP */}
          <main className="user-recipes-section">
            <div className="section-header">
              <h3>Resep (2)</h3>
              <div className="search-bar-mini">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Cari resep..." />
              </div>
            </div>

            <div className="recipes-grid-display">
              {/* Card 1 */}
              <div className="recipe-item-card">
                <div className="recipe-thumb">
                  <img src="/src/assets/nasigoreng.jpeg" alt="Nasi Goreng" />
                  <span className="badge-populer">Populer</span>
                </div>
                <div className="recipe-item-info">
                  <div className="title-rating">
                    <h4>Nasi Goreng Spesial</h4>
                    <span className="rating-tag"><FontAwesomeIcon icon={faStar} /> 4.5</span>
                  </div>
                  <button className="btn-view-resep">Lihat Resep</button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="recipe-item-card">
                <div className="recipe-thumb">
                  <img src="/src/assets/dessertcoklat.jpeg" alt="Dessert" />
                </div>
                <div className="recipe-item-info">
                  <div className="title-rating">
                    <h4>Dessert Coklat</h4>
                    <span className="rating-tag"><FontAwesomeIcon icon={faStar} /> 4.1</span>
                  </div>
                  <button className="btn-view-resep">Lihat Resep</button>
                </div>
              </div>
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilPublik;