import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import JoblyApi from "../../src/api/JoblyApi";

describe("JoblyApi", () => {
    let mock;

    beforeEach(() => {
        // Create a new instance of the mock adapter before each test
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        // Restore the default behavior of axios after each test
        mock.restore();
    });

    describe("getCompany", () => {
        it("should return company details for a valid handle", async () => {
            const handle = "test-company";
            const mockCompany = { handle: "test-company", name: "Test Company" };

            // Mock the API response
            mock.onGet(`http://localhost:3001/companies/${handle}`).reply(200, {
                company: mockCompany,
            });

            const company = await JoblyApi.getCompany(handle);
            expect(company).toEqual(mockCompany);
        });

        it("should throw an error for an invalid handle", async () => {
            const handle = "invalid-company";

            // Mock the API response for an error
            mock.onGet(`http://localhost:3001/companies/${handle}`).reply(404, {
                error: { message: "Company not found" },
            });

            await expect(JoblyApi.getCompany(handle)).rejects.toEqual(["Company not found"]);
        });

        it("should log an error if the request fails", async () => {
            const handle = "error-company";

            // Mock the API response for an error
            mock.onGet(`http://localhost:3001/companies/${handle}`).reply(500, {
                error: { message: "Internal server error" },
            });

            await expect(JoblyApi.getCompany(handle)).rejects.toEqual(["Internal server error"]);
        });
    });

    describe("getAllCompanies", () => {
        it("should return a list of companies when called without params", async () => {
            const mockCompanies = [
                { handle: "apple", name: "Apple Inc." },
                { handle: "google", name: "Google LLC" }
            ];

            mock.onGet("http://localhost:3001/companies/").reply(200, {
                companies: mockCompanies
            });
            const companies = await JoblyApi.getAllCompanies();
            expect(companies).toEqual(mockCompanies);
        });
        it("should return a filtered list of companies when called with params", async () => {
            const params = { minEmployees: 50, maxEmployees: 500 };
            const filteredCompanies = [
                { handle: "startup1", name: "Startup One", numEmploees: 100 },
                { handle: "startup2", name: "Startup Two", numEmploees: 300 }
            ];
            // axios-mock-adapter does not validate query params by default,
            // so I'm using .onGet with a function to verify query params if
            // desired
            mock.onGet(/\/companies\/.*/).reply(config => {
                // validates query params forwarded by axios in config.params
                expect(config.params).toEqual(params);
                return [200, { companies: filteredCompanies }];
            });
            const companies = await JoblyApi.getAllCompanies(params);
            expect(companies).toEqual(filteredCompanies);
        });
        it("should throw an error when the API call fails", async () => {
            mock.onGet("http://localhost:3001/companies/").reply(500, {
                error: { message: "Internal Server Error" }
            });
            await expect(JoblyApi.getAllCompanies()).rejects.toEqual(["Internal Server Error"]);
        });
    });

    describe("createCompany", () => {
        it("should create a company and return the company data on success", async () => {
            const newCompanyData = {
                handle: "newco",
                name: "New Company",
                description: "A brand new company",
                numEmployees: 10,
                logoUrl: "http://example.com/logo.png"
            };
            const mockResponse = {
                company: newCompanyData
            };

            mock.onPost("http://localhost:3001/companies/").reply(201, mockResponse);

            const company = await JoblyApi.createCompany(newCompanyData);
            expect(company).toEqual(newCompanyData);
        });
        it("should throw an error if the API responds with an error", async () => {
            const newCompanyData = {
                handle: "badco",
                name: "Bad Company"
            };

            mock.onPost("http://localhost:3001/companies/").reply(400, {
                error: { message: "Invalid company data" }
            });
            await expect(JoblyApi.createCompany(newCompanyData)).rejects.toEqual(["Invalid company data"]);
        });
    });

    describe("updateCompany", () => {
        it("should update a company and return the updated company data on success", async () => {
            const handle = "testco";
            const updateData = {
                name: "updated company name",
                description: "updated description"
            };
            const mockResponse = {
                company: {
                    handle,
                    ...updateData
                }
            };

            mock.onPatch(`http://localhost:3001/companies/${handle}`).reply(200, mockResponse);

            const updatedCompany = await JoblyApi.updateCompany(handle, updateData);
            expect(updatedCompany).toEqual(mockResponse.company);
        });

        it("should throw an error if updating the company fails", async () => {
            const handle = "badco";
            const updateData = {
                name: "Bad Update"
            };

            mock.onPatch(`http://localhost:3001/${handle}`).reply(400, {
                error: { message: "Invalid update data" }
            });

            await expect(JoblyApi.updateCompany(handle, updateData)).rejects.toEqual(["Invalid update data"]);
        });
    });

    describe("deleteCompany", () => {
        it("should delete a company successfully", async () => {
            const handle = "testco";

            mock.onDelete(`http://localhost:3001/companies/${handle}`).reply(204);

            // The method does not return anything, checks it resolves without error
            await expect(JoblyApi.deleteCompany(handle)).resolves.toBeUndefined();
        });

        it("should throw an error if deleting company fails", async () => {
            const handle = "badCompany";

            mock.onDelete(`http://localhost:3001/companies/${handle}`).reply(400, {
                error: { message: "Can not delete company" }
            });

            await expect(JoblyApi.deleteCompany(handle)).rejects.toEqual(["Cannot delete company"]);
        });
    });

    describe("loginUser", () => {
        it("should login successfully and store the token", async () => {
            const credentials = { username: "testuser", password: "password123" };
            const mockToken = "fake-jwt-token";

            mock.onPost("http://localhost:3001/auth/token", credentials).reply(200, {
                token: mockToken,
            });

            // Clear token before test
            JoblyApi.token = null;

            await JoblyApi.loginUser(credentials);

            expect(JoblyApi.token).toBe(mockToken);
        });

        it("should throw an error if login fails", async () => {
            const credentials = { username: "baduser", password: "wrongpassword" };

            mock.onPost("http://localhost:3001/auth/token", credentials).reply(401, {
                error: { message: "Invalid credentials" },
            });

            await expect(JoblyApi.loginUser(credentials)).rejects.toEqual(["Invalid credentials"]);

            // Token should not be set
            expect(JoblyApi.token).toBeNull();
        });
    });

    describe("registerUser", () => {
        it("should register a new user successfully and store the token", async () => {
            const userData = {
                username: "newuser",
                password: "password123",
                firstName: "New",
                lastName: "User",
                email: "newuser@faker.com"
            };
            const mockToken = "fake-jwt-token";

            mock.onPost("http://localhost:3001/auth/register", userData).reply(201, {
                token: mockToken,
            });

            // Clear token before test
            JoblyApi.token = null;

            await JoblyApi.registerUser(userData);
            expect(JoblyApi.token).toBe(mockToken);
        });

        it("should throw an error if registration fails", async () => {
            const userData = {
                username: "baduser",
                password: "tiny",
                firstName: "failed",
                lastName: "User",
                email: "faileduser@fake.com"
            };

            mock.onPost("http://localhost:3001/auth/register", userData).reply(400, {
                error: { message: "Invalid registration data" },
            });

            await expect(JoblyApi.registerUser(userData)).rejects.toEqual(["Invalid registration data"]);

            // Token should not be set
            expect(JoblyApi.token).toBeNull();
        });
    });

    describe("createJob", () => {
        it("should create a job and return the job data on success", async () => {
            const newJobData = {
                title: "CNA",
                salary: 28800,
                equity: "0.25",
                companyHandle: "You Home Court Advantage"
            };

            const mockResponse = {
                job: {
                    id: 1,
                    ...newJobData
                }
            };

            mock.onPost("http://localhost:3001/jobs/").reply(201, mockResponse);

            const job = await JoblyApi.createJob(newJobData);
            expect(job).toEqual(mockResponse.job);
        });

        it("should throw an error if the api responds with an error", async () => {
            const newJobData = {
                title: "Invalid job"
            };

            mock.onPost("http://localhost:3001/jobs/").reply(400, {
                error: { message: "Invalid job data" }
            });

            await expect(JoblyApi.createJob(newJobData)).rejects.toEqual(["Invalid job data"]);
        });
    });

    describe("getJobs", () => {
        it("should return a list of jobs without filters", async () => {
            const mockJobs = [
                { id: 1, title: "Software Engineer", companyHandle: "techco" },
                { id: 2, title: "Product Manager", companyHandle: "bizco" }
            ];

            mock.onGet("http://localhost:3001/jobs/").reply(200, {
                jobs: mockJobs,
            });

            const jobs = await JoblyApi.getJobs();
            expect(jobs).toEqual(mockJobs);
        });

        it("should return filtered jobs when filters are applied", async () => {
            const filters = { title: "Engineer", minSalary: 100000 };
            const filteredJobs = [
                { id: 1, title: "Software Engineer", salary: 120000, companyHandle: "techco" }
            ];

            mock.onGet(/\/jobs\/.*/).reply(config => {
                expect(config.params).toEqual(filters);
                return [200, { jobs: filteredJobs }];
            });

            const jobs = await JoblyApi.getJobs(filters);
            expect(jobs).toEqual(filteredJobs);
        });

        it("should throw an error if the API call fails", async () => {
            mock.onGet("http://localhost:3001/jobs/").reply(500, {
                error: { message: "Internal server error" },
            });

            await expect(JoblyApi.getJobs()).rejects.toEqual(["Internal server error"]);
        });
    });

    describe("getJob", () => {
        it("should return the specific job for a valid id", async () => {
            const jobId = 1;
            const mockJob = {
                id: "jobId",
                title: "CDL Driver",
                salary: 80000,
                equity: "0.03",
                companyHandle: "Walmart"
            };

            mock.onGet(`http://localhost:3001/jobs/${jobId}`).reply(200, {
                jobs: mockJob
            });

            const job = await JoblyApi.getJob(jobId);
            expect(job).toEqual(mockJob);
        });

        it("should throw an error if the job is not found or an API call fails", async () => {
            const jobId = 999;

            mock.onGet(`http://localhost:3001/jobs/${jobId}`).reply(404, {
                error: { message: "Job not found "}
            });

            await expect(JoblyApi.getJob(jobId)).rejects.toEqual(["Job not found"]);
        });
    });

    describe("updateJob", () => {
        it("should update job and return the updated job data on success", async () => {
            const jobId = 1;
            const updateData = {
                title: "Junior Software Engineer",
                salary: 80000
            };

            const mockResponse = {
                job: {
                    id: jobId,
                    ...updateData
                }
            };

            mock.onPatch(`http://localhost:3001/jobs/${jobId}`).reply(200, mockResponse);

            const updatedJob = await JoblyApi.updateJob(jobId, updateData);
            expect(updatedJob).toEqual(mockResponse.job);
        });

        it("should throw an error if updating the job fails", async () => {
            const jobId = 2;
            const updateData = {
                title: "Invalid Job Title"
            };

            mock.onPatch(`http://localhost:3001/jobs/${jobId}`).reply(400, {
                error: { message: "Invalid data"}
            });

            await expect(JoblyApi.updateJob(jobId, updateData)).rejects.toEqual(["Invalid data"]);
        });
    });

    describe("deleteJob", () => {
        it("should delete a job successfully", async () => {
            const jobId = 1;

            mock.onDelete(`http://localhost:3001/jobs/${jobId}`).reply(204);

            // The method does not return anything, so just confirm it resolves without error
            await expect(JoblyApi.deleteJob(jobId)).resolves.toBeUndefined();
        });

        it("should throw an error if deleting the job fails", async () => {
            const jobId = 999;

            mock.onDelete(`http://localhost:3001/jobs/${jobId}`).reply(400, {
                error: { message: "Cannot delete job"}
            });

            await expect(JoblyApi.deleteJob(jobId)).rejects.toEqual(["Cannot delete job"]);
        });
    });

    describe("createUser", () => {
        it("should create a user and return the users data on success", async () => {
            const newUserData = {
                username: "newuser",
                firstName: "User",
                lastName: "Newly",
                email: "newlyuser@fake.com",
                isAdmin: false
            };

            const mockResponse = {
                user: newUserData
            };

            mock.onPost("http://localhost:3001/users/").reply(201, mockResponse);

            const user = await JoblyApi.createUser(newUserData);
            expect(user).toEqual(mockResponse.user);
        });

        it("should throw an error if the API responds with an error", async () => {
            const badUserData = {
                username: "",
                firstName: ""
            };

            mock.onPost("http://localhost:3001/users/").reply(400, {
                error: { message: "Invalid user data" }
            });

            await expect(JoblyApi.createUser(badUserData)).rejects.toEqual(["Invalid user data"]);
        });
    });

    describe("getAllUsers", () => {
        it("should return a list of users on success", async () => {
            const mockUsers = [
                { username: "user22", firstName: "User", lastName: "TwentyTwo", email: "user22@fake.com" },
                { username: "user24", firstName: "User", lastName: "TwentyFour", email: "user24@fake.com" }
            ];

            mock.onGet("http://localhost:3001/users/").reply(200, {
                users: mockUsers
            });

            const users = await JoblyApi.getAllUsers();
            expect(users).toEqual(mockUsers);
        });

        it("should throw an error if the API call fails", async () => {
            mock.onGet("http://localhost:3001/users/").reply(500, {
                error: { message: "Internal server error" }
            });

            await expect(JoblyApi.getAllUsers()).rejects.toEqual(["Internal server error"]);
        });
    });

    describe("getUser", () => {
        it("should return a specific user for a valid username", async () => {
            const username = "testuser";
            const mockUser = {
                username: "testuser",
                firstName: "Test",
                lastName: "User",
                email: "testuser@fake.com"
            };

            mock.onGet(`http://localhost:3001/users/${username}`).reply(200, {
                user: mockUser
            });

            const user = await JoblyApi.getUser(username);
            expect(user).toEqual(mockUser);
        });

        it("should throw an error if user is not found or API call fails", async () => {
            const username = "nonexistent";

            mock.onGet(`http://localhost:3001/users/${username}`).reply(404, {
                error: { message: "user not found" }
            });

            await expect(JoblyApi.getUser(username)).rejects.toEqual(["user not found"]);
        });
    });

    describe("updateUser", () => {
        it("should update a user and return the updated user data on success", async () => {
            const username = "testuser";
            const updateData = {
                firstName: "User",
                lastName: "Updated"
            };

            const mockResponse = {
                user: {
                    username,
                    ...updateData
                }
            };

            mock.onPatch(`http://localhost:3001/users/${username}`).reply(200, mockResponse);

            const updatedUser = await JoblyApi.updateUser(username, updateData);
            expect(updatedUser).toEqual(mockResponse.user);
        });

        it("should throw an error if updating the user fails", async () => {
            const username = "baduser";
            const updateData = {
                firstName: ""
            };

            mock.onPatch(`http://localhost:3001/users/${username}`).reply(400, {
                error: { message: "Invalid update data" }
            });

            await expect(JoblyApi.updateUser(username, updateData)).rejects.toEqual(["Invalid update data"]);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user successfully", async () => {
            const username = "testuser";

            mock.onDelete(`http://localhost:3001/users/${username}`).reply(204);

            // This method does not return anything, so ensuring it resolves without throwing
            await expect(JoblyApi.deleteUser(username)).resolves.toBeUndefined();
        });

        it("should throw an error if deleting the user fails", async () => {
            const username = "baduser";

            mock.onDelete(`http://localhost:3001/users/${username}`).reply(400, {
                error: { message: "Cannot delete user" }
            });

            await expect(JoblyApi.deleteUser(username)).rejects.toEqual(["Cannot delete user"]);
        });
    });

    describe("applyToJob", () => {
        it("should apply to a job and return job ID on success", async () => {
            const username = "testuser";
            const jobId = 1;

            const mockResponse = {
                applied: jobId
            };

            mock.onPost(`http://localhost:3001/users/${username}/jobs/${jobId}`).reply(200, mockResponse);

            const appliedJobId = await JoblyApi.applyToJob(username, jobId);
            expect(appliedJobId).toEqual(mockResponse.applied);
        });

        it("should throw an error if applying to the job fails", async () => {
            const username = "testuser";
            const jobId = 999;

            mock.onPost(`http://localhost:3001/users/${username}/jobs/${jobId}`).reply(400, {
                error: { message: "failed to apply to job"}
            });

            await expect(JoblyApi.applyToJob(username, jobId)).rejects.toEqual(["failed to apply to job"]);
        });
    });
});

