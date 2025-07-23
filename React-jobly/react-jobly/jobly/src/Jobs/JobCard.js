import React from "react";
import { Link } from "react-router-dom";
import SaveJobButton from "./SaveJobButton";

function JobCard({ job }) {
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Equity:</strong> {job.equity ? `${(job.equity * 100).toFixed(2)}%` : "None"}</p>
            <p><strong>Company:</strong> {job.companyName}</p>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
            <SaveJobButton jobId={job.id} username={currentUser.username} />
        </div>
    );
}

export default JobCard;