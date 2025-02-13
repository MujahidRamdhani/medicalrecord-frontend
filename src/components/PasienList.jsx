import React, { useState, useEffect } from "react";
import axios from "axios";

const PasienList = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const patientsPerPage = 5;

  // Ambil data pasien dari API menggunakan Axios
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.rmchain.web.id/api/users/findAllPasien");
        setAllPatients(response.data.data);
      } catch (error) {
        console.error("Gagal memuat data pasien:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Data yang difilter berdasarkan pencarian
  const filteredPatients = allPatients.filter((patient) =>
    patient.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Menghitung index pertama dan terakhir untuk setiap halaman
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Menghitung jumlah halaman
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Fungsi untuk berpindah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <h1 className="title">Pasien</h1>
      <h2 className="subtitle">Daftar Pasien</h2>

      {/* Field Pencarian */}
      <div className="field">
        <div className="control" style={{ maxWidth: "300px" }}> 
          <input
            type="text"
            className="input is-small"
            placeholder="Cari pasien berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

        <div className="table-container">
          <table className="table is-striped is-bordered is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Tempat, Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Alamat</th>
                <th>Gol. Darah</th>
                <th>No Telepon</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr key={patient.nik}>
                    <td>{indexOfFirstPatient + index + 1}</td>
                    <td>{patient.nik}</td>
                    <td>{patient.nama}</td>
                    <td>{`${patient.tempatLahir} ${new Date(patient.tanggalLahir).toLocaleDateString()}`}</td>
                    <td>{patient.jenisKelamin}</td>
                    <td>{patient.alamat}</td>
                    <td>{patient.golonganDarah}</td>
                    <td>{patient.nomorTelepon}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="has-text-centered">
                    Tidak ada pasien yang ditemukan.
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
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <li key={pageNumber}>
              <button
                className={`pagination-link ${currentPage === pageNumber ? "is-current" : ""}`}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default PasienList;
