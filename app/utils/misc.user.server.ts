import { type DataFunctionArgs, createCookie, redirect, json } from "@remix-run/node";
import type { HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
import { RefreshToken } from "~/services/google-auth.server";
import { createCookieSessionStorage } from "@remix-run/node";

import {
  convertDaysToSeconds,
  getEnv,
  getEnvPrivate,
  invariant,
} from "~/utils";
import { getSession, commitSession } from "../sessions/auth-session.server";
import { prisma } from "~/libs";



let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}



// TODO: Integrate on register and login flow
const remember = true;

// auth cookie
let cookie = createCookie("session_66", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

//  this ojne for user prefs and small thinfs
export const client_66 = createCookieSessionStorage({
  cookie: {
    name: "client_66",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: remember
      ? convertDaysToSeconds(7) // EDITME: Set max age for session persistence
      : undefined,
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",

  },
});
export const { getSession, commitSession, destroySession } = client_66;

/**  this ojne for user prefs and small thinfs
export const token_66 = createCookieSessionStorage({
  cookie: {
    name: "token_66n",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: remember
      ? convertDaysToSeconds(7) // EDITME: Set max age for session persistence
      : undefined,
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",

  },
});
export const { getSession, commitSession, destroySession } = token_66;
 */

export async function SetClient66(userId, clientfileId, financeId, dashbaordId, request) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set('userId', userId)
  session.set('clientfileId', clientfileId)
  session.set('financeId', financeId)
  session.set('dashbaordId', dashbaordId)
  console.log(userId, clientfileId, financeId, dashbaordId, 'ids')

  return json({ ok: true }, {
    headers: {
      "Set-Cookie": await commitSession(session)
    },
  });
}
export const client_666 = createCookie("client_66", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export async function SetClient666(userId, ClientfileId, financeId, dashbaordId) {
  console.log(userId, ClientfileId, financeId, dashbaordId, 'ids')
  return json({ ok: true }, {
    headers: {
      "Set-Cookie": await client_66.serialize({
        userId: userId,
        clientfileId: ClientfileId,
        financeId: financeId,
        dashbaordId: dashbaordId,
      }),
    },
  });
}


export async function CheckToken({ request }: LoaderArgs) {
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get('email')
  const expires_in = userSession.get('expires_in');
  const refreshToken = userSession.get('refreshToken');

  const now = new Date();
  console.log(expires_in, now.getTime(), 'expiresIn')
  if (expires_in - now.getTime() <= 0) {
    const getToken = await RefreshToken(refreshToken)
    userSession.set("accessToken", getToken.access_token);
    console.log(getToken)
    await prisma.user.update({ where: { email: email }, data: { expires_in: getToken.expires_in, refreshToken: getToken.refresh_token } })
  }
}

export async function getAuthFromRequest(
  request: Request,
): Promise<string | null> {
  let userId = await cookie.parse(request.headers.get("Cookie"));
  return userId ?? null;
}

export async function setAuthOnResponse(
  response: Response,
  userId: string,
): Promise<Response> {
  let header = await cookie.serialize(userId);
  response.headers.append("Set-Cookie", header);
  return response;
}

export async function requireAuthCookie(request: Request) {
  let userId = await getAuthFromRequest(request);
  if (!userId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await cookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return userId;
}

export async function redirectIfLoggedInLoader({ request }: DataFunctionArgs) {
  let userId = await getAuthFromRequest(request);
  if (userId) {
    throw redirect("/quote/Harley-Davidson");
  }
  return null;
}

export async function redirectWithClearedCookie(): Promise<Response> {
  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(null, {
        expires: new Date(0),
      }),
    },
  });
}

export async function getToken66t(
  request: Request,
): Promise<string | null> {
  let token_66 = await cookie.parse(request.headers.get("Cookie"));
  return userId ?? null;
}

