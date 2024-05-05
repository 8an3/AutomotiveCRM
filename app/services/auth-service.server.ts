import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { model } from "~/models";
import { authSessionStorage, getSession, commitSession } from "~/sessions/auth-session.server";
import type { UserSession } from "~/helpers";
import { redirect } from "@remix-run/server-runtime";

export const authenticator = new Authenticator<UserSession>(authSessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString();
    const name = form.get("name")?.toString();

    if (!email || !name) {
      throw new AuthorizationError("User and name are required");
    }

    const user = (await model.user.query.getByEmail({ email })) as UserSession;

    if (!user.id) {
      throw new AuthorizationError("User is not found");
    }

    return user
  }),

  "user-pass"
);

/**
 * Authentication/Authorization
 *
 * Authenticate: After submitting the correct credentials on login
 * Authorize: Before doing something sensitive
 */

/**
 * Create an instance of the authenticator, pass a generic with what
 * strategies will return and will store in the session.
 */

/**
 * Authenticator Strategy
 *
 * This is just for the Login, not the Register.
 * Note that the complete login with password logic is in the login route action.
 * Because we want to do inline error message along with Conform,
 * not using the error session thrown by Remix Auth's AuthorizationError.
 */




/* this worked for url and /auth/google at one point try to go back through chatgpt to get find the right code
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString();

    if (!email) {
      throw new AuthorizationError("User is required");
    }

    const user = (await model.user.query.getByEmail({ email })) as UserSession;

    if (!user.id) {
      throw new AuthorizationError("User is not found");
    }

    return user;
  }),

  "google"
);

*/
