import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authStore from "../features/authStore";
import { FaUserMd,FaHospitalAlt } from "react-icons/fa";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; // Import UUID

const DokterFormRegistrasi = () => {
  const { user } = authStore();
  const [error, setError] = useState(null);
  const [role, setRole] = useState("dokter");
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [spesialis, setSpesialis] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [idPelayananKesehatan, setIdPelayananKesehatan] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const addRegistrasi = async (e) => {
    e.preventDefault();

    if (nomorTelepon.length < 12 || nomorTelepon.length === 0) {
      toast.error("Nomor telepon harus diisi dan memiliki panjang minimal 12 karakter.", {
        position: "top-right",
        autoClose: 5000,
      });
      return; 
    }

    setLoading(true);
    try {
      await axios.post("http://34.142.169.61:5000/api/users", {
        role,
        nip,
        nama,
        jenisKelamin,
        spesialis,
        alamat,
        nomorTelepon,
        idPelayananKesehatan,
        email,
        password,
      });

      // Notifikasi sukses dengan email dan password
      toast.success(
        <div>
          <p>Registrasi dan Pemberian CA berhasil!</p>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );

      toast.info(
        <div>
          <p>Email: {email}</p>
          <p>Password: {password}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );
      

      //setMsg("Registrasi berhasil!");

       // Reset semua state form
      setRole("dokter");
      setNip("");
      setNama("");
      setJenisKelamin("");
      setSpesialis("");
      setAlamat("");
      setNomorTelepon("");
      setIdPelayananKesehatan(null);
      setEmail("");
      setPassword("");

    } catch (error) {
      const errorMessage =
        error.response && error.response.data.msg
          ? error.response.data.msg
          : "Terjadi kesalahan saat Registrasi!.";

      // Notifikasi error
      toast.error(`Registrasi gagal: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });

      //setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchIdPelayanan = async () => {
      try {
        const response = await axios.get(
          `http://34.142.169.61:5000/api/users/${user.idRole}/${user.role}`
        );
        setIdPelayananKesehatan(response.data.data.id);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchIdPelayanan();
  }, [user]);

  useEffect(() => {
    if (nip && nama) {
      const namaDepan = nama.split(' ')[0].toLowerCase();
      const uuidCode = uuidv4().replace(/-/g, '').substring(0, 5); 
      
      setEmail(`dokter.${namaDepan}.${uuidCode}@rekammedis.co.id`);
      setPassword(nip);
    }
  }, [nip, nama]);

  return (
    <section className="hero has-background-white is-fullheight">
      <ToastContainer /> {/* Komponen ToastContainer */}
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-12">
              <form onSubmit={addRegistrasi} className="box">
                <h1 className="title is-4 has-text-centered">Registrasi Dokter</h1>
                {/* <p className="has-text-centered">{msg}</p> */}
                {/* <input 
                            type="email" 
                            name="email"
                            className="input is-medium readonly-input"
                            placeholder="Email"
                            value={email} 
                            readOnly /> */}
                {/* NIP Dokter */}
                <div className="field">
                  <label className="label">NIP Dokter</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Masukkan NIP Dokter"
                      name="nipDokter"
                      value={nip}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 18) {
                          setNip(value);
                        }
                      }}
                      maxLength={18}
                      required
                    />
                    <span className="icon is-left">
                      <FaUserMd />
                    </span>
                  </div>
                </div>

                {/* Nama Dokter */}
                <div className="field">
                  <label className="label">Nama Dokter</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Masukkan Nama Dokter"
                      name="namaDokter"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                    <span className="icon is-left">
                      <FaUserMd />
                    </span>
                  </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="field">
                  <label className="label">Jenis Kelamin</label>
                  <div className="control">
                    <div className="select">
                      <select
                        name="jenisKelamin"
                        required
                        value={jenisKelamin}
                        onChange={(e) => setJenisKelamin(e.target.value)}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="LAKILAKI">Laki-laki</option>
                        <option value="PEREMPUAN">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Spesialis */}
                <div className="field">
                  <label className="label">Spesialis</label>
                  <div className="control has-icons-left">
                    <div className="select is-fullwidth">
                      <select
                        name="spesialis"
                        required
                        value={spesialis}
                        onChange={(e) => setSpesialis(e.target.value)}
                      >
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
                        {/* Tambahkan opsi lainnya */}
                      </select>
                    </div>
                    <span className="icon is-left">
                      <FaHospitalAlt />
                    </span>
                  </div>
                </div>

                {/* Alamat Dokter */}
                <div className="field">
                  <label className="label">Alamat</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Masukkan Alamat Dokter"
                      name="alamat"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                    />
                    <span className="icon is-left">
                      <FaUserMd />
                    </span>
                  </div>
                </div>

                {/* Telepon Dokter */}
                <div className="field">
                  <label className="label">No Telepon</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Masukkan Nomor Telepon"
                      name="nomorTelepon"
                      value={nomorTelepon}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 13) {
                              setNomorTelepon(value);
                            }
                          }}
                      maxLength={13} 
                      required
                    />
                    <span className="icon is-left">
                      <FaUserMd />
                    </span>
                  </div>
                </div>

                {/* Tombol Submit */}
                <div className="field">
                  <div className="control">
                    <button
                      type="submit"
                      className="button is-dark is-fullwidth is-small"
                      disabled={loading}
                    >
                      {loading ? "Loading.." : "Registrasi"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DokterFormRegistrasi;
