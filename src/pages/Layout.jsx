import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Detect screen size and update sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); 
      } else {
        setSidebarOpen(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <React.Fragment>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="columns mt-6" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main content */}
        <div
          className="column"
          style={{
            backgroundColor: '#ffffff', 
            borderRadius: '10px', 
            padding: '1rem', 
            margin: '0.5rem',
            transition: 'margin-left 0.3s ease', 
            marginLeft: isSidebarOpen ? '260px' : '20px',
          }}
        >
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
