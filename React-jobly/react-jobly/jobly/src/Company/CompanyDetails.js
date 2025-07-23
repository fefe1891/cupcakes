import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JobCard from "../Jobs/JobCard";

import JoblyApi from "../api/JoblyApi";

function CompanyDetails() {
    const { companyHandle } = useParams();
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCompany() {
            try {
                setLoading(true);
                setError(null);

                const companyData = await JoblyApi.getCompany(companyHandle);
                setCompany(companyData);
            } catch (err) {
                setError("Error loading company details.");
            } finally {
                setLoading(false);
            }
        }
        getCompany();
    }, [companyHandle]);

    if (loading) return <p>Loading company details...</p>;
    if (error) return <p>{error}</p>;
    if (!company) return <p>No company found.</p>;

    return (
        <div className="CompanyDetails">
            <h1>{company.name}</h1>
            {company.logoUrl && (
                <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    style={{ maxWidth: "200px", height: "auto" }}
                />
            )}
            <p>{company.description}</p>
            <p><strong>Number of Employees:</strong> {company.numEmployees || "N/A"}</p>

            <h2>Jobs at {company.name}</h2>
            {company.jobs && company.jobs.length > 0 ? (
                company.jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))
            ) : (
                <p>No jobs available at this company.</p>
            )}
        </div>
    );
}

export default CompanyDetails;