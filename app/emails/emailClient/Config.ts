// Copyright (c) Microsoft Corporation.
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
 