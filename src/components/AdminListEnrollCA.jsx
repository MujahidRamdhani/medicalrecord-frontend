import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminListEnrollCA = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const enrollCA = async (email, role) => {
    try {
      if (!email || !role) {
        toast.error("Email dan Role wajib diisi.");
        return;
      }
      setLoading(true);
      await axios.post("http://localhost:9999/api/users/InvokeCaUser", {
        emailUser: email,
        roleUser: role,
      });
      toast.success("CA berhasil diberikan!");
      getUsers(); // Refresh user list
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Terjadi kesalahan saat enroll CA."
      );
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:9999/api/users/findAllUsersWithoutCA"
      );
      const usersData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter((user) =>
    [user.email, user.nama, user.role]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDetailClick = (pelayananKesehatan) => {
    setSelectedDetail(pelayananKesehatan);
  };

  return (
    <div className="container">
      <h1 className="title">Certificate Authority</h1>
      <h2 className="subtitle">Enroll Users</h2>

      <div className="field" style={{ maxWidth: "30%" }}>
        <div className="control">
          <input
            className="input is-small"
            type="text"
            placeholder="Cari berdasarkan email, nama, atau role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Pelayanan Kesehatan</th>
              <th>Enroll CA</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.idAkun}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.nama}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === "ADMINPELAYANAN" ? (
                      <button
                        className="button is-link is-small is-unstyled"
                        onClick={() => handleDetailClick(user.pelayananKesehatan)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "0",
                          cursor: "pointer",
                          color: "#3273dc",
                        }}
                      >
                        Lihat Detail
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="button is-dark is-small"
                      onClick={() => enrollCA(user.email, user.role)}
                      disabled={loading}
                    >
                      {loading ? "Loading.." : "Enroll CA"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">
                  Tidak Ada User
                </td>
              </tr>
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

      {selectedDetail && (
        <div className={`modal is-active`}>
          <div
            className="modal-background"
            onClick={() => setSelectedDetail(null)}
          ></div>
          <div className="modal-content">
            <div className="box">
              <h3 className="title is-4">Detail Pelayanan Kesehatan</h3>
              <p>
                <strong>Kode Pelayanan:</strong> {selectedDetail.kodePelayanan}
              </p>
              <p>
                <strong>Nama:</strong> {selectedDetail.nama}
              </p>
              <p>
                <strong>Tipe:</strong> {selectedDetail.tipe}
              </p>
              <p>
                <strong>Alamat:</strong> {selectedDetail.alamat}
              </p>
              <p>
                <strong>Nomor Telepon:</strong> {selectedDetail.nomorTelepon}
              </p>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setSelectedDetail(null)}
          ></button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminListEnrollCA;
