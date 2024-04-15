import { Configuration, PopupRequest } from "@azure/msal-browser";

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
export default config;

const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";
// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri:  "http://localhost:3000/microsoft/callback",
        postLogoutRedirectUri: "/"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
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
    ]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
