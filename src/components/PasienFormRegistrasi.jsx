import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authStore from "../features/authStore";
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import {
  FaUserAlt,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaBirthdayCake,
  FaBriefcase,
} from "react-icons/fa";
import axios from "axios";

const PasienFormRegistrasi = () => {
  const { user } = authStore();
  const [error, setError] = useState(null);
  const [role, setRole] = useState("pasien");
  const [nik, setNik] = useState("");
  const [noRM, setNoRM] = useState(""); 
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [agama, setAgama] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [kewarganegaraan, setKewarganegaraan] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [idPelayananKesehatan, setIdPelayananKesehatan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
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
    const formattedTanggalLahir = `${tanggalLahir}T00:00:00Z`;
    try {
      await axios.post("http://localhost:9999/api/users", {
        role,
        nik,
        noRM,
        nama,
        jenisKelamin,
        tempatLahir,
        tanggalLahir: formattedTanggalLahir,
        alamat,
        agama,
        golonganDarah,
        pekerjaan,
        kewarganegaraan,
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
      
      setMsg("Registrasi berhasil!");

      // Reset semua input form
      setNik("");
      setNama("");
      setJenisKelamin("");
      setTempatLahir("");
      setTanggalLahir("");
      setAlamat("");
      setAgama("");
      setGolonganDarah("");
      setPekerjaan("");
      setKewarganegaraan("");
      setNomorTelepon("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.msg
          ? error.response.data.msg
          : "Terjadi kesalahan saat Registrasi!.";
    
      // Notifikasi error
      toast.error(`Terjadi kesalahan saat Registrasi!: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
    
      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchIdPelayanan = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/users/${user.idRole}/${user.role}`
        );
        setIdPelayananKesehatan(response.data.data.id);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchIdPelayanan();
  }, [user]);

  // Update noRM dan email saat NIK berubah
  useEffect(() => {
    if (nik && nama) {
      setNoRM(`RM-${nik}`);
      //setEmail(`pasien.${nik}@rekammedis.co.id`);

      const namaDepan = nama.split(' ')[0].toLowerCase();
      const uuidCode = uuidv4().replace(/-/g, '').substring(0, 5); 

      // Set email dengan format yang diinginkan
      setEmail(`pasien.${namaDepan}.${uuidCode}@rekammedis.co.id`);

      setPassword(nik); // Set default password same as nik
    }
  }, [nik, nama]);

  return (
    <section className="hero has-background-white is-fullheight">
      <ToastContainer /> {/* Komponen ToastContainer */}
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8">
              <form onSubmit={addRegistrasi} className="box">
                <h1 className="title is-4 has-text-centered">Registrasi Pasien</h1>

                {/* NIK dan Nama */}
                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                    {/* <input 
                            type="email" 
                            name="email"
                            className="input is-medium readonly-input"
                            placeholder="Email"
                            value={email} 
                            readOnly /> */}
                      <label className="label">NIK</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          className="input"
                          placeholder="Masukkan NIK"
                          value={nik}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 16) {
                              setNik(value);
                            }
                          }}
                          maxLength={16}
                          required
                        />
                        <span className="icon is-left">
                          <FaUserAlt />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Nama</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          className="input"
                          placeholder="Masukkan Nama Pasien"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          required
                        />
                        <span className="icon is-left">
                          <FaUserAlt />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tempat dan Tanggal Lahir */}
                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Tempat Lahir</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          className="input"
                          placeholder="Masukkan Tempat Lahir"
                          value={tempatLahir}
                          onChange={(e) => setTempatLahir(e.target.value)}
                          required
                        />
                        <span className="icon is-left">
                          <FaMapMarkedAlt />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Tanggal Lahir</label>
                      <div className="control has-icons-left">
                        <input
                          type="date"
                          className="input"
                          value={tanggalLahir}
                          onChange={(e) => setTanggalLahir(e.target.value)}
                          required
                        />
                        <span className="icon is-left">
                          <FaBirthdayCake />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agama dan Golongan Darah */}
                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Agama</label>
                      <div className="control">
                        <div className="select">
                          <select
                            value={agama}
                            onChange={(e) => setAgama(e.target.value)}
                            required
                          >
                            <option value="">Pilih Agama</option>
                            <option value="ISLAM">Islam</option>
                            <option value="KRISTEN">Kristen</option>
                            <option value="KATOLIK">Katolik</option>
                            <option value="HINDU">Hindu</option>
                            <option value="BUDHA">Budha</option>
                            <option value="KONGHUCU">Konghucu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Golongan Darah</label>
                      <div className="control">
                        <div className="select">
                          <select
                            value={golonganDarah}
                            onChange={(e) => setGolonganDarah(e.target.value)}
                            required
                          >
                            <option value="">Pilih Golongan Darah</option>
                            <option value="TIDAKADA">Tidak Ada</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pekerjaan dan Jenis Kelamin */}
                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Pekerjaan</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          className="input"
                          placeholder="Masukkan Pekerjaan"
                          value={pekerjaan}
                          onChange={(e) => setPekerjaan(e.target.value)}
                          required
                        />
                        <span className="icon is-left">
                          <FaBriefcase />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Jenis Kelamin</label>
                      <div className="control">
                        <div className="select">
                          <select
                            value={jenisKelamin}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            required
                          >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="LAKILAKI">Laki-laki</option>
                            <option value="PEREMPUAN">Perempuan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nomor Telepon, Kewarganegaraan dan Alamat */}
                <div className="columns">
                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Nomor Telepon</label>
                      <div className="control has-icons-left">
                        <input
                          type="tel"
                          className="input"
                          placeholder="Masukkan Nomor Telepon"
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
                          <FaPhoneAlt />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="column is-half">
                    <div className="field">
                      <label className="label">Kewarganegaraan</label>
                      <div className="control">
                        <div className="select">
                          <select
                            value={kewarganegaraan}
                            onChange={(e) => setKewarganegaraan(e.target.value)}
                            required
                          >
                            <option value="">Pilih Kewarganegaraan</option>
                            <option value="WNI">WNI</option>
                            <option value="WNA">WNA</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                

                <div className="field">
                  <label className="label">Alamat</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Masukkan Alamat"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                    ></textarea>
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

export default PasienFormRegistrasi;
