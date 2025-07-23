import React from "react";
import { Link } from "react-router-dom";
// import './HomePage.css'; // Optional: You can create a CSS file for styling

function HomePage() {
    return (
        <div className="HomePage">
            <h1>Jobly</h1>
            <h2>Welcome to Jobly!</h2>
            <p>Your go-to platform for finding the perfect job or hiring the right talent.</p>
            <div className="HomePage-buttons">
                <Link to="/login">
                <button>Log In</button>
                </Link>
                <Link to="/signup">
                <button>Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;