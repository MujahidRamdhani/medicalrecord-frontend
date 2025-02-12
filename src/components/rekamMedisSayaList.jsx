import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import authStore from  "../features/authStore";

const RekamMedisSayaList = () => {
  const {user, logout, isLoading, isError, message } = authStore();
  const [error, setError] = useState(null);
  const [rekamMedis, setRekamMedis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 10; 
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); // Untuk pencarian berdasarkan diagnosis

  const getRekamMedisList = async () => {
    try {
      setLoading(true); // Mulai animasi loading
      const response = await axios.get(
        `http://34.142.169.61:5000/api/rekamMedis/HistoryRekamMedisFilterByPasienLogin`
      );
      const rmData = Array.isArray(response.data.data) ? response.data.data : [];
      setRekamMedis(rmData);
    } catch (error) {
      console.error("Error fetching rekam medis data:", error);
      setError("Gagal memuat data rekam medis.");
    } finally {
      setLoading(false); // Selesai animasi loading
    }
  };

  useEffect(() => {
    getRekamMedisList();
  }, []);
  

  const indexOfLastData = currentPage * listPerPage;
  const indexOfFirstData = indexOfLastData - listPerPage;
  const currentData = rekamMedis
    .filter((rm) => rm.Diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) // Filter by diagnosis
    .slice(indexOfFirstData, indexOfLastData);

  const totalPages = Math.ceil(rekamMedis.length / listPerPage);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openModalDetail = (record) => {
    setSelectedRecord(record);
    setIsModalOpenDetail(true);
    console.log('record', record);
  };

  const closeModalDetail = () => {
    setSelectedRecord(null);
    setIsModalOpenDetail(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="notification is-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Rekam Medis Saya</h1>
      <h2 className="subtitle">List Rekam Saya</h2>

      {/* Field Pencarian */}
      <div className="field">
        <div className="columns is-vcentered">

          {/* Kolom untuk Field Input */}
          <div className="column is-one-third">
            <div className="control has-icons-left">
              <input
                type="text"
                className="input is-small"
                placeholder="Cari berdasarkan Diagnosis"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="icon is-left">
                <FaSearch />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Rekam Medis */}
      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Diagnosis</th>
              <th>Tanggal Periksa</th>
              <th>Nama Dokter</th>
              <th>Tempat Periksa</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((rm, index) => (
                <tr key={rm.IdTransaksiBlockchain}>
                  <td>{indexOfFirstData + index + 1}</td>
                  <td>{rm.Diagnosis}</td>
                  <td>
                    {new Date(rm.Tgl_Periksa).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{rm.Nama_Dokter}</td>
                  <td>{rm.Nama_Pelayanan_Kesehatan}</td>
                  <td>
                    <div className="buttons is-right">
                      <button
                        className="button is-dark is-small"
                        onClick={() => openModalDetail(rm)}
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">
                  Data Rekam Medis Tidak Ditemukan
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
 
      {/* Modal */}
      {isModalOpenDetail && (
        <div className={`modal ${isModalOpenDetail ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeModalDetail}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Detail Rekam Medis</p>
              <button className="delete" aria-label="close" onClick={closeModalDetail}></button>
            </header>
            <section className="modal-card-body">
            <p><strong>Id:</strong> {selectedRecord.IdTransaksiBlockchain}</p>
            <p><strong>No Rekam Medis:</strong> {selectedRecord.No_RM}</p>
            <p><strong>NIK Pasien:</strong> {selectedRecord.NIK_Pasien}</p>
            <p><strong>Nama Pasien:</strong> {selectedRecord.Nama_Pasien}</p>
            <p>
              <strong>Tanggal Periksa:</strong> {new Date(selectedRecord.Tgl_Periksa).toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
            <p><strong>Tinggi Badan:</strong> {selectedRecord.Tinggi_Badan} cm</p>
            <p><strong>Berat Badan:</strong> {selectedRecord.Berat_Badan} kg</p>
            <p><strong>Tekanan Darah:</strong> {selectedRecord.Tekanan_Darah}</p>
            <p><strong>Nadi:</strong> {selectedRecord.Detak_Nadi} bpm</p>
            <p><strong>Detak Jantung:</strong> {selectedRecord.Detak_Jantung} bpm</p>
            <p><strong>Pernafasan:</strong> {selectedRecord.Pernafasan} bpm</p>
            <p><strong>Suhu Badan:</strong> {selectedRecord.Suhu}°C</p>
            <p><strong>Keluhan Utama:</strong> {selectedRecord.Keluhan_Utama}</p>
            <p><strong>Keluhan Tambahan:</strong> {selectedRecord.Keluhan_Tambahan}</p>
            <p><strong>Lama Sakit:</strong> {selectedRecord.Lama_Sakit}</p>
            <p><strong>Alergi:</strong> {selectedRecord.Alergi}</p>
            <p><strong>Diagnosis:</strong> {selectedRecord.Diagnosis}</p>
            <p><strong>Keterangan Diagnosis:</strong> {selectedRecord.Keterangan_Diagnosis}</p>
            <p><strong>Tindakan:</strong> {selectedRecord.Tindakan}</p>
            <p><strong>Obat Diberikan:</strong> {selectedRecord.Obat_Diberikan}</p>
            <p><strong>NIP Dokter:</strong> {selectedRecord.NIP_Dokter}</p>
            <p><strong>Nama Dokter:</strong> {selectedRecord.Nama_Dokter}</p>
            <p><strong>Nama Pelayanan Kesehatan:</strong> {selectedRecord.Nama_Pelayanan_Kesehatan}</p>
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={closeModalDetail}>Tutup</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
export default RekamMedisSayaList;

