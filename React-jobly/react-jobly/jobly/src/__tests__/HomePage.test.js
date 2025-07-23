import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../HomePage"; 

describe("HomePage", () => {
    it("should render the homepage with the correct title and welcome message", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jobly");
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Welcome to Jobly!");
        expect(screen.getByText(/Your go-to platform for finding the perfect job or hiring the right talent./i)).toBeInTheDocument();
    });

    it("should render login and signup and signup buttons", () => {
        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("should navigate the login page when Log In button is clicked", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <HomePage />
            </MemoryRouter>
        );

        const loginButton = screen.getByRole("button", { name: /log in/i });
        expect(loginButton).toBeInTheDocument();
        // Simulate a click on the log in button
        loginButton.click();

        // Check if the URL changes to /login
        expect(window.location.pathname).toBeIn("/login");
    });

    it("should navigate to signup page when Sign Up button is clicked", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <HomePage />
            </MemoryRouter>
        );

        const signupButton = screen.getByRole("button", { name: /sign up/i });
        expect(signupButton).toBeInTheDocument();
        // Simulate a click on the Sign Up button
        signupButton.click();

        // Check if the URL changes to /signup
        expect(window.location.pathname).toBe("/signup");
    });
});