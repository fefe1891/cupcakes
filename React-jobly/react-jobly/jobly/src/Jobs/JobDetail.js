import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api/JoblyApi";
import ApplyForm from "./ApplyForm";

function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJob() {
            try {
                setLoading(true);
                setError(null);
                const jobData = await JoblyApi.getJob(jobId);
                setJob(jobData);
            } catch (err) {
                setError("Error loading job details");
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [jobId]);

    const handleApply = (applicationData) => {
        // Here we would handle the application submission
        // For now, we can log the application data to the console
        console.log("Application submitted:", applicationData);
        // You can also implement the API call to submit the application
    };

    if (loading) return <p>Loading job details...</p>;
    if (error) return <p>{error}</p>;
    if (!job) return <p>No job found.</p>;

    return (
        <div className="JobDetail">
            <h1>{job.title}</h1>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Equity:</strong> {job.equity ? job.equity : "None"}</p>
            <p><strong>Company:</strong> {job.company.name}</p>
            <p><strong>Description:</strong> {job.description}</p>

            {/* Integrating the ApplyForm component here */}
            <ApplyForm jobId={jobId} onApply={handleApply} />
        </div>
    );
}

export default JobDetail;