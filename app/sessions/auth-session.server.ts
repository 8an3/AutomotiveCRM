import { createCookieSessionStorage, redirect } from "@remix-run/node";

import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/libs/prisma.server";
export type { User } from "@prisma/client";

// Export the whole sessionStorage object
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3tqwe45"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = authSessionStorage
/**
export function getSession(request: Request): Promise<Session> {
  return authSessionStorage.getSession(request.headers.get('Cookie'))
}

export async function getSessionUser(request: Request) {
  const session = await getSession(request)
  return session.get('user') as UserProfile
}

export async function getLoggedInUser(request: Request) {
  const user = await getSessionUser(request)
  if (user) return user
  throw needLogin(request)
}

export async function needLogin(request: Request) {
  const { pathname, search } = new URL(request.url)
  const session = await getSession(request)
  session.set('redirect', `${pathname}${search}`)
  return redirect(LOGIN_URL, {
    headers: {  await authenticator.isAuthenticated(request, {
    successRedirect: '/checksubscription',
  })
      'Set-Cookie': await commitSession(session),
    },
  })
}
 */
