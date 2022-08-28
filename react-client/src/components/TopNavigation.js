import React from 'react'
import { useNavigate, NavLink as Link } from 'react-router-dom'
import useAuth from './useAuth';

export default function TopNavigation() {
  const navigate = useNavigate();
  const [auth, setAuth, clearAuth, authName] = useAuth();

  return (
    <nav className="top-nav shadow">

      <div className="top-nav-left">
        <h1 className="nav-title">
          <span className="nav-title-bold">Active</span>
          Learn
          <i className="fa-solid fa-graduation-cap"></i>
        </h1>

        { !auth &&
          <div>
            <Link to="/" activeClassName="active">Home</Link>
            <Link to="/login" activeClassName="active">Login</Link>
            <Link to="/register" activeClassName="active">Register</Link> 
          </div>
        }

        { auth &&
          <div>
            <Link to="/" activeClassName="active">Home</Link>
            <Link to="/dashboard" activeClassName="active">Dashboard</Link>
          </div>
        }
      </div>

      { auth &&
        <div className="top-nav-right">
          <p>{authName}</p>
          <div className="top-nav-user-logo">
            <i className="fa-solid fa-user"></i>
          </div>
        
          {/* <button onClick={() => { clearAuth(); navigate('/login', { state: { logout: true } }); }}>Log Out</button> */}
        </div>
      }

    </nav>
  )
}
