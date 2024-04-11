import { useAccount, useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { InteractionType, PublicClientApplication, type Configuration, PopupRequest } from '@azure/msal-browser';
import { json } from 'stream/consumers';

const msalRequest = {
  scopes: [
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
  ]
};

const msalConfig: Configuration = {
  auth: {
    clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
    authority: `https://login.microsoftonline.com/fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6`,
    redirectUri: 'http://localhost:3000/callback',
    postLogoutRedirectUri: "/"
  },
  system: {
    allowNativeBroker: false // Disables WAM Broker
  }
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}

export function EnsureScope(scope) {
  // if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
  msalRequest.scopes.push(scope);
  //}
}

export default function MSAL() {
  const { instance, accounts, inProgress } = useMsal();
  const msal = {
    instance, accounts, inProgress
  }
  return msal
}

export async function FirstSignIn() {
  const { instance, accounts, inProgress } = useMsal();
  console.log(accounts, instance, inProgress, 'checking info in first sign in')
  const account = useAccount(accounts[0] || {});
  const [apiData, setApiData] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  console.log(accounts, instance, inProgress, 'checking info in first sign in')

  const scopes = [
    "user.readwrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "mail.send",
    "notes.readwrite.all",
  ]

  useEffect(() => {
    if (account) {
      instance.acquireTokenSilent({
        scopes: scopes,
        account: account
      }).then((response) => {
        if (response) {
          setAccessToken(response.accessToken)
          callMsGraph(response.accessToken).then((result) => setApiData(result));
        }
      });
    }
  }, [account, instance]);

  const accountZero = accounts[0]
  console.log(apiData, 'checking info in first sign in')
  const data = {
    accountZero, apiData, accessToken
  }
  return data
}


export async function SecondSignIn() {
  const msalInstance = new PublicClientApplication(msalConfig);

  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();
  console.log(accounts, activeAccount, 'checking info in first sign in')
  const account = useAccount(accounts[0] || {});
  const [apiData, setApiData] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  console.log(accounts, accounts, activeAccount, 'checking info in first sign in')

  const scopes = [
    "user.readwrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "mail.send",
    "notes.readwrite.all",
  ]

  const request = {
    scopes: scopes,
    account: activeAccount || accounts[0]
  };

  const authResult = await msalInstance.acquireTokenSilent(request);
  setAccessToken(authResult.accessToken)
  console.log(apiData, accessToken, 'checking info in first sign in')
  const data = {
    authResult, apiData, accessToken
  }
  return data
}

export async function GetToken() {
  const msal = useMsal();

  const msalClient = new msal.PublicClientApplication(msalConfig);

  let account;
  useEffect(() => {
    account = sessionStorage.getItem('msalAccount');
  }, []);
  if (!account) {
    throw new Error(
      'User info cleared from session. Please sign out and sign in again.');
  }
  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
      return interactiveResult.accessToken;
    } else {
      throw silentError;
    }
  }
}
