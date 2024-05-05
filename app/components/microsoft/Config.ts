import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
  type Configuration,
  LogLevel,
  type PopupRequest
} from '@azure/msal-browser';

export const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";

export const msalConfig = {
  clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
  clientSecret: "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D",
  redirectUri: "http://localhost:3000/auth/login",
  authorizationUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token?`,
  userInfoUrl: "https://graph.microsoft.com/oidc/userinfo",
  scopes: [
    'User.Read',
    'Mail.ReadWrite',
    'Mail.send',
    'email',
    'openid',
    'profile',
    "Calendars.ReadWrite",
    "Notes.ReadWrite.All",
    "Calendars.ReadWrite.Shared",
    "Contacts.ReadWrite",
    "Contacts.ReadWrite.Shared",
    "Files.ReadWrite.All",
    "Files.ReadWrite.AppFolder",
    "Files.ReadWrite.Selected",
    "Mail.ReadWrite.Shared",
    "Mail.Send.Shared",
    "Mail.Send",
    "Mail.ReadWrite",
    "MailboxSettings.ReadWrite",
    "Notes.Create",
    "Notes.ReadWrite.All",
    "Schedule.ReadWrite.All",
    "Tasks.ReadWrite.Shared",
    "User.Read",
    "User.ReadWrite.All",
    "User.ReadWrite",
  ],
  // scopes: ["openid", "User.ReadWrite", "Mail.ReadWrite", "offline_access"],
  prompt: "login",
  resource: "https://graph.microsoft.com",
  authority: `https://login.microsoftonline.com/${tenantId}`,
}

export const config = {
  auth: {
    clientId: msalConfig.clientId,
    clientSecret: msalConfig.clientSecret,
    redirectUri: msalConfig.redirectUri,
    authority: msalConfig.authority,
    knownAuthorities: [],
    postLogoutRedirectUri: "/",

  },
  cache: {
    cacheLocation: 'localStorage',
    temporaryCacheLocation: "localStorage",

    // storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },

}
/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  authority: msalConfig.authority,
  clientSecret: msalConfig.clientSecret,
  clientId: msalConfig.clientId,
  knownAuthorities: [],
  redirectUri: msalConfig.redirectUri,
  prompt: "none",
  scopes: [
    'User.Read',
    'Mail.ReadWrite',
    'Mail.send',
    'email',
    'openid',
    'profile',
    "Calendars.ReadWrite",
    "Notes.ReadWrite.All",
    "Calendars.ReadWrite.Shared",
    "Contacts.ReadWrite",
    "Contacts.ReadWrite.Shared",
    "Files.ReadWrite.All",
    "Files.ReadWrite.AppFolder",
    "Files.ReadWrite.Selected",
    "Mail.ReadWrite.Shared",
    "Mail.Send.Shared",
    "Mail.Send",
    "Mail.ReadWrite",
    "MailboxSettings.ReadWrite",
    "Notes.Create",
    "Notes.ReadWrite.All",
    "Schedule.ReadWrite.All",
    "Tasks.ReadWrite.Shared",
    "User.Read",
    "User.ReadWrite.All",
    "User.ReadWrite",
  ],
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
  auth: {
    authority: msalConfig.authority,
    redirectUri: msalConfig.redirectUri,
    prompt: "none",
    loginHint: 'skylerzanth@outlook.com',
    scopes: [
      "openid",
      "profile",
      "email",
      "offline_access",
      "calendars.readwrite",
      "Mail.readwrite",
      "Notes.ReadWrite.All",
      "offline_access",
      "Calendars.ReadWrite",
      "Calendars.ReadWrite.Shared",
      "Contacts.ReadWrite",
      "Contacts.ReadWrite.Shared",
      "Files.ReadWrite.All",
      "Files.ReadWrite.AppFolder",
      "Files.ReadWrite.Selected",
      "Mail.ReadWrite.Shared",
      "Mail.Send.Shared",
      "Mail.Send",
      "Mail.ReadWrite",
      "MailboxSettings.ReadWrite",
      "Notes.Create",
      "Notes.ReadWrite.All",
      "Schedule.ReadWrite.All",
      "Tasks.ReadWrite.Shared",
      "User.Read",
      "User.ReadBasic.All",
      "User.ReadWrite",
    ],
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      }
    }
  },

}

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
