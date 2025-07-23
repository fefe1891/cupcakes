import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi"; // Import the API class to fetch company data
import JobCard from "../Jobs/JobCard"; // Import JobCard to display job listings
import JobForm from "../Forms/JobForm"; // Import JobForm for adding new jobs

function CompanyDashboard({ currentCompany }) {
    const [jobListings, setJobListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showJobForm, setShowJobForm] = useState(false);

    useEffect(() => {
        const fetchJobListings = async () => {
            try {
                const jobs = await JoblyApi.getJobs({ postedBy: currentCompany.handle });
                setJobListings(jobs);
            } catch (err) {
                setError("Failed to load job listings. Please try again later.");
                consoleError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobListings();
    }, [currentCompany.handle]);

    const handleAddJob = async (newJob) => {
        try {
            const job = await JoblyApi.createJob(newJob);
            setJobListings((prevJobs) => [...prevJobs, job]);
            setShowJobForm(false); // Hide the form after adding a job
        } catch (err) {
            setError("Failed to add job. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading job listings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="CompanyDashboard">
            <h2>Welcome, {currentCompany.name}!</h2>
            <button onClick={() => setShowJobForm((prev) => !prev)}>
                {showJobForm ? "Cancel" : "Add New Job"}
            </button>
            {showJobForm && <JobForm onAddJob={handleAddJob} />}
            <h3>Your Job Listings</h3>
            {jobListings.length > 0 ? (
                jobListings.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))
            ) : (
                <p>No jobs available at this company.</p>
            )}
        </div>
    );
}

export default CompanyDashboard;