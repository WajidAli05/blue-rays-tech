import React, { useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import ShapeShiftBounce from '../animations/ShapeShiftBounce'

const LoginPage = () => {
  return (
    <div className="login-page">
        <img src="/logo.png" alt="Logo" className="logo" />
      <LoginForm />
        <div className="animation-container">
          {/* TODO: */}
            {/* <ShapeShiftBounce /> */}
        </div>
    </div>
  )
}

export default LoginPage
