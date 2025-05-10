import './App.css'
import {Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersPage from './pages/UsersPage'
import AddProductPage from './pages/AddProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import OrdersPage from './pages/OrdersPage';
import SalesPage from './pages/SalesPage';
import ProductsListingPage from './pages/ProductsListingPage';

function App() {
  return (
    <>  
      <Routes>
        <Route path='/ad-lg' element={<LoginPage />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/add-product' element={<AddProductPage />} />  
        <Route path='/sales' element={<SalesPage />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/products-listing' element={<ProductsListingPage />} />
        <Route path='/:sku' element={<ProductDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
