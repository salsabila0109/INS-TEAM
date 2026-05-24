import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DetailResep from "./pages/DetailResep";
import ProfilPublik from "./pages/ProfilPublik";
import CekDapur from "./pages/CekDapur";

// PRIVATE
import Profile from "./pages/Profile";
import EditProfil from "./pages/EditProfil";
import ResepSaya from "./pages/ResepSaya";
import ResepTersimpan from "./pages/ResepTersimpan";
import UploadResep from "./pages/UploadResep";
import EditResep from "./pages/EditResep";
import Pengaturan from "./pages/Pengaturan";
import LihatResepSaya from "./pages/LihatResepSaya";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cekdapur" element={<CekDapur />} />
        <Route path="/detailresep/:id" element={<DetailResep />} />
        <Route path="/profil-publik/:id" element={<ProfilPublik />} />

        {/* PRIVATE ROUTES (Hanya bisa diakses jika login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profil" element={<EditProfil />} />
          <Route path="/resepsaya" element={<ResepSaya />} />
          <Route path="/reseptersimpan" element={<ResepTersimpan />} />
          <Route path="/uploadresep" element={<UploadResep />} />
          <Route path="/edit-resep/:id" element={<EditResep />} /> 
          <Route path="/lihat-resep-saya/:id" element={<LihatResepSaya />}/>

          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;