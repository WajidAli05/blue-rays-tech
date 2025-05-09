import './App.css'
import {Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import UsersPage from './pages/UsersPage'
import AddProductPage from './pages/AddProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/ad-login" element={<LoginPage />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/add-product' element={<AddProductPage />} />  
        <Route path='/:sku' element={<ProductDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
