import React from 'react'
import {
  DashboardOutlined,
AppstoreAddOutlined,
ProductOutlined,
UsergroupAddOutlined,
ShoppingCartOutlined,
DollarOutlined,
LogoutOutlined} from '@ant-design/icons';

const SideBar = () => {
  return (
    <div>
        <nav className='navbar'>
          <img src='/logo.png' alt='logo' className='logo' />
          {/* Create nav bar links */}
          <ul className="navbar-list">
            <li><a href="/"><DashboardOutlined /> Dashboard</a></li>
            <li><a href="/add-product"><AppstoreAddOutlined /> Add Product</a></li>
            <li className="dropdown">
              <a href="/products-listing" className="dropdown-link"><ProductOutlined /> Products</a>
              {/* <ul className="dropdown-menu">
                <li><a href="/physicalProducts">Physical Products</a></li>
                <li><a href="/digitalProducts">Digital Products</a></li>
                <li><a href="/affiliateProducts">Affiliate Products</a></li>
              </ul> */}
            </li>
            <li><a href="/users"><UsergroupAddOutlined /> Users</a></li>
            <li><a href="/orders"><ShoppingCartOutlined /> Orders</a></li>
            <li><a href="/sales"><DollarOutlined /> Sales</a></li>
            <li><a href="/ad-login"><LogoutOutlined /> Logout</a></li>
          </ul>
        </nav>
    </div>
  )
}

export default SideBar
