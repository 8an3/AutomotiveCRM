

import { type LoaderFunction, redirect, } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";
import { ExchangeCodeForToken, FetchUserProfile } from "./_auth.auth";

export async function loader({ request, params, req }: LoaderFunction) {
  const queryParams23 = new URL(request.url).searchParams;
  const code23 = queryParams23.get('code')
  const url = new URL(request.url);

  const getToken = await ExchangeCodeForToken(code23)
  let session = await getSession(request.headers.get("Cookie"));

  const accessToken = getToken.access_token
  const refresh_token = getToken.refresh_token
  const idToken = getToken.id_token
  const expires_in = getToken.expires_in

  const userProfile = await FetchUserProfile(accessToken)
  const email = userProfile.email || ''
  const name = userProfile.name
  session.set("accessToken", accessToken);
  session.set("email", email);
  let user = await GetUser(email)
  console.log(getToken, 'getToken', userProfile, 'userProfile')

  if (user) {
    await prisma.user.update({ where: { email: email }, data: { expires_in: String(expires_in), idToken: idToken, refreshToken: refresh_token } })
  }

  if (!user) {
    const defaultUserRole = await prisma.userRole.findFirst({ where: { symbol: "NORMAL" } });

    user = await prisma.user.create({
      data: {
        name: name,
        username: email,
        email: email,
        expires_in: expires_in,
        idToken: idToken,
        refreshToken: refresh_token,
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
    await prisma.userIntergration.create({
      data: {
        userEmail: email,
        activixActivated: "no",

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

    await prisma.finance.update({
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

  const remember = true;
  const userId = await prisma.user.findUnique({ where: { email: email }, })
  session.set("userid", userId?.id);
  await commitSession(session);
  return redirect('/checksubscription', {
    headers: {
      "Set-Cookie":
        await commitSession(session)
    },
  });
}
// console.log(name, 'name', email, 'email', tokens.access_token, tokens.refresh_token)


/*  let cookie = createCookie("session_66", {
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
*/
/**.
 *
 * // Line breaks for legibility only



import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json, createCookie } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis'
import * as querystring from 'querystring';
import { prisma } from "~/libs";
import bcrypt from "bcryptjs";
import { GetUser } from "~/utils/loader.server";


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
  console.log('tokens', tokens)
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
  let user = await GetUser(email)



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


  /*  let cookie = createCookie("session_66", {
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


export default async function GetProfile() {
  console.log('callback default')

  const { session, headers, accessToken, user } = useLoaderData()
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedProfile = window.localStorage.getItem("profile");
    setProfile(storedProfile); // Update the state with the retrieved profile
  }, []); // Empty dependency array ensures useEffect runs once on component mount
  console.log(profile, user, 'user end')


  const displayName = user?.name
  const givenName = user?.firstName
  const familyName = user?.lastName

  const email = user?.emails[0].value
  console.log('tokens', accessToken, 'tokens',)
  session.set("name", givenName);
  session.set("email", email);
  const authUser = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      refreshToken: true,
      profile: true,
      role: { select: { symbol: true, name: true } },
    },
  });

  if (authUser) {
    await prisma.user.update({ where: { email: email }, data: { refreshToken: accessToken } })
  }

  if (!authUser) {
    console.log('user not found')

    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: "NORMAL" },
    });

    await prisma.user.create({
      data: {
        name: profile.displayName,
        username: profile.name.givenName,
        email: email,
        role: { connect: { id: defaultUserRole?.id } },
        profile: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },

      }
    })
    let dealerFees = await prisma.dealerFees.findFirst({
      where: { userEmail: email },
    });
    if (!dealerFees) {
      dealerFees = await prisma.dealerFees.create({
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
    }
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
        userId: authUser.email
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

    await prisma.finance.update({
      where: {
        id: finance.id
      },
      data: {
        // clientfileId: client.id,
        dashboardId: dashboard.id,
        financeId: finance.id,
        financeManager: 'skylerzanth@gmail.com',
        userEmail: authUser.email,
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
        userId: authUser?.id,
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
        userId: authUser?.id,
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
        userId: authUser?.id,
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
        userId: authUser?.id,
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
  const userId = await prisma.user.findUnique({ where: { email: email }, })
  session.set("userid", userId?.id);
  await commitSession(session);

  return redirect('/checksubscription', {
    headers: {
      "Set-Cookie":
        await commitSession(session)

    },
  });
}
/**.
 *
 * // Line breaks for legibility only



import { type LoaderFunction, type DataFunctionArgs, type LoaderArgs, redirect, createCookieSessionStorage, json, createCookie } from "@remix-run/node"
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { google } from 'googleapis'
import * as querystring from 'querystring';
import { prisma } from "~/libs";
import bcrypt from "bcryptjs";
import { GetUser } from "~/utils/loader.server";


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
  console.log('tokens', tokens)
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
  let user = await GetUser(email)



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


  /*  let cookie = createCookie("session_66", {
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
 */
