// app/services/auth.server.ts
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { getSession, commitSession, destroySession, authSessionStorage, } from "~/sessions/auth-session.server";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type LoaderFunction, json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { model } from "~/models";
//import type { UserSession } from "~/helpers";
// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node
// app/services/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
import { graphConfig } from "~/utils/microsoft/config.server";



export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__ffs_ggs", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3tlkhjlk;mj"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

//export let { getSession, commitSession, destroySession } = sessionStorage;
type UserSession = {
  id: string;
  username: string;
  subscriptionId: string;
  customerId: string;
  returning: boolean | null;
  phone: string;
  dealer: string;
  position: string;
  roleId: string;
  profileId: string;
  omvicNumber: string;
  lastSubscriptionCheck: string;
  refreshToken: string;
  accessToken: string;
  id_token: string;
  email: string;
  user: string;
};
export const authenticator = new Authenticator<UserSession>(authSessionStorage);

const microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
    clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
    redirectUri: "http://localhost:3000/microsoft/callback",
    tenantId: "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6",
    scope: ['openid', 'profile', 'email', 'offline_access'],
    /* scope:
       "email openid profile offline_access calendars.readwrite mail.read mailboxsettings.read notes.readwrite calendars.readWrite.shared  mail.readwrite mail.send  mailboxsettings.readwrite notes.readwrite.all tasks.readwrite.shared user.read user.readbasic.all user.readwrite",
       */
    prompt: "login",
  },
  async ({ accessToken, extraParams, profile, request, done }) => {

    const email = profile.emails[0].value

    // console.log(accessToken, 'accesstoiken', extraParams.id_token, 'idtoken')

    let userProfile = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (!userProfile) {
      const defaultUserRole = await prisma.userRole.findFirst({
        where: { symbol: "NORMAL" },
      });
      userProfile = await prisma.user.create({
        data: {
          name: profile.name.givenName + " " + profile.name.familyName,
          username: profile.displayName,
          email: email,
          role: { connect: { id: defaultUserRole?.id } },
          refreshToken: accessToken,
          profile: {
            create: {
              headline: "I am new here",
              bio: "This is my profile bio.",
            },
          },
        },
      });
      if (!userProfile) throw new Error("Unable to create user.");
    }
    if (userProfile) {
      await prisma.user.update({
        where: {
          email: profile.emails[0].value,
        },
        data: {
          refreshToken: accessToken,
        },
      });
    }
    // session.set("email", email)
    // session.set('idToken', extraParams.id_token)
    // session.set('accessToken', accessToken)
    const user = await prisma.user.findUnique({ where: { email: email } })

    let session = await getSession(request.headers.get("cookie"));
    // and store the user data
    session.set(authenticator.sessionKey, user);
    let headers = new Headers({ "Set-Cookie": await commitSession(session) });
    console.log('3', user)

    if (user) return redirect("/dealer/checksubscription", { headers });

    await commitSession(session)
    console.log('4')
    const id_token = extraParams.id_token
    return done(null, profile, accessToken, id_token)

  }
)

// return userSession //


authenticator.use(microsoftStrategy);


/**  let user;
      const email = profile.emails[0].value
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
        console.log('found user')
        await prisma.user.update({ where: { email: email }, data: { refreshToken: accessToken } })
        await GetProfile(email, profile, accessToken)
        return redirect('/checksubscription')
      } else {
        user = await CreateUser(email, profile)
      }
      return user */

async function GetProfile(email, profile, accessToken) {
  console.log("callback default");
  try {
    let user = profile;
    const displayName = user?.name;
    const givenName = user?.firstName;
    const familyName = user?.lastName;

    console.log("tokens", accessToken, "tokens");
    const authUser = await prisma.user.findUnique({ where: { email: email } });

    if (authUser) {
      try {
        await prisma.user.update({
          where: { email: email },
          data: { refreshToken: accessToken },
        });
        user = await prisma.user.findUnique({ where: { email: email } });
        console.log(user);
        return user;
      } catch (error) {
        // Handle the error appropriately
        console.error("Error creating user:", error);
        throw error; // Rethrow the error if needed
      }
    }

    if (!authUser) {
      try {
        console.log("user not found");

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
          },
        });
        let dealerFees = await prisma.dealer.findFirst({
          where: { userEmail: email },
        });
        if (!dealerFees) {
          dealerFees = await prisma.dealer.create({
            data: {
              dealer: "Auto Sales",
              dealerAddress: "1234 sales st",
              dealerProv: "ON",
              dealerPhone: "+14164164167",
              omvicNumber: "123456",
              userLoanProt: 0,
              userTireandRim: "0",
              userGap: 0,
              userExtWarr: "0",
              userServicespkg: 0,
              vinE: 0,
              lifeDisability: 0,
              rustProofing: 0,
              userLicensing: 55,
              userFinance: "0",
              userDemo: "0",
              userGasOnDel: "0",
              userOMVIC: "12.5",
              userOther: 0,
              userTax: "13",
              userAirTax: "0",
              userTireTax: "10.86",
              userGovern: "0",
              userPDI: "0",
              userLabour: "128",
              userMarketAdj: "0",
              userCommodity: "0",
              destinationCharge: 0,
              userFreight: "0",
              userAdmin: "699",
              userEmail: email,
            },
          });
        }
        const clientfile = await prisma.clientfile.create({
          data: {
            email: "skylerzanth@gmail.com",
            firstName: "Skyler",
            lastName: "zanth",
            phone: "+16138980991",
            name: "skyler zanth",
            address: "1234 st",
            city: "Otawa",
            postal: "k1j23V2",
            province: "ON",
            dl: "HS02QI3J0DF",
            userId: authUser.email,
          },
        });
        const finance = await prisma.finance.create({
          data: {
            ///  id: 'clrkwvcwo00013aljooz2z4g8',
            clientfileId: clientfile.id,
            // dashboardId: 'clrkwvd0h00023aljgsywagtb',
            // financeId: 'clrkwvcwo00013aljooz2z4g8',
            financeManager: null,
            email: "skylerzanth@gmail.com",
            firstName: "skyler",
            lastName: "zanth",
            phone: "+16138980991",
            name: "skyler zanth",
            address: "1234 st",
            city: "Otawa",
            postal: "k1j23V2",
            province: "ON",
            dl: "HS02QI3J0DF",
            typeOfContact: "phone",
            timeToContact: "Morning",
            iRate: "10.99",
            months: "60",
            discount: "0",
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
            deposit: "0",
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
            brand: "Harley-Davidson",
            model: "Low Rider S - Color - FXLRS",
            model1: null,
            color: null,
            modelCode: null,
            msrp: null,
            userEmail: "skylerzanth@gmail.com",
            tradeValue: "0",
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
          },
        });
        const dashboard = await prisma.dashboard.create({
          data: {
            financeId: finance.id,
            //    financeManager: 'skylerzanth@gmail.com',
            email: "skylerzanth@gmail.com",
            firstName: "skyler",
            lastName: "zanth",
            phone: "6136134",
            name: "skyler zanth",
            address: "1234 st",
            city: "Otawa",
            postal: "k1j23V2",
            province: "ON",
            dl: "HS02QI3J0DF",
            typeOfContact: "phone",
            timeToContact: "Morning",
            iRate: "10.99",
            months: "60",
            discount: "0",
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
            deposit: "0",
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
            brand: "Harley-Davidson",
            model: "Low Rider S - Color - FXLRS",
            model1: null,
            color: null,
            modelCode: null,
            msrp: null,
            userEmail: "skylerzanth@gmail.com",
            tradeValue: "0",
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
          },
        });

        await prisma.finance.update({
          where: {
            id: finance.id,
          },
          data: {
            // clientfileId: client.id,
            dashboardId: dashboard.id,
            financeId: finance.id,
            financeManager: "skylerzanth@gmail.com",
            userEmail: authUser.email,
          },
        });
        const aptsData = [
          {
            title: "Welcome new user! NEW LEAD",
            content: "Welcome new user! NEW LEAD",
            read: "false",
            dimiss: "",
            type: "New Lead",
            financeId: finance.id,
            clientfileId: clientfile.id,
            to: "",
            from: "",
            userId: authUser?.id,
          },
          {
            title: "Welcome new user! MESSAGES",
            content: "Welcome new user! MESSAGES",
            read: "false",
            dimiss: "",
            type: "messages",
            financeId: finance.id,
            clientfileId: clientfile.id,
            to: "",
            from: "",
            userId: authUser?.id,
          },
          {
            title: "Welcome new user! UPDATES",
            content: "Welcome new user! UPDATES",
            read: "false",
            dimiss: "",
            type: "updates",
            financeId: finance.id,
            clientfileId: clientfile.id,
            to: "",
            from: "",
            userId: authUser?.id,
          },
          {
            title: "Welcome new user! EMAIL",
            content: "Welcome new user! EMAIL",
            read: "false",
            dimiss: "",
            type: "email",
            financeId: finance.id,
            clientfileId: clientfile.id,
            to: "",
            from: "",
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
        return user;
      } catch (error) {
        // Handle the error appropriately
        console.error("Error creating user:", error);
        throw error; // Rethrow the error if needed
      }
    }

    user = await prisma.user.findUnique({ where: { email: email } });
    console.log(user);
    return user;
  } catch (error) {
    // Handle the error appropriately
    console.error("Error creating user:", error);
    throw error; // Rethrow the error if needed
  }
}

async function CreateUser(email, profile) {
  try {
    console.log("user not found");
    let user;
    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: "NORMAL" },
    });

    user = await prisma.user.create({
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
      },
    });
    let dealerFees = await prisma.dealer.findFirst({
      where: { userEmail: email },
    });
    if (!dealerFees) {
      dealerFees = await prisma.dealer.create({
        data: {
          dealer: "Auto Sales",
          dealerAddress: "1234 sales st",
          dealerProv: "ON",
          dealerPhone: "+14164164167",
          omvicNumber: "123456",
          userLoanProt: 0,
          userTireandRim: "0",
          userGap: 0,
          userExtWarr: "0",
          userServicespkg: 0,
          vinE: 0,
          lifeDisability: 0,
          rustProofing: 0,
          userLicensing: 55,
          userFinance: "0",
          userDemo: "0",
          userGasOnDel: "0",
          userOMVIC: "12.5",
          userOther: 0,
          userTax: "13",
          userAirTax: "0",
          userTireTax: "10.86",
          userGovern: "0",
          userPDI: "0",
          userLabour: "128",
          userMarketAdj: "0",
          userCommodity: "0",
          destinationCharge: 0,
          userFreight: "0",
          userAdmin: "699",
          userEmail: email,
        },
      });
    }
    const clientfile = await prisma.clientfile.create({
      data: {
        email: "skylerzanth@gmail.com",
        firstName: "Skyler",
        lastName: "zanth",
        phone: "+16138980991",
        name: "skyler zanth",
        address: "1234 st",
        city: "Otawa",
        postal: "k1j23V2",
        province: "ON",
        dl: "HS02QI3J0DF",
        userId: user.email,
      },
    });
    const finance = await prisma.finance.create({
      data: {
        ///  id: 'clrkwvcwo00013aljooz2z4g8',
        clientfileId: clientfile.id,
        // dashboardId: 'clrkwvd0h00023aljgsywagtb',
        // financeId: 'clrkwvcwo00013aljooz2z4g8',
        financeManager: null,
        email: "skylerzanth@gmail.com",
        firstName: "skyler",
        lastName: "zanth",
        phone: "+16138980991",
        name: "skyler zanth",
        address: "1234 st",
        city: "Otawa",
        postal: "k1j23V2",
        province: "ON",
        dl: "HS02QI3J0DF",
        typeOfContact: "phone",
        timeToContact: "Morning",
        iRate: "10.99",
        months: "60",
        discount: "0",
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
        deposit: "0",
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
        brand: "Harley-Davidson",
        model: "Low Rider S - Color - FXLRS",
        model1: null,
        color: null,
        modelCode: null,
        msrp: null,
        userEmail: "skylerzanth@gmail.com",
        tradeValue: "0",
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
      },
    });
    const dashboard = await prisma.dashboard.create({
      data: {
        financeId: finance.id,
        //    financeManager: 'skylerzanth@gmail.com',
        email: "skylerzanth@gmail.com",
        firstName: "skyler",
        lastName: "zanth",
        phone: "6136134",
        name: "skyler zanth",
        address: "1234 st",
        city: "Otawa",
        postal: "k1j23V2",
        province: "ON",
        dl: "HS02QI3J0DF",
        typeOfContact: "phone",
        timeToContact: "Morning",
        iRate: "10.99",
        months: "60",
        discount: "0",
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
        deposit: "0",
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
        brand: "Harley-Davidson",
        model: "Low Rider S - Color - FXLRS",
        model1: null,
        color: null,
        modelCode: null,
        msrp: null,
        userEmail: "skylerzanth@gmail.com",
        tradeValue: "0",
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
      },
    });

    await prisma.finance.update({
      where: {
        id: finance.id,
      },
      data: {
        // clientfileId: client.id,
        dashboardId: dashboard.id,
        financeId: finance.id,
        financeManager: "skylerzanth@gmail.com",
        userEmail: user.email,
      },
    });
    const aptsData = [
      {
        title: "Welcome new user! NEW LEAD",
        content: "Welcome new user! NEW LEAD",
        read: "false",
        dimiss: "",
        type: "New Lead",
        financeId: finance.id,
        clientfileId: clientfile.id,
        to: "",
        from: "",
        userId: user?.id,
      },
      {
        title: "Welcome new user! MESSAGES",
        content: "Welcome new user! MESSAGES",
        read: "false",
        dimiss: "",
        type: "messages",
        financeId: finance.id,
        clientfileId: clientfile.id,
        to: "",
        from: "",
        userId: user?.id,
      },
      {
        title: "Welcome new user! UPDATES",
        content: "Welcome new user! UPDATES",
        read: "false",
        dimiss: "",
        type: "updates",
        financeId: finance.id,
        clientfileId: clientfile.id,
        to: "",
        from: "",
        userId: user?.id,
      },
      {
        title: "Welcome new user! EMAIL",
        content: "Welcome new user! EMAIL",
        read: "false",
        dimiss: "",
        type: "email",
        financeId: finance.id,
        clientfileId: clientfile.id,
        to: "",
        from: "",
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
    user = await prisma.user.findUnique({ where: { email: email } });
    console.log(user);
    return user;
  } catch (error) {
    // Handle the error appropriately
    console.error("Error creating user:", error);
    throw error; // Rethrow the error if needed
  }
}

export async function loader({ request, params }: LoaderFunction) {
  const queryParams23 = new URL(request.url).searchParams;
  const token = queryParams23.get("code");
  console.log(token, "user end2");
  let session = (await getSession(request.headers.get("Cookie"))) || "";
  let accessToken = token;

  session.set("accessToken", accessToken);
  const headers = { "Set-Cookie": await commitSession(session) };

  console.log("callback loader2");
  return json({ session, headers, accessToken });
}
/**
import { Authenticator, SessionStrategy, AuthorizationError } from "remix-auth";
import { getSession, commitSession, destroySession, sessionStorage } from '~/sessions/session.server'
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
