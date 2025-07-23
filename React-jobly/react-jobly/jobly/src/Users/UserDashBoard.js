import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi"; // Import the API class to fetch user data
import SavedJobList from "../SavedJobs/SavedJobList"

function UserDashboard({ currentUser }) {
    const [userJobs, setUserJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserJobs = async () => {
            try {
                const jobs = await JoblyApi.getJobs({ appliedBy: currentUser.username });
                setUserJobs(jobs);
            } catch (err) {
                setError("Failed to load jobs. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserJobs();
    }, [currentUser.username]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>{error}</div>; // Show error message
    }

    return (
        <div className="UserDashboard">
            <h2>Welcome, {currentUser.firstName}!</h2>
            <h3>Your Profile</h3>
            <p>Username: {currentUser.username}</p>
            <p>Email: {currentUser.email}</p>
            <h3>Saved Jobs</h3>
            <SavedJobList userJobs={userJobs} />
        </div>
    );
}

export default UserDashboard;