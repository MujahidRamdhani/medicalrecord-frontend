import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Select from "react-select"; // Import react-select
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify

const PasienListKelola = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("BelumSelesai");
  const [isSaving, setIsSaving] = useState(false); // State untuk tombol loading
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [itemsPerPage] = useState(5); // Jumlah item per halaman
  const [newRecord, setNewRecord] = useState({
    nikPasien: "",
    nipDokter: "",
    tanggal: "",
  });

  // const getLocalISOString = () => {
  //   const now = new Date();
  //   const offset = 7 * 60; // Offset WIB dalam menit (UTC+7)
  //   const localDate = new Date(now.getTime() + offset * 60 * 1000); // Tambahkan offset ke waktu sekarang
  //   return localDate.toISOString().slice(0, 19).replace('T', ' ');
  // };

  const applyFilter = (data, filterType) => {
    return data
      .filter((user) => (filterType === "BelumSelesai" ? user.selesai === "BelumSelesai" : user.selesai === "Selesai"))
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Urutkan tanggal secara menurun
  };
  
  // Handle search and filter
  const filteredRecords = applyFilter(
    records.filter(
      (record) =>
        (record.namaPasien?.toLowerCase() || "").includes(searchTerm) ||
        (record.namaDokter?.toLowerCase() || "").includes(searchTerm)
    ),
    filter
  );
  

  const fetchRecords = () => {
    axios
      .get("http://34.142.169.61:5000/api/users/findAllPemeriksaanByIdPelayanan")
      .then((response) => {
        const data = response.data.data;
        setRecords(data);
      })
      .catch((error) => console.error("Error fetching records:", error));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    axios
      .get("http://34.142.169.61:5000/api/users/findAllPasien")
      .then((response) => {
        const options = response.data.data.map((patient) => ({
          value: patient.nik,
          label: `${patient.nik} - ${patient.nama}`,
        }));
        setPatients(options);
      })
      .catch((error) => console.error("Error fetching patients:", error));

    axios
      .get("http://34.142.169.61:5000/api/users/findAllDokterByIdPelayanan")
      .then((response) => {
        const options = response.data.data.map((doctor) => ({
          value: doctor.nip,
          label: `${doctor.nip} - ${doctor.nama}`,
        }));
        setDoctors(options);
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const formatTanggalLokal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRecord({ nikPasien: "", nipDokter: "", tanggal: "" });
  };

  const handleSelectChange = (name, selectedOption) => {
    setNewRecord((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true); // Set loading state to true
  
    // Pastikan tanggal dalam format ISO-8601 lengkap
    const formatedTanggal = new Date(newRecord.tanggal).toISOString();
  
    // Menggunakan formatedTanggal dalam request
    const updatedRecord = { ...newRecord, tanggal: formatedTanggal };
  
    axios
      .post("http://34.142.169.61:5000/api/users/addPemeriksaan", updatedRecord)
      .then((response) => {
        toast.success("Pemeriksaan dan Hak Akses berhasil ditambahkan!");
        fetchRecords(); // Refresh tabel setelah data baru ditambahkan
        closeModal();
      })
      .catch((error) => {
        toast.error("Gagal menambahkan Pemeriksaan.");
        console.error("Error adding record:", error);
      })
      .finally(() => {
        setIsSaving(false); // Set loading state ke false setelah selesai
      });
  };
  
  

  // Hitung data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung total halaman
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <ToastContainer />
      <h1 className="title">Kelola Pemeriksaan</h1>
      <h2 className="subtitle">Daftar Pemeriksaan Pasien</h2>

      <div className="field is-grouped">
        <div className="control" style={{ maxWidth: "300px", marginRight: "1rem" }}>
          <input
            className="input is-small"
            type="text"
            placeholder="Cari pasien atau dokter..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="control">
          <button className="button is-dark is-small" onClick={openModal}>
            <FaPlus style={{ marginRight: "5px" }} />
            Tambah Pemeriksaan
          </button>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            className={`button is-small ${filter === "BelumSelesai" ? "is-dark" : ""}`}
            onClick={() => setFilter("BelumSelesai")}
          >
            Belum Selesai
          </button>
        </div>
        <div className="control">
          <button
            className={`button is-small ${filter === "Selesai" ? "is-dark" : ""}`}
            onClick={() => setFilter("Selesai")}
          >
            Selesai
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>NIK Pasien</th>
              <th>Nama Pasien</th>
              <th>NIP Dokter</th>
              <th>Nama Dokter</th>
              <th>Tanggal Pemeriksaan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{record.nikPasien}</td>
                  <td>{record.namaPasien}</td>
                  <td>{record.nipDokter}</td>
                  <td>{record.namaDokter}</td>
                  <td>{formatTanggalLokal(record.tanggal)}</td>
                  <td>{record.selesai}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="has-text-centered">
                  Belum Ada Pemeriksaan.
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <li key={pageNumber}>
              <button
                className={`pagination-link ${currentPage === pageNumber ? "is-current" : ""}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Tambah Pemeriksaan</p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <form onSubmit={handleFormSubmit}>
              <section className="modal-card-body">
                <div className="field">
                  <label className="label">Pasien</label>
                  <div className="control">
                    <Select
                      options={patients}
                      onChange={(selected) => handleSelectChange("nikPasien", selected)}
                      placeholder="Cari pasien..."
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Dokter</label>
                  <div className="control">
                    <Select
                      options={doctors}
                      onChange={(selected) => handleSelectChange("nipDokter", selected)}
                      placeholder="Cari dokter..."
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tanggal Pemeriksaan</label>
                  <div className="control">
                    <input
                      className="input"
                      type="datetime-local"
                      name="tanggal"
                      value={newRecord.tanggal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>
              <footer className="modal-card-foot">
                <button
                  type="submit"
                  className={`button is-success ${isSaving ? "is-loading" : ""}`}
                  disabled={isSaving} // Disable tombol saat loading
                >
                  Tambah
                </button>
                <button type="button" className="button" onClick={closeModal}>
                  Batal
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasienListKelola;
