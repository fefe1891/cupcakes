import React from "react";
import { render, screen } from "@testing-library/react";
import CompanyCard from "../../companies/CompanyCard";

describe("CompanyCard", () => {
    const mockCompany = {
        name: "Tech Corp",
        description: "A leading tech company.",
        numEmployees: 500,
        logoUrl: "http://example.com/logo.png",
        handle: "tech-corp"
    };

    it("should render company details correctly", () => {
        render(<CompanyCard company={mockCompany} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(mockCompany.name);
        expect(screen.getByText(mockCompany.description)).toBeInTheDocument();
        expect(screen.getByText(`Employees: ${mockCompany.numEmployees}`)).toBeInTheDocument();
        const logo = screen.getByAltText(`${mockCompany.name} logo`);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute("src", mockCompany.logoUrl);
        const link = screen.getByRole("link", { name: /View Details/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/companies/${mockCompany.handle}`);
    });

    it("should not render logo if logoUrl is not provided", () => {
        const companyWithoutLogo = { ...mockCompany, logoUrl: null };
        render(<CompanyCard company={companyWithoutLogo} />);
        expect(screen.queryByAltText(`${companyWithoutLogo.name} logo`)).not.toBeInTheDocument();
    });

    it("should handle missing company description gracefully", () => {
        const companyNoDescription = { ...mockCompany, description: null };
        render(<CompanyCard company={companyNoDescription} />);

        // Expect a fallback message for description
        expect(screen.getByText(/Description not available/i)).toBeInTheDocument();
    });

    it("should handle missing numEmployees gracefully", () => {
        const companyNoEmployees = { ...mockCompany, numEmployees: null };
        render(<CompanyCard company={companyNoEmployees} />);

        // Expect a fallback message for number of employees
        expect(screen.getByText(/Employees: Not Available/i)).toBeInTheDocument();
    });

    it("should handle missing name or handle gracefully without crashing", () => {
        // Missing name and handle - minimal props
        const incompleteCompany = { description: "No name or handle" };

        // Render component; test does not throw
        render(<CompanyCard company={incompleteCompany} />);

        // Should not crash and should render description
        expect(screen.getByText(/No name or handle/i)).toBeInTheDocument();

        // Heading for name should show a fallback message
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Company Name Not Available");

        // Link may not have valid href if handle missing
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});