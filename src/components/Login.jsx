import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify
import authStore from "../features/authStore";
import { IoPerson, IoKey } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

const Login = () => {
  const { loginUser, user, isLoading, isError, message } = authStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan atau menyembunyikan password
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // Efek untuk menampilkan notifikasi berdasarkan status login
  useEffect(() => {
    if (user) {
      toast.success("Login berhasil!"); // Notifikasi login sukses
      navigate("/dashboard");
    } else if (isError) {
      // Tampilkan notifikasi error berdasarkan message dari store
      if (message.includes("Certificate Authority")) {
        toast.error("Akun Anda belum memiliki Certificate Authority (CA). Cobalah beberapa saat lagi.");
      } else {
        toast.error(message);
      }
    }
  }, [user, isError, message, navigate]);

  // Fungsi untuk mengirim data login
  const Auth = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
  };

  return (
<div>
    <nav className="navbar is-fixed-top is-transparent" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-item">
          <h1 className="title is-4">RMChain</h1>
        </NavLink>
      </div>
    </nav>

    <section className="hero has-background-white is-success is-fullheight is-fullwidth">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Komponen Toast */}
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <form onSubmit={Auth} className="box has-background-dark">
                <h1 className="title is-2 has-text-centered has-text-white">Sign In</h1>
                
                {/* Email Field */}
                <div className="field">
                  <label className="label has-text-white">Email</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="icon is-left">
                      <IoPerson />
                    </span>
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="field">
                  <label className="label has-text-white">Password</label>
                  <div className="control has-icons-left">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle visibility
                      className="input"
                      placeholder="***********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="icon is-left">
                      <IoKey />
                    </span>
                  </div>
                  {/* Checkbox untuk Show Password */}
                  <div className="field mt-2">
                    <label className="checkbox has-text-white">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)} // Toggle checkbox
                      />
                      Show Password
                    </label>
                  </div>
                </div>
                
                {/* Login Button */}
                <div className="field mt-5">
                  <button type="submit" className="button is-info is-fullwidth" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
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

export default Login;
