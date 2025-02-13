import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authStore from "../features/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormProfile = () => {
  const { user, isLoading, isError, message } = authStore();
  const [userData, setUserData] = useState(null);
  const [originalData, setOriginalData] = useState(null); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await axios.get('https://api.rmchain.web.id/api/users/findAllUsers');
          const userFromApi = response.data.data.find(u => u.email === user.email);
          setUserData(userFromApi);
          setOriginalData(userFromApi); // Simpan salinan data asli
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

   // Handle Form Input Change
  //  const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'nip' || name === 'idAdminSistem' || name === 'nik' || name === 'nama') return; // Field yang tidak dapat diubah
  //   setUserData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Filter input hanya angka untuk nomor telepon
    if (name === "nomorTelepon" && !/^\d*$/.test(value)) {
      return; // Abaikan input jika bukan angka
    }

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (user && user.role === "dokter" && !userData.spesialis) {
      toast.error("Anda harus memilih spesialis!");
      return;
    }

    if (!userData.nomorTelepon || userData.nomorTelepon.length < 12) {
      toast.error("Nomor telepon harus diisi dan memiliki panjang minimal 12 karakter!");
      return;
    }

    if (!userData.alamat || userData.alamat.trim() === "") {
      toast.error("Alamat tidak boleh kosong!");
      return;
    }


    setLoading(true);

    // Bandingkan data asli dengan data yang diubah
    const updatedData = {};
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== originalData[key]) {
        updatedData[key] = userData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      toast.info("Tidak ada perubahan pada data.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put("https://api.rmchain.web.id/api/users/updateProfile", updatedData);

      if (response.status === 200) {
        toast.success("Profil berhasil diperbaharui!");
        setOriginalData(userData); // Perbarui data asli setelah berhasil
      } else {
        toast.error("Gagal memperbarui profil.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbaharui profil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData){
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }
  

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak boleh kosong!');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password baru harus memiliki panjang minimal 8 karakter!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('https://api.rmchain.web.id/api/users/changePassword', {
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password berhasil diubah!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Gagal mengubah password.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah password.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {message}</div>;

  return (
    <div className="container">
      <ToastContainer />
      {user && userData && (
        <h2 className="subtitle is-5 has-text-centered mb-4">
          {user.role === "adminsistem" ? "Profil" : "Update Profile"}
        </h2>
      )}

      {/* Form untuk role Admin Sistem */}
      {user && user.role === "adminsistem" && userData && (
        <div className="card mb-5" style={{ border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="card-content">
            <div className="content">
              <form>
                <div className="columns is-variable is-8">
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="field">
                      <label className="label is-small">Id</label>
                      <div className="control">
                        <input type="text" className="input is-small readonly-input" value={userData.idAdminSistem || ''} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="field">
                      <label className="label is-small">Nama</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nama || ''}
                          name="nama"
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field has-text-centered">
                  {/* <button
                    className={`button is-dark is-small ${loading ? "is-loading" : ""}`}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    Update Profile
                  </button> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form untuk role Dokter */}
      {user && user.role === "dokter" && userData && (
        <div className="card mb-5" style={{ border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="card-content">
            <div className="content">
              <form>
                <div className="columns is-variable is-8">
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="field">
                        <label className="label is-small">NIP</label>
                        <div className="control">
                          <input
                            type="text"
                            className="input is-small readonly-input"
                            value={userData.nip || ''}
                            name="nip"
                            onChange={handleChange}
                            required
                            readOnly
                          />
                        </div>
                    </div>
                    <div className="field">
                    <label className="label is-small">Nama</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nama || ''}
                          name="nama"
                          onChange={handleChange}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                  <div className="field">
                      <label className="label is-small">Spesialisasi</label>
                      <div className="control">
                        <select className="select is-fullwidth is-small" 
                        value={userData.spesialis || ''}
                        onChange={handleChange}
                        name="spesialis">
                          <option value="">Pilih Spesialis</option>
                          <option value="UMUM">UMUM</option>
                          <option value="ANAK">ANAK</option>
                          <option value="KANDUNGAN">KANDUNGAN</option>
                          <option value="GIGI">GIGI</option>
                          <option value="PSIKOLOG">PSIKOLOG</option>
                          <option value="UROLOGI">UROLOGI</option>
                          <option value="JANTUNG">JANTUNG</option>
                          <option value="SARAF">SARAF</option>
                          <option value="THT">THT</option>
                          <option value="JIWA">JIWA</option>
                          <option value="PENYAKITDALAM">PENYAKITDALAM</option>
                          <option value="KULIT">KULIT</option>
                          <option value="MATA">MATA</option>
                          <option value="PARU">PARU</option>
                          <option value="GINJAL">GINJAL</option>
                          <option value="REHABILITAS">REHABILITAS</option>
                          <option value="ALERGI">ALERGI</option>
                          <option value="HIPNOTERAPIS">HIPNOTERAPIS</option>
                          <option value="BEDAH">BEDAH</option>
                          <option value="GIZI">GIZI</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">No Telepon</label>
                      <div className="control">
                        <input
                          type="tel"
                          className="input is-small"
                          value={userData.nomorTelepon || ''}
                          name="nomorTelepon"
                          onChange={handleChange}
                          maxLength={13}
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Alamat</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small"
                          value={userData.alamat || ''}
                          name="alamat"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field has-text-centered">
                  <button
                    className={`button is-dark is-small ${loading ? "is-loading" : ""}`}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form untuk role Pasien */}
      {user && user.role === "pasien" && userData && (
        <div className="card mb-5" style={{ border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="card-content">
            <div className="content">
              <form>
                <div className="columns is-variable is-8">
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="field">
                      <label className="label is-small">NIK</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nik || ''}
                          name="nik"
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Nama</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nama || ''}
                          name="nama"
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                    <div className="field">
                      <label className="label is-small">No Telepon</label>
                      <div className="control">
                        <input
                          type="tel"
                          className="input is-small"
                          value={userData.nomorTelepon || ''}
                          name="nomorTelepon"
                          onChange={handleChange}
                          maxLength={13}
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Pekerjaan</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small"
                          value={userData.pekerjaan || ''}
                          name="pekerjaan"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Alamat</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small"
                          value={userData.alamat || ''}
                          name="alamat"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field has-text-centered">
                  <button
                    className={`button is-dark is-small ${loading ? "is-loading" : ""}`}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form untuk role Admin Pelayanan */}
      {user && user.role === "adminpelayanan" && userData && (
        <div className="card mb-5" style={{ border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div className="card-content">
            <div className="content">
              <form>
                <div className="columns is-variable is-8">
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                  <div className="field">
                      <label className="label is-small">NIP</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nip || ''}
                          name="nip"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">Nama</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small readonly-input"
                          value={userData.nama || ''}
                          name="nama"
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column is-12-mobile is-6-tablet is-6-desktop">
                  <div className="field">
                      <label className="label is-small">Alamat</label>
                      <div className="control">
                        <input
                          type="text"
                          className="input is-small"
                          value={userData.alamat || ''}
                          name="alamat"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label is-small">No Telepon</label>
                      <div className="control">
                        <input
                          type="tel"
                          className="input is-small"
                          value={userData.nomorTelepon || ''}
                          name="nomorTelepon"
                          onChange={handleChange}
                          maxLength={13}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field has-text-centered">
                  <button
                    className={`button is-dark is-small ${loading ? "is-loading" : ""}`}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    <hr className="my-3" />
      {/* Form untuk Mengubah Password */}
      <h2 className="subtitle is-5 has-text-centered mb-4">Ubah Password</h2>
      <div className="columns is-variable is-8">
        <div className="column is-12-mobile is-6-tablet is-6-desktop">
          <div className="field">
            <label className="label is-small">Password Baru</label>
            <div className="control">
              <input
                type={showPasswordNew ? 'text' : 'password'}
                className="input is-small"
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <label className="checkbox is-small mt-2">
              <input
                type="checkbox"
                checked={showPasswordNew}
                onChange={() => setShowPasswordNew(!showPasswordNew)}
              />{' '}
              Tampilkan Password
            </label>
          </div>
        </div>

        <div className="column is-12-mobile is-6-tablet is-6-desktop">
          <div className="field">
            <label className="label is-small">Konfirmasi Password Baru</label>
            <div className="control">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                className="input is-small"
                placeholder="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <label className="checkbox is-small mt-2">
              <input
                type="checkbox"
                checked={showPasswordConfirm}
                onChange={() => setShowPasswordConfirm(!showPasswordConfirm)}
              />{' '}
              Tampilkan Password
            </label>
          </div>
        </div>
      </div>

      <div className="field has-text-centered">
      <button
          className={`button is-dark is-small ${loading ? 'is-loading' : ''}`}
          onClick={handleChangePassword}
          disabled={loading}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default FormProfile;
