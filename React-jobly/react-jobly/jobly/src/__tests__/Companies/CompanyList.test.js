import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompanyList from "../../companies/CompanyList";
import axios from "axios";

jest.mock("axios"); // Mock the axios module

describe("CompanyList", () => {
    it("should display loading message initially", () => {
        render(<CompanyList />);

        expect(screen.getByText(/Loading companies.../i)).toBeInTheDocument();
    });

    it("should display company list on successful fetch", async () => {
        const mockCompaniesData = [
            { handle: "tech-corp", name: "Tech Corp", description: "A leading tech company." },
            { handle: "innovate-inc", name: "Innovate Inc.", description: "Innovating the future." },
        ];

        axios.get.mockResolvedValue({ data: { companies: mockCompaniesData } }); // Mock the API response

        render(<CompanyList />);

        // Wait for the company list to be displayed
        expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Company List");
        expect(await screen.findByText(mockCompaniesData[0].name)).toBeInTheDocument();
        expect(await screen.findByText(mockCompaniesData[1].name)).toBeInTheDocument();
    });

    it("should display an error message on failed fetch", async () => {
        axios.get.mockRejectedValue(new Error("Error loading companies.")); // Mock an error response

        render(<CompanyList />);

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Error loading companies: Error loading companies./i)).toBeInTheDocument();
        });
    });

    it("should display a message if no companies are found", async () => {
        axios.get.mockResolvedValue({ data: { companies: [] } }); // Mock a response with no company data

        render(<CompanyList />);

        // Wait for the no companies found message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/No companies found./i)).toBeInTheDocument();
        });
    });

    it("should handle search term changes and re-fetch companies", async () => {
        const mockCompaniesData = [
            { handle: "tech-corp", name: "Tech Corp", description: "Leading in the tech industry."},
            { handle: "Innovate-inc", name: "Innovate Inc", description: "Driving innovation."},
        ];

        axios.get.mockResolvedValueOnce({ data: { companies: mockCompaniesData } }); // First Fetch
        render(<CompanyList />);

        // Wait for the company list to be displayed
        await waitFor(() => {
            expect(screen.getByText(mockCompaniesData[0].name)).toBeInTheDocument();
        });

        // Change the search term
        axios.get.mockedResolvedValueOnce({ data: { companies: [mockedCompaniesData[0]] } }); // Mock new fetch
        const searchInput = screen.getByPlaceholderText(/Search companies.../i);
        searchInput.value = "Tech Corp"; // Simulate user input
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));

        // Wait for the updated company list to be displayed
        await waitFor(() => {
            expect(screen.getByText(mockCompaniesData[0].name)).toBeInTheDocument();
        });

        // Wait for the second company to not be displayed
        await waitFor(() => {
            expect(screen.queryByText(mockCompaniesData[1].name)).not.toBeInTheDocument();
        });
    });
});