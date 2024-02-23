import { Authenticator } from 'remix-auth'

//import { sessionStorage } from './session.server'
//import { createUser } from '../modules/user/mutations'
import type { User } from '../models/user.server'
import { prisma } from '../libs'
import { createCookieSessionStorage } from '@remix-run/node'
import axios from 'axios'

export async function RefreshToken(refreshTokens) {
  console.log()
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
    client_secret: "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",
    refresh_token: refreshToken,
    grant_type: 'refresh_token',

  });
  console.log(response)
  if (!response) {
    console.log(response)
  }
  return response

}

export async function RevokeToken(token) {
  console.log()
  const response = await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`, {

  });
  console.log(response)
  if (!response) {
    console.log(response)
  }
  return response

}

/**
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__google_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage


export let authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
})

authenticator.use(
  new GoogleStrategy(
    {
      clientID: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      // scope: 'https://mail.google.com/',
      accessType: 'offline',
      prompt: 'consent',

    },
    async ({ profile }) => {
      console.log('hitting googlestrat')
      // Checks for User existence in database.
      // const email = profile.emails[0].value
      // const user: AuthSession = await model.user.query.getByEmail({ email: email }))
      // Get user from database.
      let user = await getUserByEmail(profile._json.email)
      console.log(profile._json.email, profile.emails[0].value)

      console.log('google-auth', profile)
      if (!user) {
        user = await createUser({ email: profile._json.email })
        if (!user) throw new Error('Unable to create user.')
      }
      return user

    },
  ), 'google'
)

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
  })
}



 * Strategies - Github.

authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: `${HOST_URL}/auth/${SocialsProvider.GITHUB}/callback`,
    },
    async ({ profile }) => {
      // Checks for User existence in database.
      const user = await getUserByProviderIdIncludingSubscription(profile.id)

      // If User has not been found:
      // - Creates and stores a new User in database.
      // - Returns newly created User as Auth Session.
      if (!user) {
        const newUser = await createUser({
          providerId: profile.id,
          name: profile.displayName,
          email: profile._json.email,
          avatar: profile._json.avatar_url,
        })
        if (!newUser)
          throw new Error('There was an Error trying to create a new User.')

        return {
          ...newUser,
        }
      }

      // Returns user from database as Auth Session.
      return {
        ...user,
      }
    },
  ),
)
 */
/**
 * Strategies - Discord.

authenticator.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      callbackURL: `${HOST_URL}/auth/${SocialsProvider.DISCORD}/callback`,
      scope: ['identify', 'email'],
    },
    async ({ profile }) => {
      // Checks for User existence in database.
      const user = await getUserByProviderIdIncludingSubscription(profile.id)

      // If User has not been found:
      // - Creates and stores a new User in database.
      // - Returns newly created User as Auth Session.
      if (!user) {
        const newUser = await createUser({
          providerId: profile.id,
          name: profile.displayName,
          email: profile.__json.email ? profile.__json.email : '',
          avatar: profile.__json.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
            : '',
        })
        if (!newUser)
          throw new Error('There was an Error trying to create a new User.')

        return {
          ...newUser,
        }
      }

      // Returns user from database as Auth Session.
      return {
        ...user,
      }
    },
  ),
)
 */
