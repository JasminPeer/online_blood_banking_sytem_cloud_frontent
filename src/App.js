// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your pages
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import Capsule from "./components/Capsule";
import BloodStorage from "./components/BloodStorage";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-4">
        <Link className="navbar-brand fw-bold" to="/">
          Blood Bank App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/capsule">Capsule</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blood">Blood Storage</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Page Routes */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/capsule" element={<Capsule />} />
          <Route path="/blood" element={<BloodStorage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
