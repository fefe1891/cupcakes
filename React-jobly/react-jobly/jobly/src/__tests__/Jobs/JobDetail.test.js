import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import JobDetail from "../../jobs/JobDetail";
import JoblyApi from "../../api/JoblyApi";

jest.mock("../../api/JoblyApi"); // Mock the JoblyApi module

describe("JobDetail", () => {
    const jobId = "1"; // Example job ID

    it("should display loading message initially", () => {
        render(
            <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading job details.../i)).toBeInTheDocument();
    });

    it("should display job details on successful fetch", async () => {
        const mockJobData = {
            title: "Software Engineer",
            salary: 100000,
            equity: 0.1,
            company: { name: "Tech Corp" },
            description: "A great job opportunity",
        };

        JoblyApi.getJob.mockResolvedValue(mockJobData); // Mock the API response

        render(
            <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </MemoryRouter>
        );

        // Use findBy queries to wait for elements to appear
        expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(mockJobData.title);
        expect(await screen.findByText(/Salary:/i)).toHaveTextContent(`$${mockJobData.salary}`);
        expect(await screen.findByText(/Equity:/i)).toHaveTextContent(mockJobData.equity.toString());
        expect(await screen.findByText(/Company:/i)).toHaveTextContent(mockJobData.company.name);
        expect(await screen.findByText(/Description:/i)).toHaveTextContent(mockJobData.description);
    });

    it("should display an error message on failed fetch", async () => {
        JoblyApi.getJob.mockRejectedValue(new Error("Error loading job details")); // Mock an error response

        render(
            <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </MemoryRouter>
        );

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error loading job details/i)).toBeInTheDocument();
        });
    });

    it("should display a message if no job is found", async () => {
        JoblyApi.getJob.mockResolvedValue(null); // Mock a response with no job data

        render(
            <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </MemoryRouter>
        );

        // Wait for the no job found message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No job found./i)).toBeInTheDocument();
        });
    });

    it("should handle unexpected job data structure gracefully", async () => {
        const unexpectedJobData = { title: "Software Engineer" }; // Missing required fields
        JoblyApi.getJob.mockResolvedValue(unexpectedJobData); // Mock a response with unexpected data structure

        render(
            <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </MemoryRouter>
        );

        // Wait for the no job found message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No job found./i)).toBeInTheDocument();
        });
    });
});