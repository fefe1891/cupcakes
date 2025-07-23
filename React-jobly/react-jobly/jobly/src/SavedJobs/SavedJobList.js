import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi";

function SavedJobList({ userJobs }) {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const jobs = await JoblyApi.getJobs({ savedBy: userJobs.username });
                setSavedJobs(jobs);
            } catch (err) {
                setError("Failed to load saved jobs. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [userJobs.username]);

    if (loading) {
        return <p>Loading saved jobs...</p>; // Show loading state
    }

    if (error) {
        return <p>{error}</p>; // Show error message
    }

    return (
        <div className="SavedJobList">
            <h3>You Saved Jobs</h3>
            {savedJobs.length > 0 ? (
                <ul>
                    {savedJobs.map(job => (
                        <li key={job.id}>
                            {job.title} at {job.companyName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved jobs found.</p>
            )}
        </div>
    );
}

export default SavedJobList;