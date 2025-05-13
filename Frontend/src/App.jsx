import './App.css'
import {Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersPage from './pages/UsersPage'
import AddProductPage from './pages/AddProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import OrdersPage from './pages/OrdersPage';
import ProductsListingPage from './pages/ProductsListingPage';
import UserDetailsPage from './pages/UserDetailsPage';

function App() {
  return (
    <>  
      <Routes>
        <Route path='/ad-lg' element={<LoginPage />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/add-product' element={<AddProductPage />} />  
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/products-listing' element={<ProductsListingPage />} />
        <Route path='/:sku' element={<ProductDetailsPage />} />
        <Route path='/users/:id' element={<UserDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
