import React, { useEffect, useState } from "react";
import JoblyApi from "../api/JoblyApi";
import JobCard from "./JobCard";
import FilterOption from "../Common/FilterOptions";
import SortMenu from "../Common/SortMenu";

function JobList({ currentUser }) {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ jobType: "", location: "" });
    const [sortCriteria, setSortCriteria] = useState('date');

    useEffect(() => {
        async function fetchJobs() {
            try {
                setLoading(true);
                setError(null);
                const jobsData = await JoblyApi.getJobs();
                if (!Array.isArray(jobsData)) { // Check fetched data is array
                    setError("No jobs found.");
                    return; // Exit early if data is not valid

                }
                setJobs(jobsData);
                setFilteredJobs(jobsData);
            } catch (err) {
                setError("Error loading jobs. Please try again later."); // User-friendly error message
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    useEffect(() => {
        // Filter jobs based on selected filters
        const applyFilters = () => {
            let filtered = jobs;
            if (filters.jobType) {
                filtered = filtered.filter(job => job.type === filters.jobType);
            }
            if (filters.location) {
                filtered = filtered.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
            }
            setFilteredJobs(filtered);
        };
        applyFilters();
    }, [filters, jobs]); // Reapply filters when filters or jobs change

    useEffect(() => {
        // Sort filtered jobs based on sortCriteria
        const sortedJobs = [...filteredJobs].sort((a, b) => {
            if (sortCriteria === 'date') {
                return new Date(b.datePosted) - new Date(a.datePosted);
            } else if (sortCriteria === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortCriteria === 'company') {
                return a.companyName.localeCompare(b.companyName);
            }
            return 0;
        });
        setFilteredJobs(sortedJobs);
    }, [sortCriteria, filteredJobs]); // Re-sort when sortCriteria or filteredJobs change

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters); // Update the filters
    }

    const handleSort = (criteria) => {
        setSortCriteria(criteria); // Update the sort criteria
        console.log("current sort criteria:", criteria);
    }

    if (loading) return <p>Loading jobs...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="JobList">
            <h1>Job Listings</h1>
            <FilterOption onFilterChange={handleFilterChange} />
            <SortMenu onSort={handleSort} />
            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} currentUser ={currentUser } />)
            ) : (
                <p>No jobs available.</p>
            )}
        </div>
    );
}

export default JobList;