import { createCookieSessionStorage, redirect } from "@remix-run/node";
export type { User } from "@prisma/client";

// Export the whole sessionStorage object
export const appearance_66 = createCookieSessionStorage({
  cookie: {
    name: "appearance_66",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3tqwe45"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = appearance_66

