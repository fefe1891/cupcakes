import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import NavBar from "./NavBar"; // NavBar component
//import ErrorBoundary from "./errorBoundary"; // ErrorBoundary component

// Pages
import HomePage from "./HomePage";
import ErrorBoundary from "./ErrorBoundary";
import LoginForm from "./Forms/LoginForm";
import SignupForm from "./Forms/SignupForm";
import UserDashboard from "./Users/UserDashBoard";
import UserProfile from "./Users/UserProfile";
import Settings from "./Common/Settings";

// Jobs components
import JobsList from "./Jobs/JobList";
import JobDetails from "./Jobs/JobDetail";

// Saved Jobs
import SavedJobList from "./SavedJobs/SavedJobList";

// Company components
import CompanyList from "./Company/CompanyList";
import CompanyProfile from "./Company/CompanyProfile";
import CompanyDashboard from "./Company/CompanyDashboard";
import CompanyDetails from "./Company/CompanyDetails";
import JoblyApi from "./api/JoblyApi";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const fetchUser = useCallback(async () => {
    console.log("Current User before fetching:", currentUser );
    if (!token) {
      console.warn("No current user found. Skipping fetchUser.");
      return; // Exit if token is not available
    }
    if (!currentUser) {
      console.warn("No current user found. Skipping fetchUser.");
      return; // Exit if currentUser is null
    }
    try {
      const user = await JoblyApi.getUser(currentUser.username);
      console.log("Fetched User:", user);
      setIsAuthenticated(true);
      if(user.companyHandle) {
        const company = await JoblyApi.getCompany(user.companyHandle);
        setCurrentCompany(company);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }, [token, currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchUser();
    }
  }, [token, fetchUser, currentUser]);

  useEffect(() => {
    // Check for a stored token in localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      JoblyApi.token = storedToken; // Set the token in JoblyApi
      // Fetch user info if token exists and currentUser  is not null
      if (currentUser) {
        fetchUser(); // Call fetchUser  only if currentUser  is not null
      }
    }
  }, [currentUser, fetchUser]);
  

  const handleLogin = async (username, password) => {
    try {
      const token = await JoblyApi.loginUser({ username, password });
      setToken(token);
      console.log("Login token:", token);
      localStorage.setItem("token", token);
      const user = await JoblyApi.getUser(username);
      console.log("Fetched user:", user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      if (user.companyHandle) {
        const company = await JoblyApi.getCompany(user.companyHandle);
        setCurrentCompany(company);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignup = async (userData) => {
    try {
      const token = await JoblyApi.registerUser(userData);
      const user = await JoblyApi.getUser(userData.username);
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      if (user.companyHandle) {
        const company = await JoblyApi.getCompany(user.companyHandle);
        setCurrentCompany(company);
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentCompany(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    JoblyApi.logout();
  };

  return (
    <Router>
      <ErrorBoundary>
        <NavBar isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard/user" element={<UserDashboard currentUser={currentUser} />} />
              <Route path="/profile/:username" element={<UserProfile username={currentUser.username} />} />
              <Route path="/profile/company/:handle" element={<CompanyProfile handle={currentCompany?.handle} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/companies/:companyHandle" element={<CompanyDetails />} />
              <Route path="/dashboard/company" element={<CompanyDashboard currentCompany={currentCompany} />} />
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/savedjobs" element={<SavedJobList />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Navigate to="/login" />} />
              <Route path="/profile/:username" element={<Navigate to="/login" />} />
              <Route path="/settings" element={<Navigate to="/login" />} />
              <Route path="/companies" element={<Navigate to="/login" />} />
              <Route path="/companies/:companyHandle" element={<Navigate to="/login" />} />
              <Route path="/jobs" element={<Navigate to="/login" />} />
              <Route path="/jobs/:jobId" element={<Navigate to="/login" />} />
              <Route path="/savedjobs" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App;
