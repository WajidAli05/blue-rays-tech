import React from 'react';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  ProductOutlined,
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:3001/api/v1/admin-logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Logout failed');
        return res.json();
      })
      .then((data) => {
        alert(data.message || 'Logout successful');
        navigate('/ad-lg');
      })
      .catch((err) => {
        console.error('Logout error:', err);
        alert('Logout failed. Please try again.');
      });
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
              overlayInnerStyle={tooltipStyle}
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
              overlayInnerStyle={tooltipStyle}
            >
              <a href="/add-product" className="nav-link">
                <AppstoreAddOutlined /> Add Product
              </a>
            </Tooltip>
          </li>
          <li className="dropdown">
            <Tooltip
              color="white"
              title="Products"
              placement="top"
              overlayInnerStyle={tooltipStyle}
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
              overlayInnerStyle={tooltipStyle}
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
              overlayInnerStyle={tooltipStyle}
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
              overlayInnerStyle={tooltipStyle}
            >
              <button onClick={handleLogout} className="logout-btn">
                <LogoutOutlined /> Logout
              </button>
            </Tooltip>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;