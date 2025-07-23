import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import CompanyDetails from "../../companies/CompanyDetails";
import JoblyApi from "../../api/JoblyApi";

jest.mock("../../api/JoblyApi"); // Mock the JoblyApi module

describe("CompanyDetails", () => {
    const companyHandle = "tech-corp"; // Example company handle

    it("should display loading message initially", () => {
        render(
            <MemoryRouter initialEntries={[`/companies/${companyHandle}`]}>
                <Route path="/companies/:companyHandle">
                    <CompanyDetails />
                </Route>
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading company details.../i)).toBeInTheDocument();
    });

    it("should display company details on successful fetch", async () => {
        const mockCompanyData = {
            name: "Tech Corp",
            logoUrl: "http://example.com/logo.png",
            description: "A leading tech company.",
            numEmployees: 500,
            jobs: []
        };

        JoblyApi.getCompany.mockResolvedValue(mockCompanyData); // Mock the API response

        render(
            <MemoryRouter initialEntries={[`/companies/${companyHandle}`]}>
                <Route path="/companies/:companyHandle">
                    <CompanyDetails />
                </Route>
            </MemoryRouter>
        );

        // Wait for the company details to be displayed
        expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(mockCompanyData.name);
        expect(screen.getByText(mockCompanyData.description)).toBeInTheDocument();
        expect(screen.getByText(/Number of Employees:/i)).toHaveTextContent(mockCompanyData.numEmployees.toString());
    });

    it("should display an error message on failed fetch", async () => {
        JoblyApi.getCompany.mockRejectedValue(new Error("Error loading company details.")); // Mock an error response

        render(
            <MemoryRouter initialEntries={[`/companies/${companyHandle}`]}>
                <Route path="/companies/:companyHandle">
                    <CompanyDetails />
                </Route>
            </MemoryRouter>
        );

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error loading company details./i)).toBeInTheDocument();
        });
    });

    it("should display a message if no company is found", async () => {
        JoblyApi.getCompany.mockResolvedValue(null); // Mock a response with no company data

        render(
            <MemoryRouter initialEntries={[`/companies/${companyHandle}`]}>
                <Route path="/companies/:companyHandle">
                    <CompanyDetails />
                </Route>
            </MemoryRouter>
        );

        // Wait for the no company found message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No company found./i)).toBeInTheDocument();
        });
    });
});