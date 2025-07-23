import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi";
import Settings from "./Settings"; 

function UserProfile({ username }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await JoblyApi.getUser(username);
                setUser (userData)
            } catch (err) {
                setError("Failed to load user profile. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    const handleUpdate = (updatedUser ) => {
        setUser(updatedUser); // Update the user state with new data
    }

    if (loading) {
        return <p>{error}</p>
    }

    return (
        <div className="User Profile">
            <h2>{user.firstName} {user.lastName}'s Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><stron>Admin:</stron> {user.isAdmin ? "Yes" : "No"}</p>
            <h3>Applied Jobs:</h3>
            <ul>
                {user.jobs.map(job => (
                    <li key={job.id}>{job.title} at {job.companyName}</li>
                ))}
            </ul>
            <Settings currentUser ={user} onUpdate={handleUpdate} />
        </div>
    );
}

export default UserProfile;