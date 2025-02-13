import React, { useState, useEffect } from "react";
import axios from "axios";

const DokterList = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const doctorsPerPage = 5;

  // Ambil data dokter dari API menggunakan Axios
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.rmchain.web.id/api/users/findAllDokterByIdPelayanan");
        setAllDoctors(response.data.data);
      } catch (error) {
        console.error("Gagal memuat data dokter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredDoctors = allDoctors.filter((doctor) =>
    doctor.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginasi
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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
      <h1 className="title">Dokter</h1>
      <h2 className="subtitle">Daftar Dokter</h2>

      {/* Field Pencarian */}
      <div className="field">
        <div className="control" style={{ maxWidth: "300px" }}>
          <input
            className="input is-small"
            type="text"
            placeholder="Masukkan nama dokter..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
            }}
          />
        </div>
      </div>

        <div className="table-container">
          <table className="table is-striped is-bordered is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>ID</th>
                <th>Nama</th>
                <th>Spesialis</th>
                <th>Jenis Kelamin</th>
                <th>No Telepon</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, index) => (
                  <tr key={doctor.nip}>
                    <td>{indexOfFirstDoctor + index + 1}</td>
                    <td>{doctor.nip}</td>
                    <td>{doctor.nama}</td>
                    <td>{doctor.spesialis}</td>
                    <td>{doctor.jenisKelamin}</td>
                    <td>{doctor.nomorTelepon}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="has-text-centered">
                    Tidak ada data yang ditemukan.
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

export default DokterList;
