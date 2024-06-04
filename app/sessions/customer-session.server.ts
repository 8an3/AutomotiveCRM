import { createCookieSessionStorage, redirect } from "@remix-run/node";

import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/libs/prisma.server";
export type { User } from "@prisma/client";

// Export the whole sessionStorage object
export const customerSession = createCookieSessionStorage({
  cookie: {
    name: "__cust-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3tqwe45"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = customerSession
