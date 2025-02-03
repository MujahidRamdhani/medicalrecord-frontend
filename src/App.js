import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PelayananRegistrasi from "./components/PelayananFormRegistrasi";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import RekamMedisPasien from "./pages/rekamMedisPasien";
import RekamMedisPasienDetail from "./pages/rekamMedisPasienDetail";
import PemeriksaanDokter from "./pages/DokterJanjiTemu";
import RekamMedisSaya from "./pages/rekamMedisSaya";
import HakAkses from "./pages/HakAkses";
import AdminEnrollCA from "./pages/AdminEnrollCA";
import DokterRegistrasi from "./pages/DokterRegistrasi";
import PasienRegistrasi from "./pages/PasienRegistrasi";
import DokterDaftar from "./pages/DokterDaftar";
import PasienDaftar from "./pages/PasienDaftar";
import PasienKelola from "./pages/PasienKelola";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registrasipelayanan" element={<PelayananRegistrasi />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/enrollCA" element={<AdminEnrollCA />} />
          <Route path="/registrasiDokter" element={<DokterRegistrasi />} />
          <Route path="/registrasiPasien" element={<PasienRegistrasi />} />
          <Route path="/daftarDokter" element={<DokterDaftar />} />
          <Route path="/daftarPasien" element={<PasienDaftar />} />
          <Route path="/kelolaPemeriksaan" element={<PasienKelola />} />
          <Route path="/rekamMedisPasien" element={<RekamMedisPasien />} />
          <Route path="/rekamMedisDetail/:No_RM" element={<RekamMedisPasienDetail />} />
          <Route path="/pemeriksaanDokter" element={<PemeriksaanDokter />} />
          <Route path="/rekamMedis" element={<RekamMedisSaya />} />
          <Route path="/hakAkses" element={<HakAkses />} />
          <Route path="/profileakun" element={<Profile />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
