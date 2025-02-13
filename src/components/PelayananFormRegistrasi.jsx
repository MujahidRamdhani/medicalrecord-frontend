import React, {useState, useEffect} from 'react';
import { NavLink } from "react-router-dom";
import { IoPerson, IoMail, IoCall, IoHome, IoMedical, IoKey } from 'react-icons/io5';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid'; 

const PelayananFormRegistrasi = () => {
  const [role, setRole] = useState("adminpelayanan");
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  //const [kodePelayanan, setKodePelayanan] = useState("");
  const [namaPelayanan, setNamaPelayanan] = useState("");
  const [tipePelayanan, setTipePelayanan] = useState("");
  const [alamatPelayanan, setAlamatPelayanan] = useState("");
  const [nomorTeleponPelayanan, setNomorTeleponPelayanan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const toggleBurgerMenu = () => {        
    setIsActive(!isActive);
  };

  // useEffect(() => {
  //   const handleKodePelayanan = () => {
  //     if (tipePelayanan && nomorTeleponPelayanan) {
  //       const prefix =
  //         tipePelayanan === "RUMAHSAKIT"
  //           ? "RS"
  //           : tipePelayanan === "KLINIK"
  //           ? "KLK"
  //           : tipePelayanan === "PUSKESMAS"
  //           ? "PKM"
  //           : "";
  //       const lastFourDigits = nomorTeleponPelayanan.slice(-4);
  //       setKodePelayanan(`${prefix}-${lastFourDigits}`);
  //     }
  //   };
  //   handleKodePelayanan();
  // }, [tipePelayanan, nomorTeleponPelayanan]);

  // Generate email otomatis
  useEffect(() => {
    const handleEmail = () => {
      if (nip && nama) {
        const namaDepan = nama.split(' ')[0].toLowerCase();
        const uuidCode = uuidv4().replace(/-/g, '').substring(0, 5); 

        setEmail(`adminpelayanan.${namaDepan}.${uuidCode}@rekammedis.co.id`);
      }
    };
    handleEmail();
  }, [nip, nama]);

  const addRegistrasi = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password tidak boleh kosong!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password harus minimal 8 karakter!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://api.rmchain.web.id/api/users", {
        role,
        nip,
        nama,
        jenisKelamin,
        alamat,
        nomorTelepon,
        //kodePelayanan,
        namaPelayanan,
        tipePelayanan,
        alamatPelayanan,
        nomorTeleponPelayanan,
        email,
        password,
      });
      toast.success(
        <div>
          <p>Registrasi berhasil!</p>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );
      toast.info(
        <div>
          <p>Email: {email}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );

       // Reset form inputs
        setRole("adminpelayanan");
        setNip("");
        setNama("");
        setJenisKelamin("");
        setAlamat("");
        setNomorTelepon("");
        //setKodePelayanan("");
        setNamaPelayanan("");
        setTipePelayanan("");
        setAlamatPelayanan("");
        setNomorTeleponPelayanan("");
        setEmail("");
        setPassword("");
        setShowPassword(false);

        // Optionally, reset the message
        setMsg("");
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response?.data?.msg || "Terjadi kesalahan saat Registrasi!"
        );
      } else {
        toast.error("Terjadi kesalahan!");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <nav className="navbar is-fixed-top is-transparent" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink to="/" className="navbar-item">
              <h1 className="title is-4">RMChain</h1>
            </NavLink>
            <button
              className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
              aria-label="menu"
              aria-expanded={isActive ? 'true' : 'false'}
              data-target="navbarBasicExample"
              onClick={toggleBurgerMenu}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
            <div className="navbar-end">
              <div className="navbar-item">
                <NavLink to="/login" className="custom-button">Login</NavLink>
              </div>
            </div>
          </div>
        </nav>

      <section className="hero is-fullheight has-background-light">
        <ToastContainer />
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-8-tablet is-6-desktop">
                {/* Form */}
                <form onSubmit={addRegistrasi} className="box has-background-white shadow-sm">
                  <h1 className="title is-4 has-text-centered has-text-dark">Registrasi Pelayanan Kesehatan</h1>
                  <p className="has-text-centered">{msg}</p>
                  <h2 className="subtitle is-5 has-text-left">Data Admin</h2>

                  <div className="columns is-multiline">
                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Nama Admin</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="nama"
                            className="input is-medium"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Nama Admin"
                            required
                          />
                          <input
                            type="hidden"
                            name="role"
                            value={role}
                            required
                          />

                          <span className="icon is-left">
                            <IoPerson />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Jenis Kelamin</label>
                        <div className="control">
                          <div className="select is-medium">
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
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">NIP</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="nip"
                            className="input is-medium"
                            placeholder="NIP"
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
                            <IoKey />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Nomor Telepon</label>
                        <div className="control has-icons-left">
                        <input
                          type="text"
                          name="nomorTelepon"
                          className="input is-medium"
                          placeholder="Nomor Telepon"
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
                            <IoCall />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Alamat</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="alamat"
                            className="input is-medium"
                            placeholder="Alamat"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            required
                          />
                          <span className="icon is-left">
                            <IoCall />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="subtitle is-5 has-text-left">Data Pelayanan Kesehatan</h2>

                  <div className="columns is-multiline">
                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Nama Pelayanan</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="namaPelayanan"
                            className="input is-medium"
                            placeholder="Nama Pelayanan"
                            value={namaPelayanan}
                            onChange={(e) => setNamaPelayanan(e.target.value)}
                            required
                          />
                          <span className="icon is-left">
                            <IoMedical />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="column is-half">
                      <div className="field">
                        <label className="label">Kode Pelayanan</label>
                        <div className="control">
                          <input type="text" 
                            name="kodePelayanan"
                            className="input is-medium readonly-input"
                            placeholder="Kode Pelayanan"
                            value={kodePelayanan} 
                            readOnly />
                        </div>
                      </div>
                    </div> */}

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Tipe Pelayanan</label>
                        <div className="control">
                          <div className="select is-medium">
                            <select 
                              name="tipePelayanan" 
                              required 
                              value={tipePelayanan} 
                              onChange={(e) => setTipePelayanan(e.target.value)}
                            >
                              <option value="">Pilih Tipe Pelayanan</option>
                              <option value="RUMAHSAKIT">Rumah Sakit</option>
                              <option value="KLINIK">Klinik</option>
                              <option value="PUSKESMAS">Puskesmas</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Nomor Telepon Pelayanan</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="nomorTeleponPelayanan"
                            className="input is-medium"
                            placeholder="Nomor Telepon Pelayanan"
                            value={nomorTeleponPelayanan}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value) && value.length <= 10) {
                                setNomorTeleponPelayanan(value);
                              }
                            }}
                            maxLength={10}
                            required
                          />
                          <span className="icon is-left">
                            <IoCall />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Alamat Pelayanan</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            name="alamatPelayanan"
                            className="input is-medium"
                            placeholder="Alamat Pelayanan"
                            value={alamatPelayanan}
                            onChange={(e) => setAlamatPelayanan(e.target.value)}
                            required
                          />
                          <span className="icon is-left">
                            <IoHome />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="subtitle is-5 has-text-left">Akun Admin</h2>

                  <div className="columns is-multiline">
                    <div className="column is-half">
                      <div className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left">
                          <input 
                            type="email" 
                            name="email"
                            className="input is-medium readonly-input"
                            placeholder="Email"
                            value={email} 
                            readOnly />
                          <span className="icon is-left">
                            <IoMail />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="column is-half">
                    <div className="field">
                      <label className="label">Password</label>
                      <div className="control has-icons-left">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="input is-medium"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span className="icon is-left">
                          <IoKey />
                        </span>
                      </div>
                      <label className="checkbox mt-2">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                        &nbsp;Tampilkan Password
                      </label>
                    </div>
                    </div>
                  </div>

                  <div className="field mt-5">
                  <button type="submit" className="button is-dark is-fullwidth">
                    {loading ? "Loading.." : "Registrasi"}
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PelayananFormRegistrasi;
