import { useState } from 'react'
import logo from './assets/logo.png'
import FloatingNotes from './FloatingNotes'
import './LoginPage.css'

function LoginPage() {
  // useState here tracks whether user is on login or signup view
  const [isLogin, setIsLogin] = useState(true)

  // These track what the user types into the input fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit() {
    if (isLogin) {
      console.log('Logging in:', username, password)
    } else {
      console.log('Signing up:', username, email, password)
    }
  }

  return (
    <div className="login-page">

      {/* Logo + animated notes section */}
      <div className="logo-container">
        <FloatingNotes />
        <img src={logo} alt="ViciousBets logo" className="logo" />
      </div>

      {/* App name */}
      <h1 className="app-title">ViciousBets</h1>
      <p className="app-subtitle">Bring the competition to you</p>

      {/* Login / Signup card */}
      <div className="auth-card">

        {/* Toggle between login and signup */}
        <div className="toggle-row">
          <button
            className={isLogin ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            className={isLogin ? 'toggle-btn' : 'toggle-btn active'}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Username field — shown on both login and signup */}
        <input
          className="auth-input"
          type="text"
          placeholder= {isLogin ? "Username" : "Only numbers and letters, min 2 characters"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email field — only shown on signup */}
        {!isLogin && (
          <input
            className="auth-input"
            type="email"
            placeholder="Enter a valid email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {/* Password field */}
        <input
          className="auth-input"
          type="password"
          placeholder= {isLogin ? "Password" : "Enter a strong password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button */}
        <button className="submit-btn" onClick={handleSubmit}>
          {isLogin ? 'Log In' : 'Create Account'}
        </button>

      </div>
    </div>
  )
}

export default LoginPage