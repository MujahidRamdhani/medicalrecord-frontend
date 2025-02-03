import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import authStore from  "../features/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RekamMedisPasienDetail = () => {
  const {user} = authStore();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { No_RM } = useParams(); // Mengambil No_RM dari URL
  const [rekamMedis, setRekamMedis] = useState([]);
  const [pasien, setPasien] = useState([]);
  const [noRM, setNoRM] = useState("");
  const [nik, setNik] = useState("");
  //const [nipDokter, setNipDokter] = useState("");
  //const [dokter, setDokter] = useState("");
  const [namaPelayanan, setNamaPelayanan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 5; 
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); // Untuk pencarian berdasarkan diagnosis
  const [newRekamMedis, setNewRekamMedis] = useState({
    No_RM: "",
    NIK_Pasien: "",
    Nama_Pasien: "",
    Keluhan_Utama: "",
    Keluhan_Tambahan: "",
    Lama_Sakit: "",
    Alergi: "",
    Tekanan_Darah: "",
    Tinggi_Badan: "",
    Berat_Badan: "",
    Detak_Nadi: "",
    Pernafasan: "",
    Suhu: "",
    Detak_Jantung: "",
    Diagnosis: "",
    Keterangan_Diagnosis: "",
    Tindakan: "",
    Obat_Diberikan: "",
    NIP_Dokter: "",
    Nama_Dokter: "",
    Nama_Pelayanan_Kesehatan: "",
  });
  
  const readonlyFields = [
    'No_RM',
    'NIK_Pasien',
    'Nama_Pasien',
    'NIP_Dokter',
    'Nama_Dokter',
    'Nama_Pelayanan_Kesehatan'
  ];

  useEffect(() => {
    if (No_RM) {
      const extractedNik = No_RM.replace(/^RM-/, ""); // Hapus 'RM-' di awal dan ambil angka
      setNik(extractedNik); // Simpan hasil ke state nik
      setNoRM(No_RM);
      console.log("Extracted NIK:", extractedNik); // Debugging
    }
  }, [No_RM]);

  const getRekamMedisList = async () => {
    try {
      const response = await axios.put(`http://localhost:9999/api/rekamMedis/HistoryRekamMedis/${No_RM}`);
      const rmData = Array.isArray(response.data.data) ? response.data.data : [];
      setRekamMedis(rmData);
      
      //if (rmData.length > 0) {
        // const retrievedNik = rmData[0].NIK_Pasien;
        // setNik(retrievedNik);
        //const No_RM = rmData[0].No_RM;
        //setNoRM(No_RM);
        //console.log('NIK:', retrievedNik);
      // } else {
      //   //setNik(""); // Jika data kosong, set nilai default
      //   console.log("No records found.");
      // }
  
      console.log("RM Data:", rmData);
    } catch (error) {
      console.error("Error fetching rekam medis data:", error);
    } 
  };
  
  const getPasien = async () => {
    try {
      const response = await axios.put(`http://localhost:9999/api/users/findAllUsersByNIK/${nik}`);
      const pasienData = response.data.data;
      setPasien(pasienData);
      
      console.log('response', response.data.data)
      console.log("Pasien Data:", pasienData);
    } catch (error) {
      console.error("Error fetching pasien data:", error);
    }
  };

  useEffect(() => {
    const fetchNamaPelayanan = async () => {
      console.log('role', user.role)
      try {
        const response = await axios.get(`http://localhost:9999/api/users/${user.idRole}/${user.role}`);
        setNamaPelayanan(response.data.data.nama);
        console.log('response rs', response.data.data.nama); 
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchNamaPelayanan();
  }, [user]);

  // useEffect untuk otomatis mengisi newRekamMedis berdasarkan NIK dan No_RM
  useEffect(() => {
    setNewRekamMedis((prevState) => ({
      ...prevState,
      No_RM: noRM,
      NIK_Pasien: nik,
      Nama_Pasien: pasien.nama,
      NIP_Dokter: user.idRole,
      Nama_Dokter: user.nama,
      Nama_Pelayanan_Kesehatan: namaPelayanan,
    }));
  }, [nik, noRM, pasien, namaPelayanan]);
  

  useEffect(() => {
    getRekamMedisList();
  }, []); 
  
  useEffect(() => {
    if (nik) {
      console.log('nik', nik)
      getPasien(); 
    }
  }, [nik]); // Dependensi 
  

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form data, but keep No_RM and NIK_Pasien
    setNewRekamMedis((prevState) => ({
      ...prevState,
      Keluhan_Utama: "",
      Keluhan_Tambahan: "",
      Lama_Sakit: "",
      Alergi: "",
      Tekanan_Darah: "",
      Tinggi_Badan: "",
      Berat_Badan: "",
      Detak_Nadi: "",
      Pernafasan: "",
      Suhu: "",
      Detak_Jantung: "",
      Diagnosis: "",
      Keterangan_Diagnosis: "",
      Tindakan: "",
      Obat_Diberikan: "",
    }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRekamMedis((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pastikan data yang relevan diubah menjadi tipe number
    const formattedRekamMedis = {
      ...newRekamMedis,
      Tinggi_Badan: Number(newRekamMedis.Tinggi_Badan) || 0,
      Berat_Badan: Number(newRekamMedis.Berat_Badan) || 0,
      Suhu: Number(newRekamMedis.Suhu) || 0
    };

    setIsSubmitting(true);
  
    try {
      const response = await axios.post(`http://localhost:9999/api/rekamMedis/CreateAndUpdateRekamMedis`, formattedRekamMedis);

      await getRekamMedisList();
      setLoading(!loading);

      // Notifikasi sukses
      toast.success(
        <div>
          <p>Update Riwayat Rekam Medis berhasil!</p>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );

      closeModal();
      console.log(response.data);
    } catch (error) {
      //console.error("Error adding Rekam Medis:", error);
      const errorMessage =
              error.response && error.response.data.msg
                ? error.response.data.msg
                : "Update Riwayat Rekam Medis gagal!";
      
            // Notifikasi error
            toast.error(`Gagal: ${errorMessage}`, {
              position: "top-right",
              autoClose: 5000,
            });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container">
      <ToastContainer />
      <h1 className="title">Rekam Medis Pasien</h1>
      <h2 className="subtitle">List Rekam Medis</h2>

      <p>No Rekam Medis : {No_RM}</p>
      <p>Nama Pasien : {pasien.nama}</p>
      <p>Alamat : {pasien.alamat}</p>

      {/* Field Pencarian */}
      <div className="field">
        <div className="columns is-vcentered">

          {/* Kolom untuk Field Input */}
          <div className="column is-one-third"> {/* Sesuaikan kelas ini untuk lebar */}
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

      {/* Tombol Add Rekam Medis */}
      <div className="field">
        <button className="button is-dark is-small" onClick={openModal}>Update Rekam Medis</button>
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
            {rekamMedis.length === 0 ? (
              <tr>
                <td colSpan="6" className="has-text-centered">
                  Belum Ada Data Rekam Medis
                </td>
              </tr>
            ) : (
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
            )}
          </tbody>
        </table>
      </div>
      
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

      {/* Modal Form Add Rekam Medis */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Update Riwayat Rekam Medis</p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              {Object.keys(newRekamMedis).map((key) => (
                <div className="field" key={key}>
                  <label className="label">{key.replace('_', ' ')}</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name={key}
                      value={newRekamMedis[key]}
                      onChange={handleChange}
                      required
                      readOnly={readonlyFields.includes(key)} // Set readonly conditionally
                    />
                  </div>
                </div>
              ))}
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button
                      className={`button is-dark ${
                        isSubmitting ? "is-loading" : ""
                      }`}
                      type="submit"
                      disabled={isSubmitting} // Nonaktifkan tombol saat submit
                    >
                      Update Riwayat
                    </button>
                </div>
                <div className="control">
                  <button className="button is-light" type="button" onClick={closeModal}>
                    Batal
                  </button>
                </div>
              </div>
            </form>
            </section>
          </div>
        </div>
      )}


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
 
export default RekamMedisPasienDetail;
