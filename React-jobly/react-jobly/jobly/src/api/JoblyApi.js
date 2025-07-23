import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
    // the token for interactive with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
        console.debug("Current Token:", JoblyApi.token);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${JoblyApi.token}` };
        console.debug("Request Headers:", headers);
        const params = (method === "get")
            ? data
            : {};

        try {
            const response = await axios({ url, method, data, params, headers });
            console.debug("API Response:", response.data);
            return response.data;

        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Get details on a company by handle. */

    // Method to get a specific company
    static async getCompany(handle) {
        if (!handle) {
            console.error("Company handle is undefined");
            throw new Error("Company handle is required");
        }
        try {
            let res = await this.request(`companies/${handle}`);
            return res.company;
        } catch (err) {
            console.error("Failed to get company:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up the call stack if needed
        }
    }

    // Method to get all companies
    static async getAllCompanies(params) {
        try {
            let res = await this.request(`companies/`, params, 'GET');
            return res.companies;
        } catch (err) {
            console.error("Failed to get all companies:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to create a company
    static async createCompany(data) {
        try {
            let res = await this.request(`companies/`, data, 'POST');
            return res.company;
        } catch (err) {
            console.error("Failed to create company:", err) // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to update a company
    static async updateCompany(handle, data) {
        try {
            let res = await this.request(`companies/${handle}`, data, 'PATCH');
            return res.company;
        } catch (err) {
            console.error("Failed to update company:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to delete a company
    static async deleteCompany(handle) {
        try {
            await this.request(`companies/${handle}`, {}, 'DELETE');
        } catch (err) {
            console.error("Failed to delete:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Log in an existing user and store their auth token
    static async loginUser({ username, password }) {
        try {
            let res = await this.request(`auth/token`, { username, password }, 'POST');
            this.token = res.token; // Store the received token
            return res.token; // Return it so callers can use it
        } catch (err) {
            console.error("Login failed:", err);
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Register a new user and store their auth token
    static async registerUser({ username, password, firstName, lastName, email }) {
        try {
            let res = await this.request(`auth/register`, { username, password, firstName, lastName, email }, 'POST');
            this.token = res.token // Store the received token
            return res.token; // Return it so callers can use it
        } catch (err) {
            console.error("Registration failed:", err);
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to create a job
    static async createJob(data) {
        try {
            let res = await this.request(`jobs/`, data, 'POST');
            return res.job;
        } catch (err) {
            console.error("Failed to create job:", err) // Logged error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to get jobs
    static async getJobs(filters = {}) {
        try {
            let res = await this.request(`jobs/`, filters, 'GET');
            return res.jobs; // Return list of jobs
        } catch (err) {
            console.error("Failed to get jobs:", err);// Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to get a specific job
    static async getJob(id) {
        try {
            let res = await this.request(`jobs/${id}`, {}, 'GET');
            return res.job; // Returns specific job
        } catch (err) {
            console.error("Failed to get job:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to update job
    static async updateJob(id, data) {
        try {
            let res = await this.request(`jobs/${id}`, data, 'PATCH');
            return res.job; // Returns updated job
        } catch (err) {
            console.error("Failed to update:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to delete a job
    static async deleteJob(id) {
        try {
            await this.request(`jobs/${id}`, {}, 'DELETE');
        } catch (err) {
            console.error("Failed to delete:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up the call stack if needed
        }
    }

    // Method to create user
    static async createUser(data) {
        try {
            let res = await this.request(`users/`, data, 'POST');
            return res.user; // Return created user
        } catch (err) {
            console.error("Failed to create user:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to get users
    static async getAllUsers() {
        try {
            let res = await this.request(`users/`);
            return res.users;
        } catch (err) {
            console.error("Failed to get users:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up the call stack if needed
        }
    }

    // Method to get specific user
    static async getUser(username) {
        try {
            let res = await this.request(`users/${username}`, null, 'GET');
            return res.user; // Returns user
        } catch (err) {
            console.error("Failed to find user:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to update user
    static async updateUser(username, data) {
        try {
            let res = await this.request(`users/${username}`, data, 'PATCH');
            return res.user;
        } catch (err) {
            console.error("Failed to update user:", err) // Log error for debugging
            throw err; // Rethrow error to handle it further up the call stack if needed
        }
    }

    // Method to delete user
    static async deleteUser(username) {
        try {
            await this.request(`users/${username}`, null, 'DELETE');
        } catch (err) {
            console.error("Failed to delete user:", err) // Log error for debugging
            throw err; // Rethrow error to handle it further up call stack if needed
        }
    }

    // Method to allow user to apply to job
    static async applyToJob(username, jobId) {
        try {
            let res = await this.request(`users/${username}/jobs/${jobId}`, {}, 'POST') // Send POST request to apply to a job
            return res.applied; // Returns job id applied to
        } catch (err) {
            console.error("Failed to apply to job:", err); // Log error for debugging
            throw err; // Rethrow error to handle it further up the call stack if needed
        }
    }
}

// for now, put token ("testuser" / "password" on class)
/*JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";*/

export default JoblyApi;