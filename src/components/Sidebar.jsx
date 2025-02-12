import React, { useEffect, useState  } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import authStore from "../features/authStore";
import axios from "axios";
import {
  IoPerson, IoHome, IoLogOut, IoBuild, IoDocumentLockSharp,
  IoFileTrayFull, IoDocumentText, IoGitNetworkOutline,
  IoHourglassSharp, IoPersonAddSharp, IoRibbonSharp,
  IoPeopleCircleOutline, IoPeopleCircleSharp
} from "react-icons/io5";

const Sidebar = ({ isSidebarOpen }) => {
  const { user, logout, isLoading, isError, message } = authStore();
  const navigate = useNavigate();
  const [namaPelayanan, setNamaPelayanan] = useState(null);
   const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Updated user in useEffect:', user);
  }, [user]);

  useEffect(() => {
    const fetchNamaPelayanan = async () => {
      if (user && (user.role === "dokter" || user.role === "adminpelayanan")) {
        try {
          const response = await axios.get(
            `http://34.142.169.61:5000/api/users/${user.idRole}/${user.role}`
          );
          setNamaPelayanan(response.data.data.nama);
          console.log("response rs", response);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data.");
        }
      }
    };

    fetchNamaPelayanan();
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault(); // Hindari navigasi default NavLink
    console.log("Attempting logout...");
    try {
      await logout();
      console.log("Logout successful, navigating to /login");
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div
      style={{
        width: isSidebarOpen ? '250px' : '0',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        backgroundColor: '#1A1A1D',
        color: '#fff',
        height: '100vh',
        position: 'fixed',
        top: '40px',
        left: '0',
      }}
    >
      <aside className={`menu pl-2 has-shadow custom-sidebar`}>
      <p className="menu-label" style={{ fontSize: '0.500rem', color: '#37AFE1' }}>
        {namaPelayanan ? <>{namaPelayanan}</> : null}
      </p>


        
        {user && (
          <p className="menu-label">Menu {user.role.replace(/^./, (c) => c.toUpperCase())}</p>
        )}

        <ul className="menu-list">
          <li><NavLink to="/dashboard"><IoHome /> Dashboard</NavLink></li>
          {user && user.role === "adminsistem" && (
            <li><NavLink to="/users"><IoPerson /> User</NavLink></li>
          )}
        </ul>

        {user && user.role === "adminsistem" && (
          <div>
            <p className="menu-label">Certificate Authority</p>
            <ul className="menu-list">
              <li><NavLink to="/enrollCA"><IoRibbonSharp /> Enroll CA</NavLink></li>
            </ul>
          </div>
        )}

        {user && user.role === "adminpelayanan" && (
          <div>
            <p className="menu-label">Registrasi</p>
            <ul className="menu-list">
              <li><NavLink to="/registrasiDokter"><IoPersonAddSharp /> Registrasi Dokter</NavLink></li>
              <li><NavLink to="/registrasiPasien"><IoPersonAddSharp /> Registrasi Pasien</NavLink></li>
            </ul>
            <p className="menu-label">Pelayanan Kesehatan</p>
            <ul className="menu-list">
              <li><NavLink to="/daftarDokter"><IoPeopleCircleOutline /> Daftar Dokter</NavLink></li>
              <li><NavLink to="/daftarPasien"><IoPeopleCircleSharp /> Daftar Pasien</NavLink></li>
              <li><NavLink to="/kelolaPemeriksaan"><IoGitNetworkOutline /> Kelola Pemeriksaan</NavLink></li>
            </ul>
          </div>
        )}

        {user && user.role === "pasien" && (
          <div>
            <p className="menu-label">Rekam Medis</p>
            <ul className="menu-list">
              <li><NavLink to="/rekamMedis"><IoDocumentText /> Rekam Medis Saya</NavLink></li>
              <li><NavLink to="/hakAkses"><IoDocumentLockSharp /> Hak Akses</NavLink></li>
            </ul>
          </div>
        )}

        {user && user.role === "dokter" && (
          <div>
            <p className="menu-label">Rekam Medis</p>
            <ul className="menu-list">
              <li><NavLink to="/rekamMedisPasien"><IoFileTrayFull /> Rekam Medis Pasien</NavLink></li>
              <li><NavLink to="/pemeriksaanDokter"><IoHourglassSharp /> Daftar Pemeriksaan</NavLink></li>
            </ul>
          </div>
        )}

        <p className="menu-label">Pengaturan</p>
        <ul className="menu-list">
          <li><NavLink to="/profileakun"><IoBuild /> Profile & Akun</NavLink></li>
          <li>
            <NavLink to="/login" onClick={handleLogout}>
              <IoLogOut /> Logout
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
