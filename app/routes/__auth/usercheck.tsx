import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  type ActionFunction,
  json,
  redirect,
  type LoaderFunction,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { useAppContext } from "~/components/microsoft/AppContext";
import Sidebar from "~/components/shared/sidebar";
import { prisma } from "~/libs";
import {
  authSessionStorage,
  commitSession,
  destroySession,
  getSession,
} from "~/sessions/auth-session.server";
import { CheckSub } from "~/utils/checksub.server";
import { GetUser } from "~/utils/loader.server";
import { updateUser } from "~/utils/user.server";

/**export async function loader({ request, params }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"))
  const email = session.email
  const user = await GetUser(email);
  if (user.email) {
    return redirect('/dealer/welcome/settings')
  } else {
    console.log('no user found')
  }
} */

export async function loader({ request, params }: ActionFunction) {
  let session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const name = session.get("name");
  try {
    let user = await GetUser(email);
    console.log("found user");
    session.set("email", email);
    await CheckSub(user);
    const subscriptionId = user?.subscriptionId;

    if (subscriptionId) {
      console.log(subscriptionId, "checking subscription");
      console.log(user?.returning, "returning");
      if (user?.returning === true) {
        if (subscriptionId === "trialing" || subscriptionId === "active") {
          console.log("subscription valid1");
          return redirect("/dealer/quote/new/Harley-Davidson", {
            headers: { "Set-Cookie": await commitSession(session) },
          });
        } else {
          console.log("subscription not valid2");
          return redirect("/subscribe");
        }
      } else if (user?.returning === false) {
        console.log(subscriptionId, "new user, checking new subscription3");
        if (subscriptionId === "trialing" || subscriptionId === "active") {
          console.log("new subscription valid4");
          await updateUser({ email: user.email, returning: true });
          return redirect("/dealer/user/dashboard/settings", {
            headers: { "Set-Cookie": await commitSession(session) },
          });
        } else {
          console.log("subscription not valid5");
          return redirect("/subscribe");
        }
      }
    } else {
      console.log("subscription not valid6");
      return redirect("/subscribe");
    }
    return <p>failed check</p>;
  } catch (error) {
    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: "NORMAL" },
    });
    const user = await prisma.user.create({
      data: {
        name: name,
        username: email,
        email: email,
        // expires_in: String(expiry),
        // idToken: idToken,
        // refreshToken: refresh_token,
        // password: { create: { hash: hashedPassword } },
        role: { connect: { id: defaultUserRole?.id } },
        profile: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },
      },
    });
    await prisma.dealer.create({
      data: {
        dealerName: "Auto Sales",
        dealerAddress: "1234 sales st",
        dealerProv: "ON",
        dealerPhone: "+14164164167",
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
        userEmail: user.email,
      },
    });
    const clientfile = await prisma.clientfile.create({
      data: {
        email: "skylerzanth@outlook.com",
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
        email: "skylerzanth@outlook.com",
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
        userEmail: user.email,
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
    console.log("create user");
    session.set("email", email);
    session.set("name", name);
    console.log("User data:", user);
    return json({ clientfile, finance }, redirect("/usercheck"))
  }
}
