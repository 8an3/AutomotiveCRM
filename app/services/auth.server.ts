// app/services/auth.server.ts
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { getSession, commitSession, destroySession, authSessionStorage } from '../sessions/auth-session.server'
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";

export let authenticator = new Authenticator<User>(authSessionStorage);

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
    clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
    redirectUri: "http://localhost:3000/microsoft/callback",
    tenantId: 'fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6',
    //scope: ['openid', 'profile', 'email'],
    scope: 'openid email profile Calendars.ReadWrite Mail.Read MailboxSettings.Read Notes.ReadWrite Calendars.ReadWrite.Shared Mail.ReadWrite Mail.Send MailboxSettings.ReadWrite Notes.ReadWrite.All offline_access Tasks.ReadWrite.Shared User.Read User.ReadBasic.All User.ReadWrite',
    prompt: "login",
  },
  async ({ accessToken, extraParams, profile }) => {
    console.log(accessToken, profile.emails[0].value, profile, 'first')
    const email = profile.emails[0].value
    let user = await GetUser(email)
    if (user) {
      console.log('found user')
      await prisma.user.update({ where: { email: email }, data: { refreshToken: accessToken /**cant remember if there is a refresh token */ } })
    }

    if (!user) {
      console.log('user not found')

      const password = 'doesntMatterWeHaveOauth12321223123'
      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultUserRole = await prisma.userRole.findFirst({
        where: { symbol: "NORMAL" },
      });

      user = await prisma.user.create({
        data: {
          name: profile.displayName,
          username: profile.name.givenName,
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
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          phone: '+16138980991',
          name: 'skyler zanth',
          address: '1234 st',
          city: 'Otawa',
          postal: 'k1j23V2',
          province: 'ON',
          dl: 'HS02QI3J0DF',
          userId: email
        }
      })
      const finance = await prisma.finance.create({
        data: {
          ///  id: 'clrkwvcwo00013aljooz2z4g8',
          clientfileId: clientfile.id,
          // dashboardId: 'clrkwvd0h00023aljgsywagtb',
          // financeId: 'clrkwvcwo00013aljooz2z4g8',
          financeManager: null,
          email: email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          phone: '+16138980991',
          name: profile.displayName,
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
          email: email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          phone: '6136134',
          name: profile.displayName,
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
          financeManager: email,
          userEmail: email,
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

    return user
  }
);

authenticator.use(microsoftStrategy);

/**
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
); */



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
