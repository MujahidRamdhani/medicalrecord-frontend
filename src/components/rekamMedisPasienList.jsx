import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const RekamMedisPasienList = () => {
  const [rekamMedis, setRekamMedis] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const listPerPage = 10;

  useEffect(() => {
    getRekamMedisList();
  }, []);

  useEffect(() => {
    // Filter data berdasarkan No RM, NIK, atau Nama Pasien
    const query = searchQuery.toLowerCase();
    const searched = rekamMedis.filter(
      (rm) =>
        rm.No_RM.toLowerCase().includes(query) ||
        rm.NIK_Pasien.toLowerCase().includes(query) ||
        rm.Nama_Pasien?.toLowerCase().includes(query) // Pastikan Nama_Pasien ada
    );
    setFilteredData(searched);
  }, [searchQuery, rekamMedis]);

  const getRekamMedisList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://34.142.169.61:5000/api/rekamMedis/GetAllRekamMedisByDokterIdFilteredHakAksesTrue"
      );
      const rmData = Array.isArray(response.data.data) ? response.data.data : [];
      const updatedRmData = await Promise.all(
        rmData.map(async (rm) => {
          console.log('nik pasien', rm.NIK_Pasien)
          try {
            const pasienResponse = await axios.put(
              `http://34.142.169.61:5000/api/users/findAllUsersByNIK/${rm.NIK_Pasien}`
            );
            console.log('data pasien', pasienResponse.data.data)
            return {
              ...rm,
              Nama_Pasien: pasienResponse.data.data.nama, // Gunakan properti yang sesuai dari respons API
            };
          } catch (error) {
            console.error(`Error fetching data for NIK ${rm.NIK_Pasien}:`, error);
            return rm; // Jika gagal, tetap kembalikan data asli tanpa Nama_Pasien
          }
        })
      );
      setRekamMedis(updatedRmData);
      setFilteredData(updatedRmData);
    } catch (error) {
      console.error("Error fetching rekam medis:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastData = currentPage * listPerPage;
  const indexOfFirstData = indexOfLastData - listPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / listPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Rekam Medis Pasien</h1>
      <h2 className="subtitle">List Rekam Medis</h2>

      {/* Search Field */}
      <div className="field">
        <p className="control" style={{ maxWidth: "300px" }}>
          <input
            className="input is-small"
            type="text"
            placeholder="Cari No RM, NIK, atau Nama Pasien"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </p>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>No RM</th>
              <th>NIK</th>
              <th>Nama Pasien</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((rm, index) => (
                <tr key={rm.idAkun}>
                  <td>{indexOfFirstData + index + 1}</td>
                  <td>{rm.No_RM}</td>
                  <td>{rm.NIK_Pasien}</td>
                  <td>{rm.Nama_Pasien || "Tidak Ditemukan"}</td>
                  <td>
                    <NavLink to={`/rekamMedisDetail/${rm.No_RM}`}>
                      Lihat Rekam Medis
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="has-text-centered">
                  Rekam Medis Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="pagination" role="navigation" aria-label="pagination">
        <button
          className="pagination-previous"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-next"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <li key={pageNumber}>
                <button
                  className={`pagination-link ${
                    currentPage === pageNumber ? "is-current" : ""
                  }`}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default RekamMedisPasienList;
