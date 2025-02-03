import React, { useState, useEffect } from "react";
import axios from "axios";

const DokterJanjiTemuList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("BelumSelesai");
  const [loading, setLoading] = useState(null);

  const usersPerPage = 5;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:9999/api/users/findAllPemeriksaanByNIPDokter"
      );
      console.log('dataPemeriksaan', response.data.data)
      const usersData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUsers(usersData);
      applyFilter(usersData, filter);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally{
      setLoading(false);
    }
  };

  const applyFilter = (data, filterType) => {
    const filtered = data
      .filter((user) => user.selesai === filterType)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    applyFilter(users, filter);
  }, [filter, users]);

  useEffect(() => {
    if (searchQuery) {
      const searched = filteredUsers.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
          user.namaPasien.toLowerCase().includes(query) ||
          user.nikPasien.toLowerCase().includes(query)
        );
      });
      setFilteredUsers(searched);
    } else {
      applyFilter(users, filter);
    }
  }, [searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatTanggalLokal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
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
      <h1 className="title">Pemeriksaan Pasien</h1>
      <h2 className="subtitle">List Pemeriksaan</h2>

      <div className="buttons">
        <button
          className={`button is-small ${filter === "BelumSelesai" ? "is-dark" : "is-transparent"}`}
          onClick={() => setFilter("BelumSelesai")}
        >
          Belum Selesai
        </button>
        <button
          className={`button is-small ${filter === "Selesai" ? "is-dark" : "is-transparent"}`}
          onClick={() => setFilter("Selesai")}
        >
          Selesai
        </button>
      </div>

      <div className="field">
        <div className="control" style={{ maxWidth: "30%" }}>
          <input
            className="input is-small"
            type="text"
            placeholder="NIK/Nama Pasien"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginLeft: "4px" }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>NIK Pasien</th>
              <th>Nama Pasien</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Belum Ada Pemeriksaan
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user.idAkun}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.nikPasien}</td>
                  <td>{user.namaPasien}</td>
                  <td>{formatTanggalLokal(user.tanggal)}</td>
                  <td>{user.selesai}</td>
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
    </div>
  );
};

export default DokterJanjiTemuList;
