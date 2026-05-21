import Navbar from "../components/Navbar";
import "../styles/editresep.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditResep() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Set default state agar tidak undefined saat pertama render
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setData(response.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        alert("Resep tidak ditemukan!");
        navigate("/resepsaya");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}`, data);
      alert("Resep berhasil disimpan!");
      navigate("/resepsaya");
    } catch (err) {
      alert("Gagal menyimpan data!");
    }
  };

  // PENTING: Jika data belum ada, tampilkan loading/kosong agar tidak crash
  if (!data) return <div style={{padding: '50px', textAlign: 'center'}}>Memuat data resep...</div>;

  return (
    <>
      <Navbar hideSearch />
      <div className="edit-page">
        <p className="back" onClick={() => navigate(-1)}>← Kembali</p>
        
        <div className="edit-top">
          <div className="foto-box">
            <h4>Foto Resep</h4>
            {data.image && <img src={`http://localhost:5000/uploads/${data.image}`} alt="resep" className="preview-img" />}
          </div>
          <div className="form-box">
            <h4>Informasi Resep</h4>
            <input value={data.title || ""} onChange={(e) => setData({...data, title: e.target.value})} placeholder="Judul Resep" />
            <input value={data.porsi || ""} onChange={(e) => setData({...data, porsi: e.target.value})} placeholder="Porsi" />
            <textarea value={data.desc || ""} onChange={(e) => setData({...data, desc: e.target.value})} placeholder="Deskripsi" />
          </div>
        </div>

        <div className="edit-bottom">
          <div className="card">
            <h4>Bahan-Bahan</h4>
            {data.bahan?.map((item, i) => (
              <input key={i} value={item} onChange={(e) => {
                const newBahan = [...data.bahan]; newBahan[i] = e.target.value;
                setData({...data, bahan: newBahan});
              }} />
            ))}
            <button className="btn-add" onClick={() => setData({...data, bahan: [...(data.bahan || []), ""]})}>+ Tambah Bahan</button>
          </div>
        </div>

        <div className="save-area">
          <button className="btn-save" onClick={handleSave}>Simpan Perubahan</button>
        </div>
      </div>
    </>
  );
}
export default EditResep;