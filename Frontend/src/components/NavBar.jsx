import React, { useState } from 'react';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  ProductOutlined,
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Modal, Spin } from 'antd';

const NavBar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const performLogout = () => {
    setIsLoggingOut(true);
    
    fetch('http://localhost:3001/api/v1/admin-logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Logout failed');
        return res.json();
      })
      .then(() => {
        // Show spinner for 2 seconds before redirecting
        setTimeout(() => {
          setShowLogoutModal(false);
          setIsLoggingOut(false);
          navigate('/ad-lg');
        }, 2000);
      })
      .catch((err) => {
        console.error('Logout error:', err);
        setShowLogoutModal(false);
        setIsLoggingOut(false);
      });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const tooltipStyle = {
    color: 'black',
  };

  return (
    <div>
      <nav className='navbar'>
        <img src='/logo.png' alt='logo' className='logo' />
        <ul className="navbar-list">
          <li>
            <Tooltip
              color="white"
              title="Dashboard"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/" className="nav-link">
                <DashboardOutlined /> Dashboard
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              color="white"
              title="Add Product"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/add-product" className="nav-link">
                <AppstoreAddOutlined /> Add Product
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              color="white"
              title="Announcements"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/announcements" className="nav-link">
                <SoundOutlined /> Announcements
              </a>
            </Tooltip>
          </li>
          <li className="dropdown">
            <Tooltip
              color="white"
              title="Products"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/products-listing" className="dropdown-link">
                <ProductOutlined /> Products
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              color="white"
              title="Users"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/users" className="nav-link">
                <UsergroupAddOutlined /> Users
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              color="white"
              title="Orders"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <a href="/orders" className="nav-link">
                <ShoppingCartOutlined /> Orders
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              color="white"
              title="Logout"
              placement="top"
              styles={{ body: tooltipStyle }}
            >
              <button onClick={handleLogout} className="logout-btn">
                <LogoutOutlined /> Logout
              </button>
            </Tooltip>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={showLogoutModal}
        onOk={performLogout}
        onCancel={() => setShowLogoutModal(false)}
        okText="Yes"
        cancelText="No"
        centered
        confirmLoading={isLoggingOut}
        okButtonProps={{
          style: {
            backgroundColor: 'red',
            borderColor: 'red',
            color: 'white',
          },
        }}
      >
        {isLoggingOut ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: '16px', color: '#666' }}>Logging out...</p>
          </div>
        ) : (
          'Are you sure you want to log out?'
        )}
      </Modal>
    </div>
  );
};

export default NavBar;