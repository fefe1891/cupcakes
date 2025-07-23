import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi";
import CompanySettings from "./CompanySettings";

function CompanyProfile({ handle }) {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const companyData = await JoblyApi.getCompany(handle);
                setCompany(companyData);
            } catch (err) {
                setError("Failed to load the company profile. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [handle]);

    const handleUpdate = (updatedCompany) => {
        setCompany(updatedCompany); // Update the company state with the new data
    }

    if (loading) {
        return <p>Loading company profile...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="CompanyProfile">
            <h2>{company.name}</h2>
            <p><strong>Description:</strong> {company.description}</p>
            <p><strong>Number of Employees:</strong> {company.numEmployees}</p>
            <p><strong>Logo:</strong> <img scr={company.logoUrl} alt={`${company.name} logo`} /></p>
            <h3>Jobs at {company.name}:</h3>
            <ul>
                {company.jobs.map(job => (
                    <li key={job.id}>{job.title} - ${job.salary} (Equity: {job.equity})</li>
                ))}
            </ul>
            <CompanySettings currentCompany={company} onUpdate={handleUpdate} />
        </div>
    );
}

export default CompanyProfile;