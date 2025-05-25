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

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:3001/api/v1/admin-logout', {
      method: 'POST',
      credentials: 'include', // Important to include cookies
    })
      .then((res) => {
        if (!res.ok) throw new Error('Logout failed');
        return res.json();
      })
      .then((data) => {
        alert(data.message || 'Logout successful');
        navigate('/ad-lg'); // Redirect to login page
      })
      .catch((err) => {
        console.error('Logout error:', err);
        alert('Logout failed. Please try again.');
      });
  };

  return (
    <div>
      <nav className='navbar'>
        <img src='/logo.png' alt='logo' className='logo' />
        <ul className="navbar-list">
          <li><a href="/"><DashboardOutlined /> Dashboard</a></li>
          <li><a href="/add-product"><AppstoreAddOutlined /> Add Product</a></li>
          <li className="dropdown">
            <a href="/products-listing" className="dropdown-link"><ProductOutlined /> Products</a>
          </li>
          <li><a href="/users"><UsergroupAddOutlined /> Users</a></li>
          <li><a href="/orders"><ShoppingCartOutlined /> Orders</a></li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <LogoutOutlined /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;