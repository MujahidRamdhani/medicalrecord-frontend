import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";
//import { FaEdit, FaTrashAlt } from "react-icons/fa";

const PengajuanHakList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Display 10 users per page

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9999/api/users/findAllUsers");
      const usersData = Array.isArray(response.data.data) ? response.data.data : [];
      setUsers(usersData);

      console.log("Users Data:", usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Calculate the index range for current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Pagination function
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Pengajuan Hak Akses RM</h1>
      <h2 className="subtitle">List Pengajuan ss</h2>

      {/* Table */}
      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>ID Pasien</th>
              <th>Nama Pasien</th>
              <th>No RM</th>
              <th>Pengajuan</th>
              {/* <th>Aksi</th> */}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.idAkun}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.nama}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.wallet}</td>
                {/* <td>
                  <div className="buttons is-right">
                    <button className="button is-info is-small">
                      <FaEdit />
                    </button>
                    <button className="button is-danger is-small">
                      <FaTrashAlt />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
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
    </div>
  );
};

export default PengajuanHakList;
