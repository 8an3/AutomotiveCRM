import { authenticator, } from "~/services/auth";
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, DataFunctionArgs } from "@remix-run/node";
import { prisma } from "~/libs";


export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email")
  let name = session.get("name")
  await authenticator.isAuthenticated(request, { successRedirect: "/dealer/checksubscription", });
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }
  session.set("email", email);

  let error = session.get(authenticator.sessionErrorKey);
  if (error) { return json({ error }); }

  return null
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
*/
