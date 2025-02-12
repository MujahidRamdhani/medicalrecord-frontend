import React, { useState, useEffect } from "react";
import axios from "axios";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 5; // Display 5 users per page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://34.142.169.61:5000/api/users/findAllUsers");
      const usersData = Array.isArray(response.data.data) ? response.data.data : [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally{
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.wallet && user.wallet.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate the index range for current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination function
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
      <h1 className="title">User</h1>
      <h2 className="subtitle">List User</h2>

      {/* Search Input */}
      <div className="field" style={{ maxWidth: "30%" }}>
        <div className="control">
          <input
            className="input is-small"
            type="text"
            placeholder="Cari berdasarkan Nama, Email, Role, atau CA"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>CA?</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.idAkun}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.wallet || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="has-text-centered">
                  Tidak Ada User
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
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
                  className={`pagination-link ${
                    currentPage === pageNumber ? "is-current" : ""
                  }`}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Userlist;
