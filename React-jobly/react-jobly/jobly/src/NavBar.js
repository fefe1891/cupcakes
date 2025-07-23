import React from "react";
import { Link, useNavigate } from "react-router-dom";

const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "0.5rem 1rem",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const logoStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.5rem",
};

const linksContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
};

const welcomeStyle = {
    marginRight: "1rem",
    fontWeight: "600",
};

const logoutButtonStyle = {
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: "4px",
    color: "white",
    padding: "0.25rem 0.75rem",
    fontWeight: "600",
    cursor: "pointer",
};

function NavBar({ isAuthenticated, currentUser, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/"); // Redirect to home after logout
    };

    return (
        <nav style={navStyle}>
            <div>
                <Link to="/" style={logoStyle}>Jobly</Link>
            </div>
            <div style={linksContainerStyle}>
                {isAuthenticated ? (
                    <>
                        <span style={welcomeStyle}>Welcome, {currentUser?.username || "User"}!</span>
                        <Link to="/companies" style={linkStyle}>Companies</Link>
                        <Link to="/jobs" style={linkStyle}>Jobs</Link>
                        <Link to="/profile" style={linkStyle}>Profile</Link>
                        <button onClick={handleLogout} style={logoutButtonStyle} aria-label="Logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/signup" style={linkStyle}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;