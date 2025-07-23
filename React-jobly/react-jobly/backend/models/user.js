"use strict";

import { BCRYPT_WORK_FACTOR, DEBUG_LOGGING_ENABLED } from '../config.js';
import db from "../db";
import bcrypt from "bcrypt";
import { sqlForPartialUpdate } from "../helpers/sql";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../expressError";

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("query string:", `\nSELECT username,
    password,
    first_name AS "firstName",
    last_name AS "lastName",
    email,
    is_admin AS "isAdmin"
    FROM users
    WHERE username = $1`);
        console.log("values:", [username]);
      }
      // try to find the user first
      const result = await db.query(
        `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
      );

      const user = result.rows[0];

      if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
          delete user.password;
          return user;
        }
      }

      throw new UnauthorizedError("Invalid username/password");
    } catch (error) {
      console.error("Error in authentication: ", error);
      throw error;
    }
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, firstName, lastName, email, isAdmin }) {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("Running query with string:", `SELECT username
        FROM users
        WHERE username = $1`);
        console.log("With values:", [username]);
      }
      const duplicateCheck = await db.query(
        `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
      );

      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      if (DEBUG_LOGGING_ENABLED) {
        console.log(`Running query: INSERT INTO users
        (username,
        password,
        first_name,
        last_name,
        email,
        is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`);
        console.log("With values:", [username, hashedPassword, firstName, lastName, email, isAdmin]);
      } else {
        console.log("With values:", [username, "***", firstName, lastName, email, isAdmin]);
      }

      const result = await db.query(
        `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
      );

      const user = result.rows[0];

      return user;
    } catch (error) {
      console.error("Error in registration: ", error);
      throw error;
    }
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("Running with query string:", `SELECT username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
        FROM users
        ORDER BY username`);
      }

      const result = await db.query(
        `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
      );

      return result.rows;

    } catch (error) {
      console.error("Error in finding all:", error);
      throw error;
    }
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("Running query with username: ", username);
        console.log("\nQuery String: SELECT username, first_name AS firstName, last_name AS lastName, email, is_admin AS isAdmin FROM users WHERE username = $1", "\nWith username: ", username);
      }

      const userRes = await db.query(
        `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin" 
           FROM users
           WHERE username = $1`,
        [username],
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      if (DEBUG_LOGGING_ENABLED) {
        console.log("Running the applications query: SELECT a.job_id FROM applications AS a WHERE a.username =", username);
      }

      const userApplicationsRes = await db.query(
        `SELECT a.job_id
           FROM applications AS a
           WHERE a.username = $1`, [username]);

      if (DEBUG_LOGGING_ENABLED) {
        console.log("Successfully executed the applications query");
      }

      user.applications = userApplicationsRes.rows.map(a => a.job_id);
      return user;

    } catch (error) {
      console.error("Error in getting user:", error);
      throw error;
    }
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    try {
      if (data.password) {
        if (DEBUG_LOGGING_ENABLED) {
          console.log(`Hashing password with bcrypt work factor: ${BCRYPT_WORK_FACTOR}`);
        }
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }

      const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
        });
      const usernameVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;

      if (DEBUG_LOGGING_ENABLED) {
        console.log(`Running update query: ${querySql}`);
        console.log(`With values: ${[...values, username]}`);
      }

      const result = await db.query(querySql, [...values, username]);
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      delete user.password;
      return user;

    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("Running the delete user query for username: ", username);
        console.log(`\nQuery String: DELETE FROM users WHERE username = ${username} RETURNING username`);
      }
      let result = await db.query(
        `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
      );
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  }

  /** Apply for job: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

  static async applyToJob(username, jobId) {
    try {
      if (DEBUG_LOGGING_ENABLED) {
        console.log("Checking if job exists with jobId: ", jobId);
      }

      const preCheck = await db.query(
        `SELECT id
            FROM jobs
            WHERE id = $1`,
        [jobId]
      );
      const job = preCheck.rows[0];

      if (!job) throw new NotFoundError(`No job: ${jobId}`);

      if (DEBUG_LOGGING_ENABLED) {
        console.log("Job exists. Checking if user exists with username: ", username);
      }

      const preCheck2 = await db.query(
        `SELECT username
            FROM users
            WHERE username = $1`,
        [username]
      );
      const user = preCheck2.rows[0];

      if (!user) throw new NotFoundError(`No username: ${username}`);

      if (DEBUG_LOGGING_ENABLED) {
        console.log("User exists. Creating new application with jobId: ", jobId, " and username: ", username);
      }

      await db.query(
        `INSERT INTO applications (job_id, username)
            VALUES ($1, $2)`,
        [jobId, username]
      );

      if (DEBUG_LOGGING_ENABLED) {
        console.log("Application created successfully.");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      throw error;
    }
  }
}


export default User;
