import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleBurgerMenu = () => {
        setIsActive(!isActive);
    };

    return (
      <div>
        {/* Navbar */}
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
              {/* <div className="navbar-item">
                <NavLink to="/registrasipelayanan" className="custom-button">
                  Registrasi Pelayanan Kesehatan
                </NavLink>
              </div> */}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero is-primary is-medium">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Selamat Datang di RMChain</h1>
              <h2 className="subtitle">
                Sistem manajemen rekam medis yang aman dan terdistribusi menggunakan teknologi blockchain.
              </h2>
              <NavLink to="/registrasipelayanan" className="button is-light is-large is-half">
                Daftar
              </NavLink>
            </div>
          </div>
        </section>
  
        {/* Features Section */}
        <section className="section">
          <div className="container">
            <h2 className="title is-2">Fitur Utama</h2>
            <div className="columns is-multiline">
              <div className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <h3 className="title is-4">Keamanan Terjamin</h3>
                    <p>
                      Data medis pasien dilindungi dengan sistem blockchain yang terdesentralisasi dan transparan.
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <h3 className="title is-4">Akses Mudah</h3>
                    <p>
                      Dokter dan pasien dapat mengakses rekam medis dengan kontrol akses yang ketat.
                    </p>
                  </div>
                </div>
              </div>
              <div className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <h3 className="title is-4">Integrasi Sistem</h3>
                    <p>
                      RMChain dapat diintegrasikan dengan sistem informasi lainnya untuk mempermudah manajemen data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* About Section */}
        <section className="section has-background-light">
          <div className="container">
            <h2 className="title is-2">Tentang RMChain</h2>
            <p>
              RMChain adalah sistem manajemen rekam medis yang menggunakan teknologi blockchain untuk memastikan keamanan dan 
              privasi data pasien. Dengan sistem ini, pengguna memiliki kontrol penuh atas data medis mereka, dan data medis 
              disimpan secara aman dalam jaringan terdistribusi yang transparan dan dapat diakses hanya oleh pihak yang berwenang.
            </p>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="footer has-background-dark">
          <div className="content has-text-centered">
            <p>
              <strong>RMChain</strong> by <NavLink to="/">RMChain</NavLink>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  };

export default LandingPage;
