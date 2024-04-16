// app/routes/auth/microsoft.tsx
import type { ActionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth";
import { json, redirect } from "@remix-run/node";

import { getSession, commitSession, authSessionStorage } from '~/sessions/auth-session.server'
import { GetAuthorizationUrl } from "~/routes/__auth/auth";
// https//learn.microsoft.com/en-us/entra/identity-platform/app-sign-in-flow
// https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-on-behalf-of-flow
//export const loader = () => redirect("/login");

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get('user');
  return json({ user });
};

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get('email');
  if (!email) {
    console.log('no email microsoft')
    const url = GetAuthorizationUrl()
    return redirect(url)
  }
  if (email) {
    console.log('got email microsoft')
    return redirect('/checksubscription');
  }
  return redirect('/')
}
/*
export const action = async ({ request }: ActionArgs) => {
  const sessionData = await getSession(request.headers.get("Cookie"));

  const session = await authenticator.authenticate("microsoft", request, {
    successRedirect: "/dealer/checksubscription",
    failureRedirect: "/login",
    //  headers: session

  })
  return json({ session }, {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin'
    }
  });
};

/*
const MICRO_APP_ID = process.env.MICRO_APP_ID;
const MICRO_TENANT_ID = process.env.MICRO_TENANT_ID; //'fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6' //


export let action: LoaderFunction = async ({ request, response, }) => {
  try {
    const url = await FirstSignIn(MSAL)
    console.log(url)
    return redirect('/microsoft/callback')

  } catch (error) {
    console.error('Error in loader:', error);
    return {
      status: 500,
      props: {
        error: 'Internal Server Error',
      },
    };
  }
};


/**old sign in \
 *
 *
 *
 *  const msal = MSAL
  const session = await getSession(request.headers.get("Cookie"));

  const email = session.get("email")

  let user = await GetUser(email)
  user = await SignIn()

  if (user) {
    console.log('1')

    const check = await CheckUser(user)
    console.log('2')

    if (!check) {
      console.log('3')
      return redirect('/microsoft/callback')
    }
    console.log('4')
    return redirect('/microsoft/callback')
  }
  else {
    console.log('5')
    return null
  }
 */

/**
 *
 *
 *
 *
 *
 *
let url = `https://login.microsoftonline.com/${MICRO_TENANT_ID}/oauth2/v2.0/authorize?client_id=${params.client_id}&response_type=${params.response_type}&redirect_uri=${params.redirect_uri}&response_mode=${params.response_mode}&scope=${params.scope}&state=${params.state}`;

  try {
    const response = await fetch(`https://login.microsoftonline.com/${MICRO_TENANT_ID}/oauth2/v2.0/authorize?client_id=${params.client_id}&response_type=${params.response_type}&redirect_uri=${params.redirect_uri}&response_mode=${params.response_mode}&scope=${params.scope}&state=${params.state}`, {
      method: 'GET',
    })


 if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response.status, response)
    const responseUrl = response.url;
    const urlObject = new URL(responseUrl);
    const code = urlObject.searchParams.get('code');

    if (code) {
      const session = await getSession(request.headers.get("Cookie"));
      session.set("accessCode", code);
      await commitSession(session);

      console.log('Authorization code:', code);

      // Construct a successful response with appropriate headers
      const headers = { "Set-Cookie": await commitSession(session) };
      return new Response('Authorization code saved', { status: 200, headers });
    } else {
      console.log('Authorization code not found in URL');
      // Return a response indicating that the authorization code was not found
      return new Response('Authorization code not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    // Return a response indicating an internal server error
    return new Response('Internal server error', { status: 500 });
  }










import { type LoaderFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { google } from 'googleapis';
import EmailClient from './email';

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

export let action: LoaderFunction = async ({ request }) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
      email: EmailClient,
    });
    console.log(url)
    return redirect(url)

  } catch (error) {
    console.error('Error in loader:', error);
    return {
      status: 500,
      props: {
        error: 'Internal Server Error',
      },
    };
  }
};





var microRequest = {
  scopes: [
    "User.Read",
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
  ],
};

export const loader = () => redirect("/login");

export const action = async ({ request }: ActionArgs) => {

  const msalInstance = await MSALInstance();
  let session = await getSession(request.headers.get("Cookie"));

  await msalInstance.acquireTokenSilent(microRequest).then(async tokenResponse => {
    session.set("accessToken", tokenResponse.accessToken);
    var headers = new Headers();
    var bearer = "Bearer " + tokenResponse.accessToken;
    headers.append("Authorization", bearer);
    var options = {
      method: "GET",
      headers: headers
    };
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me";

    fetch(graphEndpoint, options)
      .then(async resp => {
        const userData = await resp.json();
        //do something with response
        const email = userData.email
        const name = userData.name
        session.set("name", name);
        session.set("email", email);
        console.log(resp, email, name, '_auth.microsoft')

        let user = await GetUser(email)
        if (user) {
          await prisma.user.update({ where: { email: email }, data: { refreshToken: tokenResponse.accessToken } })
        }
        if (!user) {
          const password = 'doesntMatterWeHaveOauth12321223123'
          const hashedPassword = await bcrypt.hash(password, 10);
          const defaultUserRole = await prisma.userRole.findFirst({
            where: { symbol: "NORMAL" },
          });
          user = await prisma.user.create({
            data: {
              name: email.split('@')[0],
              username: email?.split('@')[0],
              email: email,
              // password: { create: { hash: hashedPassword } },
              role: { connect: { id: defaultUserRole?.id } },
              profile: {
                create: {
                  headline: "I am new here",
                  bio: "This is my profile bio.",
                },
              },

            }
          })
          await prisma.dealerFees.create({
            data: {
              dealer: 'Auto Sales',
              dealerAddress: '1234 sales st',
              dealerProv: 'ON',
              dealerPhone: '+14164164167',
              omvicNumber: '123456',
              userLoanProt: 0,
              userTireandRim: '0',
              userGap: 0,
              userExtWarr: '0',
              userServicespkg: 0,
              vinE: 0,
              lifeDisability: 0,
              rustProofing: 0,
              userLicensing: 55,
              userFinance: '0',
              userDemo: '0',
              userGasOnDel: '0',
              userOMVIC: '12.5',
              userOther: 0,
              userTax: '13',
              userAirTax: '0',
              userTireTax: '10.86',
              userGovern: '0',
              userPDI: '0',
              userLabour: '128',
              userMarketAdj: '0',
              userCommodity: '0',
              destinationCharge: 0,
              userFreight: '0',
              userAdmin: '699',
              userEmail: email,
            }
          })
          const clientfile = await prisma.clientfile.create({
            data: {
              email: 'skylerzanth@gmail.com',
              firstName: 'Skyler',
              lastName: 'zanth',
              phone: '+16138980991',
              name: 'skyler zanth',
              address: '1234 st',
              city: 'Otawa',
              postal: 'k1j23V2',
              province: 'ON',
              dl: 'HS02QI3J0DF',
              userId: user.email
            }
          })
          const finance = await prisma.finance.create({
            data: {
              ///  id: 'clrkwvcwo00013aljooz2z4g8',
              clientfileId: clientfile.id,
              // dashboardId: 'clrkwvd0h00023aljgsywagtb',
              // financeId: 'clrkwvcwo00013aljooz2z4g8',
              financeManager: null,
              email: 'skylerzanth@gmail.com',
              firstName: 'skyler',
              lastName: 'zanth',
              phone: '+16138980991',
              name: 'skyler zanth',
              address: '1234 st',
              city: 'Otawa',
              postal: 'k1j23V2',
              province: 'ON',
              dl: 'HS02QI3J0DF',
              typeOfContact: 'phone',
              timeToContact: 'Morning',
              iRate: '10.99',
              months: '60',
              discount: '0',
              total: null,
              onTax: null,
              on60: null,
              biweekly: null,
              weekly: null,
              weeklyOth: null,
              biweekOth: null,
              oth60: null,
              weeklyqc: null,
              biweeklyqc: null,
              qc60: null,
              deposit: '0',
              biweeklNatWOptions: null,
              weeklylNatWOptions: null,
              nat60WOptions: null,
              weeklyOthWOptions: null,
              biweekOthWOptions: null,
              oth60WOptions: null,
              biweeklNat: null,
              weeklylNat: null,
              nat60: null,
              qcTax: null,
              otherTax: null,
              totalWithOptions: null,
              otherTaxWithOptions: null,
              desiredPayments: null,
              freight: null,
              admin: null,
              commodity: null,
              pdi: null,
              discountPer: null,
              userLoanProt: null,
              userTireandRim: null,
              userGap: null,
              userExtWarr: null,
              userServicespkg: null,
              deliveryCharge: null,
              vinE: null,
              lifeDisability: null,
              rustProofing: null,
              userOther: null,
              paintPrem: null,
              licensing: null,
              stockNum: null,
              options: null,
              accessories: null,
              labour: null,
              year: null,
              brand: 'Harley-Davidson',
              model: 'Low Rider S - Color - FXLRS',
              model1: null,
              color: null,
              modelCode: null,
              msrp: null,
              userEmail: 'skylerzanth@gmail.com',
              tradeValue: '0',
              tradeDesc: null,
              tradeColor: null,
              tradeYear: null,
              tradeMake: null,
              tradeVin: null,
              tradeTrim: null,
              tradeMileage: null,
              trim: null,
              vin: null,
              leadNote: null,

            }
          })
          const dashboard = await prisma.dashboard.create({
            data: {
              financeId: finance.id,
              //    financeManager: 'skylerzanth@gmail.com',
              email: 'skylerzanth@gmail.com',
              firstName: 'skyler',
              lastName: 'zanth',
              phone: '6136134',
              name: 'skyler zanth',
              address: '1234 st',
              city: 'Otawa',
              postal: 'k1j23V2',
              province: 'ON',
              dl: 'HS02QI3J0DF',
              typeOfContact: 'phone',
              timeToContact: 'Morning',
              iRate: '10.99',
              months: '60',
              discount: '0',
              total: null,
              onTax: null,
              on60: null,
              biweekly: null,
              weekly: null,
              weeklyOth: null,
              biweekOth: null,
              oth60: null,
              weeklyqc: null,
              biweeklyqc: null,
              qc60: null,
              deposit: '0',
              biweeklNatWOptions: null,
              weeklylNatWOptions: null,
              nat60WOptions: null,
              weeklyOthWOptions: null,
              biweekOthWOptions: null,
              oth60WOptions: null,
              biweeklNat: null,
              weeklylNat: null,
              nat60: null,
              qcTax: null,
              otherTax: null,
              totalWithOptions: null,
              otherTaxWithOptions: null,
              desiredPayments: null,
              freight: null,
              admin: null,
              commodity: null,
              pdi: null,
              discountPer: null,
              userLoanProt: null,
              userTireandRim: null,
              userGap: null,
              userExtWarr: null,
              userServicespkg: null,
              deliveryCharge: null,
              vinE: null,
              lifeDisability: null,
              rustProofing: null,
              userOther: null,
              paintPrem: null,
              licensing: null,
              stockNum: null,
              options: null,
              accessories: null,
              labour: null,
              year: null,
              brand: 'Harley-Davidson',
              model: 'Low Rider S - Color - FXLRS',
              model1: null,
              color: null,
              modelCode: null,
              msrp: null,
              userEmail: 'skylerzanth@gmail.com',
              tradeValue: '0',
              tradeDesc: null,
              tradeColor: null,
              tradeYear: null,
              tradeMake: null,
              tradeVin: null,
              tradeTrim: null,
              tradeMileage: null,
              trim: null,
              vin: null,
              leadNote: null,

            }
          })

          const finance2 = await prisma.finance.update({
            where: {
              id: finance.id
            },
            data: {
              // clientfileId: client.id,
              dashboardId: dashboard.id,
              financeId: finance.id,
              financeManager: 'skylerzanth@gmail.com',
              userEmail: user.email,
            }
          })
          const aptsData = [
            {
              title: 'Welcome new user! NEW LEAD',
              content: 'Welcome new user! NEW LEAD',
              read: 'false',
              dimiss: '',
              type: 'New Lead',
              financeId: finance.id,
              clientfileId: clientfile.id,
              to: '',
              from: '',
              userId: user?.id,
            },
            {
              title: 'Welcome new user! MESSAGES',
              content: 'Welcome new user! MESSAGES',
              read: 'false',
              dimiss: '',
              type: 'messages',
              financeId: finance.id,
              clientfileId: clientfile.id,
              to: '',
              from: '',
              userId: user?.id,
            },
            {
              title: 'Welcome new user! UPDATES',
              content: 'Welcome new user! UPDATES',
              read: 'false',
              dimiss: '',
              type: 'updates',
              financeId: finance.id,
              clientfileId: clientfile.id,
              to: '',
              from: '',
              userId: user?.id,
            },
            {
              title: 'Welcome new user! EMAIL',
              content: 'Welcome new user! EMAIL',
              read: 'false',
              dimiss: '',
              type: 'email',
              financeId: finance.id,
              clientfileId: clientfile.id,
              to: '',
              from: '',
              userId: user?.id,
            },

          ];
          for (const clientApts of aptsData) {
            const {
              financeId,
              contactMethod,
              apptDay,
              apptTime,
              appointment,
              completed,
              apptStatus,
              apptType,
              notes,
              userId,
            } = clientApts;

            await prisma.clientApts.create({
              data: {
                financeId,
                contactMethod,
                apptDay,
                apptTime,
                appointment,
                completed,
                apptStatus,
                apptType,
                notes,
                userId,
              },
            });
          }
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


      }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenPopup(microRequest);
        }

        // handle other errors
      })
    return redirect('/checksubscription', {
      headers: {
        "Set-Cookie":
          await commitSession(session) //&&
        // await cookies

      },
    });
  })
  // return authenticator.authenticate("microsoft", request);
};
*/
