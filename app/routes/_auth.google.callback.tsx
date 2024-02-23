
import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json, createCookie } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis'
import * as querystring from 'querystring';
import { prisma } from "~/libs";
import bcrypt from "bcryptjs";


const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  //"http://localhost:3000/google/callback"
  process.env.GOOGLE_PROD_CALLBACK_URL
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
});

const scopes = [
  'https://mail.google.com/',
];


export async function loader({ request, params, req }: LoaderFunction) {
  const queryParams23 = new URL(request.url).searchParams;
  const code23 = queryParams23.get('code')
  //console.log(queryParams23, code23, '23 and 23')
  console.log(request.headers, 'request.headers');
  console.log(request, 'request');
  const url = new URL(request.url);
  console.log(url, 'url auth google callback', url.hostname)

  const { tokens } = await oauth2Client.getToken(code23);
  oauth2Client.setCredentials(tokens);
  const userRes = await gmail.users.getProfile({ userId: 'me' });

  let session = await getSession(request.headers.get("Cookie"));
  console.log(request.headers, 'request.headers');
  console.log(request, 'request');

  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);
  session.set("expires_in", tokens.expires_in);
  const email = userRes.data.emailAddress
  const name = userRes.data.name
  session.set("name", name);
  session.set("email", email);
  // console.log(userRes.data.emailAddress)
  let user = await prisma.user.findUnique({ where: { email: email } })

  if (user) {
    await prisma.user.update({ where: { email: email }, data: { expires_in: tokens.expires_in, refreshToken: tokens.refresh_token } })
  }

  if (!user) {
    const password = 'doesntMatterWeHaveOauth12321223123'
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: "NORMAL" },
    });

    user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: name.trim(),
        email: email,
        password: { create: { hash: hashedPassword } },
        role: { connect: { id: defaultUserRole?.id } },
        profile: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },
        DealerFeesAdmin: {
          dealer: 'Auto Sales',
          dealerAddress: '1234 sales st',
          dealerProv: 'ON',
          dealerPhone: '4164164167',
          omvicNumber: '123456',
          userLoanProt: '0',
          userTireandRim: '0',
          userGap: '0',
          userExtWarr: '0',
          userServicespkg: '0',
          vinE: '0',
          lifeDisability: '0',
          rustProofing: '0',
          userLicensing: '55',
          userFinance: '0',
          userDemo: '0',
          userGasOnDel: '0',
          userOMVIC: '12.5',
          userOther: '0',
          userTax: '13',
          userAirTax: '0',
          userTireTax: '10.86',
          userGovern: '0',
          userPDI: '0',
          userLabour: '128',
          userMarketAdj: '0',
          userCommodity: '0',
          destinationCharge: '0',
          userFreight: '0',
          userAdmin: '699',
          userEmail: email,
        }
      }
    })
  }

  let secret = process.env.COOKIE_SECRET || "default";
  if (secret === "default") {
    console.warn(
      "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
    );
    secret = "default-secret";
  }
  const remember = true;
  const userId = await prisma.user.findUnique({ where: { email: email }, })
  session.set("userid", userId?.id);
  await commitSession(session);
  // console.log(name, 'name', email, 'email', tokens.access_token, tokens.refresh_token)


  let cookie = createCookie("session_66", {
    secrets: ['secret'],
    // 30 days
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const cookies = cookie.serialize({
    'name': name,
    email: email,
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
  })

  // console.log(session, 'auth google')
  return redirect('/checksubscription', {
    headers: {
      "Set-Cookie":
        await commitSession(session) //&&
      // await cookies

    },
  });
}
