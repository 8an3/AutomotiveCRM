import { createCookieSessionStorage } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { model } from "~/models";
//import { authenticator } from "~/services";

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
export const dealerSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "dealersales",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: remember
      ? convertDaysToSeconds(7) // EDITME: Set max age for session persistence
      : undefined,
    secrets: [envPrivate.REMIX_SESSION_SECRET],
    secure: env.NODE_ENV === "production",
  },
});

// You can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = dealerSessionStorage;

// You can also export a function that wraps getSession to add custom behavior
export async function requireDealerSession({ request, params }) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });

  const url = params
  const userId = user.id
  if (!request.headers.get("Cookie")) {
    console.log('no cookie')
  }
  sessionStorage.setItem('user', JSON.stringify({ id: userId, email: 'email', url: url }))
  console.log('cookie created')
  return commitSession

}
