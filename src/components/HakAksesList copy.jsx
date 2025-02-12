import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";

const HakAksesList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [dokterMap, setDokterMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const usersPerPage = 10;

  useEffect(() => {
    getUsers();
    getDokter();
  }, []);

  const getUsers = async () => {
    try {
      //setLoading(true);

      const response = await axios.get(
        "http://34.142.169.61:5000/api/hakAkses/GetAllhakAksesByPasienNIK"
      );
      const usersData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    // } finally{
    //   setLoading(false);
    }
  };

  const getDokter = async () => {
    try {
      const response = await axios.get("http://34.142.169.61:5000/api/users/findAllUsers");
      const dokterList = response.data.data.filter(user => user.role.toUpperCase() === "DOKTER");
  
      const dokterMapping = dokterList.reduce((acc, dokter) => {
        acc[dokter.nip] = dokter.nama;
        return acc;
      }, {});
  
      setDokterMap(dokterMapping);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const updateHakAkses = async (Id_Hak_Akses, status) => {
    setLoading(Id_Hak_Akses);
    try {
      const response = await axios.put(
        `http://34.142.169.61:5000/api/hakAkses/UpdatehakAkses/${Id_Hak_Akses}`,
        { Hak_Akses: status }
      );
      if (response.status === 200) {
        toast.success(`Hak akses berhasil diperbarui menjadi ${status}!`);
        getUsers();
      } else {
        throw new Error("Gagal memperbarui hak akses");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui hak akses.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error updating hak akses:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(user => 
    user.NIP_Dokter.includes(searchTerm) || 
    dokterMap[user.NIP_Dokter]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loader"></div>
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div className="notification is-danger">{error}</div>;
  // }

  return (
    <div className="container">
      <ToastContainer />
      <h1 className="title">Hak Akses Dokter Terhadap Rekam Medis Saya</h1>
      <h2 className="subtitle">List Hak Akses Dokter</h2>

{/* Field Pencarian */}
      <div className="field">
        <div className="columns is-vcentered">

          {/* Kolom untuk Field Input */}
          <div className="column is-one-third"> 
            <div className="control has-icons-left">
              <input
                className="input is-small"
                type="text"
                placeholder="Masukkan NIP atau Nama Dokter"
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

      {/* Table */}
      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>ID Hak Akses</th>
              <th>NIP Dokter</th>
              <th>Nama Dokter</th>
              <th>Hak Akses</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.Id_Hak_Akses}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.Id_Hak_Akses}</td>
                  <td>{user.NIP_Dokter}</td>
                  <td>{dokterMap[user.NIP_Dokter] || "Tidak ditemukan"}</td>
                  <td>{user.Hak_Akses}</td>
                  <td>
                    {user.Hak_Akses === "False" ? (
                      <button
                        className={`button is-success is-small ${
                          loading === user.Id_Hak_Akses ? "is-loading" : ""
                        }`}
                        onClick={() => updateHakAkses(user.Id_Hak_Akses, "True")}
                        disabled={loading === user.Id_Hak_Akses}
                      >
                        {loading === user.Id_Hak_Akses ? (
                          <FaSpinner className="icon-spin" />
                        ) : (
                          "Berikan Hak Akses"
                        )}
                      </button>
                    ) : (
                      <button
                        className={`button is-danger is-small ${
                          loading === user.Id_Hak_Akses ? "is-loading" : ""
                        }`}
                        onClick={() => updateHakAkses(user.Id_Hak_Akses, "False")}
                        disabled={loading === user.Id_Hak_Akses}
                      >
                        {loading === user.Id_Hak_Akses ? (
                          <FaSpinner className="icon-spin" />
                        ) : (
                          "Cabut Hak Akses"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">
                  Hak Akses Tidak Ditemukan
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

export default HakAksesList;
