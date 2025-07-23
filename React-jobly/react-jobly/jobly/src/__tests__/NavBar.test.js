import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // To provide routing context
import NavBar from "../NavBar";

describe("NavBar", () => {
    const mockOnLogout = jest.fn(); // Mock the onLogout function

    it("should render logo and login/signup links when not authenticated", () => {
        render(
            <MemoryRouter>
                <NavBar isAuthenticated={false} onLogout={mockOnLogout} />
            </MemoryRouter>
        );

        // Check if the logo is rendered
        expect(screen.getByText(/Jobly/i)).toBeInTheDocument();
        // Check if the login and signup links are rendered
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    });

    it("should render welcome message and navigation links when authenticated", () => {
        const currentUser = { username: "testuser" };
        render(
            <MemoryRouter>
                <NavBar isAuthenticated={true} currentUser={currentUser} onLogout={mockOnLogout} />
            </MemoryRouter>
        );

        // Check if the welcome message is rendered
        expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
        // Check if the navigation links are rendered
        expect(screen.getByText(/Companies/i)).toBeInTheDocument();
        expect(screen.getByText(/Jobs/i)).toBeInTheDocument();
        expect(screen.getByText(/Profile/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("should call onLogout and navigate to home when logout button is clicked", () => {
        const currentUser = { username: "testuser" };

        render(
            <MemoryRouter>
                <NavBar isAuthenticated={true} currentUser={currentUser} onLogout={mockOnLogout} />
            </MemoryRouter>
        );

        // Click the logout button

        fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

        // Check if onLogout was called
        expect(mockOnLogout).toHaveBeenCalled();
    });
});