import { createCookieSessionStorage } from "@remix-run/node";

import {
  convertDaysToSeconds,
  getEnv,
  getEnvPrivate,
  invariant,
} from "~/utils";

const env = getEnv();
const envPrivate = getEnvPrivate();

invariant(envPrivate.REMIX_SESSION_SECRET, "REMIX_SESSION_SECRET must be set");

// TODO: Integrate on register and login flow
const remember = true;

// Export the whole sessionStorage object
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

// You can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = authSessionStorage;
