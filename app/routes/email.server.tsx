import { google } from 'googleapis';
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { model } from "~/models";
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';
import type { oauth2_v2 } from 'googleapis';
import { DataFunctionArgs, json, redirect, type LoaderFunction, createCookie } from '@remix-run/node';
import { RefreshToken } from "~/services/google-auth.server";
import axios from 'axios';
import { getMergedFinanceOnFinance, getMergedFinanceOnFinanceUniqueFInanceId } from "~/utils/client/getLatestFinance.server";
import { Body, Container, Head, Row, Column, Heading, Hr, Img, Html, Preview, Tailwind, Link, Text, Section, } from "@react-email/components";
import { getLatestFinance, getLatestFinance2, getLatestFinanceManitou, getDataKawasaki, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou } from "~/utils/finance/get.server";
import Payments from "./emails/custom/payments";
import Options from "./emails/custom/options";
import WPdf from "./emails/custom/paymentswPdf";
import OptionsWBreakdown from "./emails/custom/OptionsWBreakdown";
import OptionsWSpec from "./emails/custom/OptionsWPDF";
import TempPayments from "./emails/custom/tempPayments";
import TempPaymentsBreakdown from "./emails/custom/tempPaymentsBreakdown";
import TempPaymentsBreakdownPDF from "./emails/custom/tempPaymentsBreakdownPDF";
import TempOptions from "./emails/custom/tempOptions";
import TempOptionsWPDF from "./emails/custom/tempOptionsWPDF";
import TempOptionsWBreakdown from "./emails/custom/tempOptionsWBreakdown";
import FullCustom from "./emails/custom/fullCustom";
import { getDealerFeesbyEmail } from "~/utils/user.server";

const oauth2Client = new google.auth.OAuth2(
  "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
  "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",
  process.env.GOOGLE_PROD_CALLBACK_URL
  // "http://localhost:3000/google/callback"
);
export default oauth2Client;

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});
const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'

const getAccessToken = async (refreshToken) => {
  try {
    const accessTokenObj = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        refresh_token: refreshToken,
        client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
        client_secret: "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",
        grant_type: 'refresh_token'
      }
    );

    return accessTokenObj.data.access_token;
  } catch (err) {
    console.log(err);
  }
};

export function Unauthorized(refreshToken) {
  console.log('Unauthorized');
  const newAccessToken = getAccessToken(refreshToken)

  console.log(newAccessToken, 'newAccessToken', refreshToken, 'refreshToken')

  oauth2Client.setCredentials({
    //  refresh_token: refreshToken,
    access_token: newAccessToken,
  });
  google.options({ auth: oauth2Client });
  //  const userRes = await gmail.users.getProfile({ userId: 'me' });
  //console.log(userRes, 'userRes')

  const tokens = newAccessToken
  return tokens
}

export async function TokenRegen(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'
  let tokens = session.get("accessToken")
  // new
  const refreshToken = session.get("refreshToken")
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
  // new
  if (userRes.status === 401) {
    const unauthorizedAccess = await Unauthorized(refreshToken)
    tokens = unauthorizedAccess

    session.set("accessToken", tokens);
    await commitSession(session);

    const cookies = cookie.serialize({
      email: email,
      refreshToken: refreshToken,
      accessToken: tokens,
    })
    await cookies

  } else {
    console.log('Authorized')
  }
  const googleTokens = {
    tokens,
    refreshToken
  }
  return googleTokens
}
export async function SendEmail(user, to, subject, text, tokens) {
  console.log(to, subject, text, tokens, 'inside sendmail')
  const API_KEY = 'AIzaSyCsE7VwbVNO4Yw6PxvAfx8YPuKSpY9mFGo'
  const USER_ID = user.email;
  const ACCESS_TOKEN = tokens;
  const TO_ADDRESS = to;
  const EMAIL_CONTENT = `From: ${USER_ID}\r\n` +
    `To: ${TO_ADDRESS}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +  // Change content type to text/html
    `${text}`;

  const BASE64_ENCODED_CONTENT = btoa(unescape(encodeURIComponent(EMAIL_CONTENT)));
  const url = `https://gmail.googleapis.com/gmail/v1/users/${USER_ID}/messages/send?key=${API_KEY}`;
  try {
    const response = await axios.post(url, { raw: BASE64_ENCODED_CONTENT }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) { console.error('Error sending email:', error); throw error; }
}
export async function GetUserEmails() {
  const res = await gmail.users.messages.list({ userId: 'me' });
  console.log(res.data);
  return res;
}
export async function SetToUnread(messageId: string) {
  const modifyRequest = {
    userId: 'me',
    id: messageId,
    resource: {
      addLabelIds: ['UNREAD'],
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function MoveEmail(message, label: string) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
    resource: {
      addLabelIds: label,
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function MoveToInbox(message) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
    resource: {
      addLabelIds: ['INBOX'],
    },
  };
  const res = await gmail.users.messages.modify(modifyRequest);
  console.log(res.data);
  return res;
}
export async function SetToTrash2(message) {
  const modifyRequest = {
    userId: 'me',
    id: message.id,
  };
  const res = await gmail.users.messages.trash(modifyRequest);
  console.log(res.data);
  return res;
}
export async function SaveDraft(user, text) {
  try {
    const Draft = await axios.post(`https://gmail.googleapis.com/gmail/v1/users/${user.id}/drafts?key=${API_KEY}`, {
      "message": {
        "raw": btoa(text),

      }
    }
    );
    console.log(Draft)
    return Draft
  } catch (err) {
    console.log(err);
  }
}

export async function SetToRead(email, user, tokens) {
  const id = email.id
  console.log(id)
  const modifyId = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${user.email}/messages/${id}/modify?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + tokens,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: "UNREAD"
    })
  });
  return json({ modifyId })
}
export async function GetLabel(label: string) {
  console.log(label, 'label')
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [label]
    });
    console.log(res.data);
    return res;
  } catch (error) {
    console.error('Error listing messages:', error);
  }
}

/**export async function SendEmail(user, to, subjectLine, body) {
  const subject = subjectLine;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${user.firstName} ${user.lastName} <${user.email}>`,
    `To: <${to}>`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ` Subject: ${subjectLine}`,
    '',
    `${body}`,
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
  console.log(res.data);
  return res.data;
}
 */
export async function GetEmailDetails(oauth2Client: any, emailId: string) {
  const messages = await gmail.users.messages.get({
    userId: 'me',
    id: emailId,
    format: 'full',
    key: API_KEY,
  });
  return json({ messages })
}

// do not work
export async function GetEmailsFromFolder2(oauth2Client: any, label: string) {
  console.log(label, 'label')
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [label]
    });
    console.log(res.data);
    return res;
  } catch (error) {
    console.error('Error listing messages:', error);
  }
}
export async function GetEmailsFromFolder(oauth2Client: any, label: string) {
  let fetchedEmails;

  console.log(label, 'label')
  try {
    async function getNewListData(label) {
      const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: [label],
        maxResults: 8,
        key: API_KEY,
      });
      return json({ response })
    }

    async function GetEmailDetails(emailId) {
      const messages = await gmail.users.messages.get({
        userId: 'me',
        id: emailId,
        format: 'full',
        key: API_KEY,
      });
      return json({ messages })
    }
    const newListData = await getNewListData;
    fetchedEmails = await Promise.all(newListData.messages.map(async (email) => {
      const emailDetails = await GetEmailDetails(email.id);
      const senderName = emailDetails.payload.headers.find(header => header.name === 'From').value;
      const nameMatch = senderName.match(/"([^"]+)"/);
      const nameWithoutQuotes = nameMatch ? nameMatch[1] : senderName;
      const emailWithoutQuotes = senderName.match(/<([^>]+)>/);
      const emailValue = emailWithoutQuotes ? emailWithoutQuotes[1] : '';
      const emailHeaderValue = emailDetails.payload.headers[1].value;
      const dateRegex = /\b(\d{1,2} [a-zA-Z]+ \d{4} \d{2}:\d{2}:\d{2} [-+]\d{4})\b/;
      const match = emailHeaderValue.match(dateRegex);
      const extractedName = nameWithoutQuotes.replace(/<[^>]+>/, '').trim();

      function getBodyData(emailDetails) {
        if (emailDetails.payload.parts) {
          const bodyData1 = emailDetails.payload.parts[1]?.body?.data;
          if (bodyData1) {
            return bodyData1;
          }
          const bodyData0 = emailDetails.payload.parts[0]?.body?.data;
          if (bodyData0) {
            return bodyData0;
          }
        }
        return emailDetails.payload.body?.data || '';
      }

      const bodyData = getBodyData(emailDetails);
      const body = atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))

      return {
        id: emailDetails.id,
        name: extractedName,
        secondName: senderName,
        subject: emailDetails.payload.headers.find(header => header.name === 'Subject').value,
        date: match[1],
        labels: emailDetails.labelIds,
        email: emailValue.trim(),
        snippet: emailDetails.snippet,
        body: body,
      };
    }));

    //console.log(fetchedEmails)
    setEmails(fetchedEmails)
    return fetchedEmails;


  } catch (error) {
    console.error('Error listing messages:', error);
  }
}

export async function SendPayments(tokens, user) {
  const email = user.email
  console.log(tokens, user, 'wquiote loadert')
  if (!user) { redirect('/login') }
  console.log('email action')
  let finance = await getMergedFinanceOnFinance(email)
  const deFees = await getDealerFeesbyEmail(email)
  const brand = finance?.brand || '';
  console.log('iinside email')
  const clientData = {
    // clientFname: "Bob",

    //clientTitle: finance.clientTitle,
    clientFname: finance.firstName,
    clientLname: finance.lastName,
    clientFullName: finance.firstName + ' ' + finance.lastName,
    clientPhone: finance.phone,
    clientEmail: finance.email,
    //clientCompanyName: finance.clientCompanyName,
    clientCell: finance.phone,
    clientAddress: finance.address,
    clientCity: finance.city,
    clientProvince: finance.province,
    clientPostalCode: finance.postal,
    //  clientCountry: finance.country,
    year: finance.year,
    brand: finance.brand,
    model: finance.model,
    trim: finance.trim,
    stockNumber: finance.stockNum,
    vin: finance.vin,
    color: finance.color,
    // balance: finance.balance,
    tradeYear: finance.tradeYear,
    tradeMake: finance.tradeMake,
    tradeDesc: finance.tradeDesc,
    tradeTrim: finance.tradeTrim,
    tradeVin: finance.tradeVin,
    tradeColor: finance.tradeColor,
    tradeValue: finance.tradeValue,
    tradeMileage: finance.tradeMileage,
    firstName: user?.name.split(' ')[0],
    userFullName: user?.name,
    userPhone: user?.phone,
    userEmail: finance.userEmail,
    userCell: user?.phone,
    /*fAndIInstitution: finance.fAndIInstitution,
    fAndIFullName: finance.fAndIFullName,
    fAndIEmail: finance.fAndIEmail,
    fAndIFullName: finance.fAndIFullName,
    fAndIPhone: finance.fAndIPhone,
    fAndICell: finance.fAndICell,
    */
  }
  let modelData = ''
  if (brand === 'Kawasaki') {
    modelData = await getDataKawasaki(finance);
  }
  const financeModel = finance?.model || '';
  const userLabour = deFees?.userLabour || '';
  const userOMVIC = deFees?.userOMVIC || '';
  const userLicensing = deFees?.userLicensing || '';
  const userExtWarr = deFees?.userExtWarr || '';
  const userServicespkg = deFees?.userServicespkg || '';
  const vinE = deFees?.vinE || '';
  const rustProofing = deFees?.rustProofing || '';
  const userGap = deFees?.userGap || '';
  const userLoanProt = deFees?.userLoanProt || '';
  const userTireandRim = deFees?.userTireandRim || '';
  const userOther = deFees?.userOther || '';
  const dealer = deFees?.dealer || '';
  const pdi = deFees?.userPDI || '';
  const userAirTax = deFees?.userAirTax || '';
  const userDemo = deFees?.userDemo || '';
  const userMarketAdj = deFees?.userMarketAdj || '';
  const userGasOnDel = deFees?.userGasOnDel || '';
  const destinationCharge = deFees?.destinationCharge || '';
  const userFinance = deFees?.userFinance || '';
  const userGovern = deFees?.userGovern || '';
  const userTireTax = deFees?.userTireTax || '';
  const admin = deFees?.userAdmin || '';
  const commodity = deFees?.userCommodity || '';
  const discount = finance?.discount || '';
  const discountPer = finance?.discountPer || '';
  const painPrem = finance?.paintPrem || '';
  const onTax = finance?.onTax || '';
  const total = finance?.total || '';
  const months = finance?.months || '';
  const stockNum = finance?.stockNum || '';
  const year = finance?.year || '';
  const deposit = finance?.deposit || '';
  const licensing = finance?.licensing || '';
  const labour = finance?.labour || '';
  const accessories = finance?.accessories || '';
  const msrp = finance?.msrp || '';
  const tradeValue = finance?.tradeValue || '';
  const modelCode = finance?.modelCode || '';
  const customerName = finance?.name || '';
  const custEmail = finance?.email || '';
  const qcTax = finance?.qcTax || '';
  const weeklyqc = finance?.weeklyqc || '';
  const biweeklyqc = finance?.biweeklyqc || '';
  const qc60 = finance?.qc60 || '';
  const weeklyOth = finance?.weeklyOth || '';
  const biweekOth = finance?.biweekOth || '';
  const oth60 = finance?.oth60 || '';
  const biweeklNat = finance?.biweeklNat || '';
  const weeklylNat = finance?.weeklylNat || '';
  const nat60 = finance?.nat60 || '';
  const userEmail = user?.email || '';
  const userPhone = user?.phone || '';
  const userFname = user?.name || '';
  const totalWithOptions = finance?.totalWithOptions || '';
  const otherTaxWithOptions = finance?.otherTaxWithOptions || '';
  const otherTax = finance?.otherTax || '';
  const weeklyOthWOptions = finance?.weeklyOthWOptions || '';
  const biweekOthWOptions = finance?.biweekOthWOptions || '';
  const oth60WOptions = finance?.oth60WOptions || '';
  const biweeklNatWOptions = finance?.biweeklNatWOptions || '';
  const nat60WOptions = finance?.nat60WOptions || '';
  const weeklylNatWOptions = finance?.weeklylNatWOptions || '';
  const model2 = finance?.model || '';
  const subject = `Payments for ${finance.model}`
  const to = finance.email || '';
  const preview = `Payments for ${finance.model}`
  let body = ''
  let topPart = ''
  let weekly = ''
  let biweekly = ''
  let monthly = ''
  let payments = ''
  let display = ''
  switch (payments) {
    case 'ontario':
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
      break;
    case 'ontarioWOptions':
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
      break;
    case 'native':
      weekly = finance?.weeklyqc || '';
      biweekly = finance?.biweeklyqc || '';
      monthly = finance?.qc60 || '';
      break;
    case 'nativeWOptions':
      weekly = finance?.weeklylNatWOptions || '';
      biweekly = finance?.biweeklNatWOptions || '';
      monthly = finance?.nat60WOptions || '';
      break;
    case 'other':
      weekly = finance?.weeklyOth || '';
      biweekly = finance?.biweekOth || '';
      monthly = finance?.oth60 || '';
      break;
    case 'otherWOptions':
      weekly = finance?.weeklyOthWOptions || '';
      biweekly = finance?.biweekOthWOptions || '';
      monthly = finance?.oth60WOptions || '';
      break;
    default:
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
  }

  console.log(to, subject, tokens, 'inside sendmail');
  const USER_ID = user.email;
  const ACCESS_TOKEN = tokens;
  const TO_ADDRESS = to;
  const EMAIL_CONTENT = `From: ${USER_ID}\r\n` +
    `To: ${TO_ADDRESS}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +  // Change content type to text/html
    `<html>
      <head>
        <style>
          /* Inline CSS styles */
          .container {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px 0 48px;
            margin-bottom: 64px;
          }
          .paragraph {
            font-size: 16px;
            line-height: 24px;
            text-align: left;
          }
          .hr {
            border-color: #e6ebf1;
            margin: 20px 0;
          }
          .main {
            background-color: #f6f9fc;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
          }
          .box {
            padding: 0 48px;
          }
        </style>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
        <div class="container" style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px;">
          <div class="box" style="padding: 0 48px;">
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              Hey ${customerName},
            </p>

            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              I hope this message finds you well. I wanted to express my appreciation for the opportunity to meet with you and discuss your upcoming purchase of the ${model2}. It was a pleasure learning about your preferences and requirements.
              As promised, I have attached the pricing details for the ${model2} to this email. Please review the payments below --
              </p>
            <p class="paragraph" style="font-size: 24px; text-align: left; font-weight: thin;">
              Payments
            </p>
            <hr class="hr" style="border-color: #e6ebf1; margin: 20px 0;">
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              With ${deposit} down, over ${months} months, your payments are:
            </p>
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
            ${weekly} / Weekly
          </p>
          <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
          ${biweekly} / Bi-weekly
        </p>
        <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
        ${monthly} / Monthly
      </p>
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              Thank you for considering us for your needs. Your satisfaction is our top priority, and I look forward to assisting you further. I value your interest in our products, and I'm here to assist you every step of the way. If you decide to move forward with your purchase, call me right away. Otherwise, I will follow up with you in a couple of days to ensure a smooth and timely process. You can reach me via email at ${userEmail} or directly on my cell phone at ${userPhone} for any inquiries or to secure your purchase.
            </p>
          </div>
        </div>
      </body>
    </html>`;

  const BASE64_ENCODED_CONTENT = btoa(unescape(encodeURIComponent(EMAIL_CONTENT)));
  const url = `https://gmail.googleapis.com/gmail/v1/users/${USER_ID}/messages/send?key=${API_KEY}`;
  try {
    const response = await axios.post(url, { raw: BASE64_ENCODED_CONTENT }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) { console.error('Error sending email:', error); throw error; }
  return null
}

export async function FullBreakdown(tokens, user) {
  const email = user.email
  console.log(tokens, user, 'wquiote loadert')
  if (!user) { redirect('/login') }
  console.log('email action')
  let finance = await getMergedFinanceOnFinance(email)
  const deFees = await getDealerFeesbyEmail(email)
  const brand = finance?.brand || '';
  console.log('iinside email')
  const clientData = {
    // clientFname: "Bob",

    //clientTitle: finance.clientTitle,
    clientFname: finance.firstName,
    clientLname: finance.lastName,
    clientFullName: finance.firstName + ' ' + finance.lastName,
    clientPhone: finance.phone,
    clientEmail: finance.email,
    //clientCompanyName: finance.clientCompanyName,
    clientCell: finance.phone,
    clientAddress: finance.address,
    clientCity: finance.city,
    clientProvince: finance.province,
    clientPostalCode: finance.postal,
    //  clientCountry: finance.country,
    year: finance.year,
    brand: finance.brand,
    model: finance.model,
    trim: finance.trim,
    stockNumber: finance.stockNum,
    vin: finance.vin,
    color: finance.color,
    // balance: finance.balance,
    tradeYear: finance.tradeYear,
    tradeMake: finance.tradeMake,
    tradeDesc: finance.tradeDesc,
    tradeTrim: finance.tradeTrim,
    tradeVin: finance.tradeVin,
    tradeColor: finance.tradeColor,
    tradeValue: finance.tradeValue,
    tradeMileage: finance.tradeMileage,
    firstName: user?.name.split(' ')[0],
    userFullName: user?.name,
    userPhone: user?.phone,
    userEmail: finance.userEmail,
    userCell: user?.phone,
    /*fAndIInstitution: finance.fAndIInstitution,
    fAndIFullName: finance.fAndIFullName,
    fAndIEmail: finance.fAndIEmail,
    fAndIFullName: finance.fAndIFullName,
    fAndIPhone: finance.fAndIPhone,
    fAndICell: finance.fAndICell,
    */
  }
  let modelData = ''
  if (brand === 'Kawasaki') {
    modelData = await getDataKawasaki(finance);
  }
  const financeModel = finance?.model || '';
  const userLabour = deFees?.userLabour || '';
  const userOMVIC = deFees?.userOMVIC || '';
  const userLicensing = deFees?.userLicensing || '';
  const userExtWarr = deFees?.userExtWarr || '';
  const userServicespkg = deFees?.userServicespkg || '';
  const vinE = deFees?.vinE || '';
  const rustProofing = deFees?.rustProofing || '';
  const userGap = deFees?.userGap || '';
  const userLoanProt = deFees?.userLoanProt || '';
  const userTireandRim = deFees?.userTireandRim || '';
  const userOther = deFees?.userOther || '';
  const dealer = deFees?.dealer || '';
  const pdi = deFees?.userPDI || '';
  const userAirTax = deFees?.userAirTax || '';
  const userDemo = deFees?.userDemo || '';
  const userMarketAdj = deFees?.userMarketAdj || '';
  const userGasOnDel = deFees?.userGasOnDel || '';
  const destinationCharge = deFees?.destinationCharge || '';
  const userFinance = deFees?.userFinance || '';
  const userGovern = deFees?.userGovern || '';
  const userTireTax = deFees?.userTireTax || '';
  const admin = deFees?.userAdmin || '';
  const commodity = deFees?.userCommodity || '';
  const discount = finance?.discount || '';
  const discountPer = finance?.discountPer || '';
  const painPrem = finance?.paintPrem || '';
  const onTax = finance?.onTax || '';
  const total = finance?.total || '';
  const months = finance?.months || '';
  const stockNum = finance?.stockNum || '';
  const year = finance?.year || '';
  const deposit = finance?.deposit || '';
  const licensing = finance?.licensing || '';
  const labour = finance?.labour || '';
  const accessories = finance?.accessories || '';
  const msrp = finance?.msrp || '';
  const tradeValue = finance?.tradeValue || '';
  const modelCode = finance?.modelCode || '';
  const customerName = finance?.name || '';
  const custEmail = finance?.email || '';
  const qcTax = finance?.qcTax || '';
  const weeklyqc = finance?.weeklyqc || '';
  const biweeklyqc = finance?.biweeklyqc || '';
  const qc60 = finance?.qc60 || '';
  const weeklyOth = finance?.weeklyOth || '';
  const biweekOth = finance?.biweekOth || '';
  const oth60 = finance?.oth60 || '';
  const biweeklNat = finance?.biweeklNat || '';
  const weeklylNat = finance?.weeklylNat || '';
  const nat60 = finance?.nat60 || '';
  const userEmail = user?.email || '';
  const userPhone = user?.phone || '';
  const userFname = user?.name || '';
  const totalWithOptions = finance?.totalWithOptions || '';
  const otherTaxWithOptions = finance?.otherTaxWithOptions || '';
  const otherTax = finance?.otherTax || '';
  const weeklyOthWOptions = finance?.weeklyOthWOptions || '';
  const biweekOthWOptions = finance?.biweekOthWOptions || '';
  const oth60WOptions = finance?.oth60WOptions || '';
  const biweeklNatWOptions = finance?.biweeklNatWOptions || '';
  const nat60WOptions = finance?.nat60WOptions || '';
  const weeklylNatWOptions = finance?.weeklylNatWOptions || '';
  const model2 = finance?.model || '';
  const subject = `Payments for ${finance.model}`
  const to = finance.email || '';
  const preview = `Payments for ${finance.model}`
  let body = ''
  let topPart = ''
  let weekly = ''
  let biweekly = ''
  let monthly = ''
  let payments = ''
  let display = ''
  switch (payments) {
    case 'ontario':
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
      break;
    case 'ontarioWOptions':
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
      break;
    case 'native':
      weekly = finance?.weeklyqc || '';
      biweekly = finance?.biweeklyqc || '';
      monthly = finance?.qc60 || '';
      break;
    case 'nativeWOptions':
      weekly = finance?.weeklylNatWOptions || '';
      biweekly = finance?.biweeklNatWOptions || '';
      monthly = finance?.nat60WOptions || '';
      break;
    case 'other':
      weekly = finance?.weeklyOth || '';
      biweekly = finance?.biweekOth || '';
      monthly = finance?.oth60 || '';
      break;
    case 'otherWOptions':
      weekly = finance?.weeklyOthWOptions || '';
      biweekly = finance?.biweekOthWOptions || '';
      monthly = finance?.oth60WOptions || '';
      break;
    default:
      weekly = finance?.weekly || '';
      biweekly = finance?.biweekly || '';
      monthly = finance?.on60 || '';
  }

  console.log(to, subject, tokens, 'inside sendmail');
  const USER_ID = user.email;
  const ACCESS_TOKEN = tokens;
  const TO_ADDRESS = to;
  const EMAIL_CONTENT = `From: ${USER_ID}\r\n` +
    `To: ${TO_ADDRESS}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +  // Change content type to text/html
    `<html>
      <head>
        <style>
          /* Inline CSS styles */
          .container {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px 0 48px;
            margin-bottom: 64px;
          }
          .paragraph {
            font-size: 16px;
            line-height: 24px;
            text-align: left;
          }
          .hr {
            border-color: #e6ebf1;
            margin: 20px 0;
          }
          .main {
            background-color: #f6f9fc;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
          }
          .box {
            padding: 0 48px;
          }
        </style>
      </head>
      <body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;">
        <div class="container" style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px;">
          <div class="box" style="padding: 0 48px;">
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              Hey ${customerName},
            </p>

            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              I hope this message finds you well. I wanted to express my appreciation for the opportunity to meet with you and discuss your upcoming purchase of the ${model2}. It was a pleasure learning about your preferences and requirements.
              As promised, I have attached the pricing details for the ${model2} to this email. Please review the payments below --
              </p>
            <p class="paragraph" style="font-size: 24px; text-align: left; font-weight: thin;">
              Payments
            </p>
            <hr class="hr" style="border-color: #e6ebf1; margin: 20px 0;">
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              With ${deposit} down, over ${months} months, your payments are:
            </p>
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
            ${weekly} / Weekly
          </p>
          <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
          ${biweekly} / Bi-weekly
        </p>
        <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: center;">
        ${monthly} / Monthly
      </p>
            <p class="paragraph" style="font-size: 16px; line-height: 24px; text-align: left;">
              Thank you for considering us for your needs. Your satisfaction is our top priority, and I look forward to assisting you further. I value your interest in our products, and I'm here to assist you every step of the way. If you decide to move forward with your purchase, call me right away. Otherwise, I will follow up with you in a couple of days to ensure a smooth and timely process. You can reach me via email at ${userEmail} or directly on my cell phone at ${userPhone} for any inquiries or to secure your purchase.
            </p>
          </div>
        </div>
      </body>
    </html>`;

  const BASE64_ENCODED_CONTENT = btoa(unescape(encodeURIComponent(EMAIL_CONTENT)));
  const url = `https://gmail.googleapis.com/gmail/v1/users/${USER_ID}/messages/send?key=${API_KEY}`;
  try {
    const response = await axios.post(url, { raw: BASE64_ENCODED_CONTENT }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) { console.error('Error sending email:', error); throw error; }
  return null
}
