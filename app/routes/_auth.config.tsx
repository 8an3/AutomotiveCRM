const config = {
  appId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
  //  clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
  redirectUri: "http://localhost:3000/microsoft/callback",
  //  authorizationUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  // tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token?`,
  //  userInfoUrl: "https://graph.microsoft.com/oidc/userinfo",
  scopes: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
  ],
  //  prompt: "login",
  // resource: "https://graph.microsoft.com",
  //  authority: "https://login.microsoftonline.com",
};
export default config
