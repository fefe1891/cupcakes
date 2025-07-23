import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import JobList from "../../jobs/JobList";
import JoblyApi from "../../api/JoblyApi";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/JoblyApi"); // Mock the JoblyApi module

describe("JobList", () => {
    it("should display loading message initially", () => {
        render(
            <MemoryRouter>
                <JobList />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading jobs.../i)).toBeInTheDocument();
    });

    it("should display job listings on successful fetch", async () => {
        const mockJobsData = [
            { id: 1, title: "Software Engineer", salary: 100000, equity: 0.1, companyName: "Tech Corp", description: "A great job opportunity", datePosted: "2024-01-01" },
            { id: 2, title: "Product Manager", salary: 120000, equity: 0.2, companyName: "Innovate Inc.", description: "Lead product development", datePosted: "2025-01-02" },
        ];

        JoblyApi.getJobs.mockResolvedValue(mockJobsData); // Mock the API response

        render(
            <MemoryRouter>
                <JobList />
            </MemoryRouter>
        );

        // Wait for the job listings to be displayed
        expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Job Listings");

        // Check for each job's details
        expect(await screen.findByText(mockJobsData[0].title)).toBeInTheDocument();
        expect(await screen.findByText(`$${mockJobsData[0].salary}`)).toBeInTheDocument();
        expect(await screen.findByText(`Equity: ${mockJobsData[0].equity}`)).toBeInTheDocument();
        expect(await screen.findByText(mockJobsData[0].companyName)).toBeInTheDocument();
        expect(await screen.findByText(mockJobsData[0].description)).toBeInTheDocument();

        expect(await screen.findByText(mockJobsData[1].title)).toBeInTheDocument();
        expect(await screen.findByText(`$${mockJobsData[1].salary}`)).toBeInTheDocument();
        expect(await screen.findByText(`Equity: ${mockJobsData[1].equity}`)).toBeInTheDocument();
        expect(await screen.findByText(mockJobsData[1].companyName)).toBeInTheDocument();
        expect(await screen.findByText(mockJobsData[1].description)).toBeInTheDocument();
    });

    it("should display an error message on failed fetch", async () => {
        JoblyApi.getJobs.mockRejectedValue(new Error("Error loading jobs."));

        render(
            <MemoryRouter>
                <JobList />
            </MemoryRouter>
        );

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error loading jobs. Please try again later./i)).toBeInTheDocument();
        });
    });

    it("should display a message if no jobs are available", async () => {
        JoblyApi.getJobs.mockResolvedValue([]); // Mock a response with no job data

        render(
            <MemoryRouter>
                <JobList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No jobs available/i)).toBeInTheDocument();
        });
    });

    it("should handle unexpected job data structure gracefully", async () => {
        const unexpectedJobsData = [{ title: "Software Engineer" }]; // Missing required fields
        JoblyApi.getJobs.mockResolvedValue(unexpectedJobsData); // Mock a response with unexpected data structure

        render(
            <MemoryRouter>
                <JobList />
            </MemoryRouter>
        );

        // Wait for the no jobs available message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No jobs available/i)).toBeInTheDocument();
        });
    });
});