import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "./CompanyCard"; // Import the CompanyCard component
import CompanyFilter from "./CompanyFilter";
import SortMenu from "../Common/SortMenu";

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ industry: "", size: "" });
    const [sortCriteria, setSortCriteria] = useState('name');

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true); // Set loading to be true before fetching
            try {
                const response = await axios.get("/JoblyApi/companies", {
                    params: { nameLike: searchTerm }, // Send search term to backend
                });
                setCompanies(response.data.companies);
                setFilteredCompanies(response.data.companies); // Initialize filtered companies
            } catch (err) {
                setError("Error loading companies. Please try again later."); // User-friendly error message
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [searchTerm]); // Re-fetch companies when searchTerm changes

    useEffect(() => {
        // Filter companies based on selected filters
        const applyFilters = () => {
            let filtered = companies;
            // Apply industry filter
            if (filters.industry) {
                filtered = filtered.filter(company =>
                    company.industry.toLowerCase().includes(filters.industry.toLowerCase())
                );
            }
            // Apply size filter
            if (filters.size) {
                filtered = filtered.filter(company => company.size === filters.size);
            }
            setFilteredCompanies(filtered);
        };
        applyFilters();
    }, [filters, companies]); // Reapply filters when filters or companies change

    useEffect(() => {
        // Sort filtered companies based on sortCriteria
        const sortedCompanies = [...filteredCompanies].sort((a, b) => {
            if (sortCriteria === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortCriteria === 'industry') {
                return a.industry.localeCompare(b.industry)
            } else if (sortCriteria === 'size') {
                return a.size - b.size;
            }
            return 0;
        });
        setFilteredCompanies(sortedCompanies);
    }, [sortCriteria, filteredCompanies]); // Re-sort when sortCriteria or filteredCompanies change

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSort = (criteria) => {
        setSortCriteria(criteria); // Update the sort criteria
        console.log("current sort criteria:", criteria);
    };


    if (loading) return <p>Loading companies...</p>;
    if (error) return <p>Error loading companies: {error}</p>;

    return (
        <div>
            <h1>Company List</h1>
            <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CompanyFilter onFilterChange={handleFilterChange} />
            <SortMenu onSort={handleSort} />
            <div>
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                        <CompanyCard key={company.handle} company={company} />
                        
                    ))
                ) : (
                    <p>No companies found.</p>
                )}
            </div>
        </div>
    );
}

export default CompanyList;