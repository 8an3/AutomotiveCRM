import { createCookieSessionStorage } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || 'STRONG_SECRET'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage
/**export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__google_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage
 */
