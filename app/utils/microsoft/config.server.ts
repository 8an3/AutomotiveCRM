import { PublicClientApplication } from "@azure/msal-browser";

export default async function MSALInstance() {

  const msalConfig = {
    auth: {
      clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
      authority: `https://login.microsoftonline.com/fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6`,
      redirectUri: 'http://localhost:3000/callback',
      scopes: [
        "User.ReadWrite",
        "mailboxsettings.read",
        "calendars.readwrite",
        "mail.readwrite",
        "Mail.Send",
        "Notes.ReadWrite.All",
      ],
    }
    //  redirectUri: 'https://email-client-kohl.vercel.app',
  };

  const msalInstance = new PublicClientApplication(msalConfig);
  return await msalInstance.initialize();
}
/** Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const config = {
  appId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
  // redirectUri: 'http://localhost:3000',
   redirectUri: 'https://email-client-kohl.vercel.app',
  scopes: [
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
  ],
};

export default config;
  */
