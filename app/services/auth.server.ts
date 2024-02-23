import { Authenticator, SessionStrategy, AuthorizationError } from "remix-auth";
import { getSession, commitSession, destroySession, sessionStorage } from '../sessions/session.server'
import { FormStrategy } from "remix-auth-form";
import { model } from "~/models";
import type { UserSession } from "~/helpers";
import { prisma } from "~/libs";
import { Strategy } from 'remix-auth';

export const authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString();
    const name = form.get("name")?.toString();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();
    console.log(email, name, username, password, 'auth.server.ts')
    if (!email || !password) {
      throw new AuthorizationError("User and password are required");
    }

    const user = (await model.user.query.getByEmail({ email })) as UserSession;

    if (!user.id) {
      throw new AuthorizationError("User is not found");
    }

    return user;
  }),

  "user-pass"
);



/**
export const authenticator = new Authenticator<UserSession>(authSessionStorage);

authenticator.use(
  new FormStrategy(async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    console.log(session, 'UTHR.SERVER')
    const email = session.get("email");
    if (!email) {
      throw new AuthorizationError("User and password are required");
    }
    const user = (await model.user.query.getByEmail({ email })) as UserSession;
    console.log(user, 'auth.serve4r')
    if (!user.id) {
      throw new AuthorizationError("User is not found");
    }

    return user;
  }),

  "user-pass"
);








/*
we needd to put this in somehow
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

/**
authenticator.use(
  new SessionStrategy(async ({ request }) => {
    // works maybe
    const queryParams23 = new URL(request.url).searchParams;
    const code23 = queryParams23.get('code')
    console.log(queryParams23, code23, '23 and 23')
    // works
    const queryParams = querystring.parse(request.url.split('?')[1]);
    const code = queryParams.code as string;
    if (!code23) {
      console.error('Missing "code" in request query:', request.url.search);
    }
    const { tokens } = await oauth2Client.getToken(code23);
    oauth2Client.setCredentials(tokens);
    const userRes = await gmail.users.getProfile({ userId: 'me' });

    // dont know yet
    const session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", tokens.access_token);
    session.set("refreshToken", tokens.refresh_token);
    session.set("expires_in", tokens.expires_in);
    // session.set("profile", userRes);
    const email = userRes.data.emailAddress
    session.set("email", email);
    console.log(userRes.data.emailAddress)

    console.log('queryParams22:', queryParams);
    console.log('code66:', code);
    console.log(userRes.data.emailAddress)
    console.log(tokens)
    await prisma.user.update({ where: { email: email }, data: { expires_in: tokens.expires_in, refreshToken: tokens.refresh_token } })

    const user = await prisma.user.findUnique({
      where: { email: email },
    })
    session.set("userid", user?.id);

    return {
      accessToken: session.get("accessToken"),
      refreshToken: session.get("refreshToken"),
      expires_in: session.get("expires_in"),
      email: email,
      user: user.id
    };
  }),
  "session"
);
 */
