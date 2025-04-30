import './App.css'
import {Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/ad-login" element={<LoginPage />} />
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
