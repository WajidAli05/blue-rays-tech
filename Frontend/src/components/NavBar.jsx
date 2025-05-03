import React from 'react'
import { FiLogOut } from "react-icons/fi";

const SideBar = () => {
  return (
    <div>
        <nav className='navbar'>
          <img src='/logo.png' alt='logo' className='logo' />
          {/* Create nav bar links */}
          <ul className="navbar-list">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/add-product">Add Product</a></li>
            <li className="dropdown">
              <a href="#" className="dropdown-link">Products</a>
              <ul className="dropdown-menu">
                <li><a href="/physicalProducts">Physical Products</a></li>
                <li><a href="/digitalProducts">Digital Products</a></li>
                <li><a href="/affiliateProducts">Affiliate Products</a></li>
              </ul>
            </li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/ad-login"><FiLogOut size={22} /></a></li>
          </ul>
        </nav>
    </div>
  )
}

export default SideBar
