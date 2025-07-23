import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserDashboard from "./User Dashboard"; // Adjust the import path as necessary
import JoblyApi from "./api/JoblyApi"; // Adjust the import path as necessary

jest.mock("./api/JoblyApi"); // Mock the JoblyApi module

describe("UserDashboard", () => {
    const currentUser = {
        username: "testuser",
        firstName: "Test",
        email: "test@example.com"
    };

    it( "should display loading message initially", () => {
        render(
            <MemoryRouter>
                <UserDashboard currentUser ={ currentUser } />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading.../i)).toBrInTheDocument();
    });

    it("should display user information on successful fetch", async () => {
        const mockJobs = [
            { id: 1, title: "Software Engineer" },
            { id: 2, title: "Product Manager" }
        ];

        JoblyApi.getJobs.mockResolvedValue(mockJobs); // Mock the API response

        render(
            <MemoryRouter>
                <UserDashboard currentUser={ currentUser } />
            </MemoryRouter>
        );

        // Wait for user information to be displayed
        expect(await screen.findByText(/Welcome, Test!/i)).toBeInTheDocument();
        expect(screen.getByText(/Username: testuser/i)).toBeInTheDocument();
        expect(screen.getByText(/Email: test@example.com/i)).toBeInTheDocument();
    });

    it("should display an error message on failed fetch", async () => {
        JoblyApi.getJobs.mockRejectedValue(new Error("Failed to load jobs. Please try again later.")) // Mock an error response

        render(
            <MemoryRouter>
                <UserDashboard currentUser ={ currentUser } />
            </MemoryRouter>
        );

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Failed to load jobs. Please try again later./i)).toBeInTheDocument();
        });
    });
});