import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompanyProfile from "./CompanyProfile"; // Adjust the import path as necessary
import JoblyApi from "../api/JoblyApi"; // Adjust the import path as necessary

// Mock the JoblyApi module
jest.mock("../api/JoblyApi");

describe("CompanyProfile", () => {
    const handle= "testcompany";

    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock calls
    });

    it("should display loading message initially", () => {
        render(<CompanyProfile handle={handle} />);
        expect(screen.getByText(/loading company profile/i)).toBeInTheDocument();
    });

    it("should display company information on successful fetch", async () => {
        // Mock the API response
        JoblyApi.getCompany.mockResolvedValueOnce({
            name: "Test Company",
            description: "A company that codes.",
            numEmployees: 100,
            logoUrl: "http://example.com/logo.png",
            jobs: [
                { id: 1, title: "Software Engineering", salary: 100000, equity: 0.1 },
                { id: 2, title: "Product Manager", salary: 120000, equity: 0.2 },
            ],
        });

        render(<CompanyProfile handle={handle} />);

        // Use findBy queries to await for elements to appear
        expect(await screen.findByText(/Test Company/i)).toBeInTheDocument();
        expect(await screen.findByText(/Description:/i)).toBeInTheDocument();
        expect(await screen.findByText(/A company that codes./i)).toBeInTheDocument();
        expect(await screen.findByText(/Number of Employees:/i)).toBeInTheDocument();
        expect(await screen.findByText(/100/i)).toBeInTheDocument();
        expect(await screen.findByAltText(/Test Company logo/i)).toBeInTheDocument();
        expect(await screen.findByText(/Jobs at Test Company/i)).toBeInTheDocument();
        expect(await screen.findByText(/Software Engineer - \$100000 \(Equity: 0.1\)/i)).toBeInTheDocument();
        expect(await screen.findByText(/Product Manager - \$120000 \(Equity: 0.2\)/i)).toBeInTheDocument();
    });

    it("should display error message on fethch failure", async () => {
        // Mock the API to throw an error
        JoblyApi.getCompany.mockRejectedValueOnce(new Error("Failed to load the company profile."));

        render(<CompanyProfile handle={handle} />);

        // Wait for the error message to be displayed
        expect(await screen.findByText(/failed to load the company profile/i)).toBeInTheDocument();
    });

    it("should display a message if no company is found", async () => {
        JoblyApi.getCompany.mockResolvedValue(null); // Mock a response with no company data

        render(<CompanyProfile handle={handle} />);

        // Wait for the no company found message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No company found./i)).toBeInTheDocument();
        });
    });
});