import React from "react";
import { Link } from "react-router-dom";

function CompanyCard({ company }) {
    return (
        <div className="company-card">
            <h2>{company.name}</h2>
            <p>{company.description}</p>
            <p>Employees: {company.numEmployees}</p>
            {company.logoUrl && <img src={company.logoUrl} alt={`${company.name} logo`} />}
            <Link to={`/companies/${company.handle}`}>View Details</Link>
        </div>
    );
}

export default CompanyCard;