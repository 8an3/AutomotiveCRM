import { authenticator, } from "~/services/auth";
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, DataFunctionArgs } from "@remix-run/node";
import { UseRefreshToken, FetchUserProfile } from "./_auth.auth";
import { prisma } from "~/libs";


export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email")
  let accessToken = session.get('accessToken')
  let name = session.get("name")
  await authenticator.isAuthenticated(request, { successRedirect: "/checksubscription", });
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }
  session.set("accessToken", accessToken);
  session.set("email", email);

  let error = session.get(authenticator.sessionErrorKey);
  if (error) { return json({ error }); }

  const userProfile = await FetchUserProfile(accessToken)
  if (userProfile) { return redirect('/quote/Harley-Davidson') }
  if (!userProfile) {
    let user = await GetUser(email)

    const accessRequest = await UseRefreshToken(user.refreshToken)
    const accessToken = accessRequest.access_token
    const refresh_token = accessRequest.refresh_token
    const idToken = accessRequest.id_token
    const expires_in = accessRequest.expires_in
    console.log(accessToken, accessToken, refresh_token, idToken, expires_in, 'refreshtoken request')
    if (!accessToken) {
      console.log('no access token received')
      return null
    }
    if (accessToken) {
      console.log('access token received')

      const userProfile = await FetchUserProfile(accessToken)
      const email = userProfile.email || ''
      const name = userProfile.name
      await prisma.user.update({ where: { email: email }, data: { expires_in: expires_in, idToken: idToken, refreshToken: refresh_token } })
      session.set("accessToken", accessToken);
      session.set("name", name);
      session.set("email", email);
      return json({ ok: true }, {
        headers: {
          "Set-Cookie":
            await commitSession(session)
        },
      });
    }
  }
  // console.log(user, userSession, 'user and userSession root loader')
  /* google auth
  const API_KEY = process.env.GOOGLE_API_KEY
  let tokens = userSession.get("accessToken")
  // new
  const refreshToken = userSession.get("refreshToken")
  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  const userRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/profile`, {
    headers: { Authorization: 'Bearer ' + tokens, Accept: 'application/json' }
  });
  console.log(userRes, 'userRes')
  // new
  if (userRes.status === 401) {
    const unauthorizedAccess = await Unauthorized(refreshToken)
    tokens = unauthorizedAccess

    userSession.set("accessToken", tokens);
    await commitSession(userSession);

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: tokens,
    })
    await cookies
    console.log(tokens, 'authorized tokens')

  } else { console.log('Authorized'); }
  */



  return json({
    domain,
    accessToken,
    email,
    redirectIfLoggedInLoader,
    headerHeadingText,
    headerDescriptionText,
  },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}
