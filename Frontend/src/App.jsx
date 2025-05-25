import { Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import AddProductPage from './pages/AddProductPage';
import OrdersPage from './pages/OrdersPage';
import ProductsListingPage from './pages/ProductsListingPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UserNotFoundPage from './pages/UserNotFoundPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import PrivateRoutes from '../routes/PrivateRoutes';

function App() {
  return (
    <Routes>
      <Route path="/ad-lg" element={<LoginPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products-listing" element={<ProductsListingPage />} />
        <Route path="/user-not-found" element={<UserNotFoundPage />} />
        <Route path="/:sku" element={<ProductDetailsPage />} />
        <Route path="/user/:userId" element={<UserDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;