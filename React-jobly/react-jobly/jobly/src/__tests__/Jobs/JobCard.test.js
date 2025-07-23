import React from "react";
import { render, screen } from "@testing-library/react";
import JobCard from "../../jobs/JobCard";

describe("JobCard", () => {
    const job = {
        id: 1,
        title: "Software Engineer",
        salary: 100000,
        equity: 0.1,
        companyName: "Tech Corp"
    };

    it("should render job details correctly", () => {
        render(<JobCard job={job} />);

        // Check if the job title is rendered
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(job.title);

        // Check if the salary is rendered
        expect(screen.getByText(/Salary:/i)).toHaveTextContent(`$${job.salary}`);

        // Check if the equity is rendered
        expect(screen.getByText(/Equity:/i)).toHaveTextContent(job.equity.toString());

        // Check if company name is rendered
        expect(screen.getByText(/Company:/i)).toHaveTextContent(job.companyName);

        // Check if the "View Details" link is rendered
        const link = screen.getByRole("link", { name: /View Details/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/jobs/${job.id}`);
    });

    it("should render 'None' if equity is not provided", () => {
        const jobWithoutEquity = { ...job, equity: null };
        render(<JobCard job={jobWithoutEquity} />);

        // Check if 'None' is rendered for equity
        expect(screen.getByText(/Equity:/i)).toHaveTextContent("None");
    });

    it("should handle missing job title gracefully", () => {
        const jobWithoutTitle = { ...job, title: undefined };
        render(<JobCard job={jobWithoutTitle} />);

        // Check if a fallback message is rendered for the title
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Job Title Not Available");
    });

    it("should handle missing salary gracefully", () => {
        const jobWithoutSalary = { ...job, salary: undefined };
        render(<JobCard job={jobWithoutSalary} />);

        // Check if a fallback message is rendered for the salary
        expect(screen.getByText(/Salary:/i)).toHaveTextContent("Salary Not Available");
    });

    it("should handle missing company name gracefully", () => {
        const jobWithoutCompanyName = { ...job, companyName: undefined };
        render(<JobCard job={jobWithoutCompanyName} />);

        // Check if a fallback message is rendered for the company name
        expect(screen.getByText(/Company:/i)).toHaveTextContent("Company Not Available");
    });
});