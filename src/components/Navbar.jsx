import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authStore from '../features/authStore';
import { IoMenu, IoPersonCircle } from 'react-icons/io5';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = authStore();
  const navigate = useNavigate();

  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div>
      <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
        <div className="navbar-brand is-flex is-justify-content-space-between" style={{ width: '100%' }}>
          {/* Bagian kiri: Tombol untuk membuka sidebar dan RMChain */}
          <div className="is-flex is-align-items-center">
            <a
              href="#!"
              className="navbar-item"
              onClick={toggleSidebar}
              style={{ cursor: 'pointer' }}
            >
              <IoMenu size={24} />
            </a>
            <NavLink to="/dashboard" className="navbar-item">
              <h1 className="title is-4" style={{ marginLeft: '8px' }}>RMChain</h1>
            </NavLink>
          </div>

          {/* Bagian kanan: Informasi user */}
          {user && (
            <div className="navbar-item has-dropdown is-hoverable" style={{ position: 'relative' }}>
              <div
                className="is-flex is-align-items-center"
                onClick={toggleMenu}
                style={{ cursor: 'pointer', color: 'white', marginRight: '10px' }}
              >
                <IoPersonCircle size={24} style={{ marginRight: '8px', color: 'white' }} />
                <span>{user.nama}</span>
              </div>
              {isMenuActive && (
                <div
                  className="navbar-dropdown is-right"
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    margin: '10px',
                  }}
                >
                  <NavLink
                    to="/profileakun"
                    className="navbar-item"
                    style={{ color: '#4a4a4a' }}
                  >
                    Profile
                  </NavLink>
                  <a
                    href="#!"
                    className="navbar-item"
                    style={{ color: '#4a4a4a' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
