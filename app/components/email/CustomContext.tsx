import {
  PublicClientApplication, InteractionType, AccountInfo, EventType, type EventMessage,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

import { type AuthProvider, Client, type ClientOptions, type AuthProviderCallback, type Options, AuthenticationProvider, } from "@microsoft/microsoft-graph-client";
import { config, loginRequest, msalConfig } from './Config'
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { useState } from "react";
import type { User, Event, Message } from '@microsoft/microsoft-graph-types';

export interface AppUser {
  displayName?: string;
  email?: string;
  avatar?: string;
  timeZone?: string;
  timeFormat?: string;
}

export interface AppError {
  message: string;
  debug?: string;
}

export default function CustomContext() {
  const msal = useMsal();
  const { instance, accounts } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [user, setUser] = useState<AppUser | undefined>();
  const [userGet, setUserGet] = useState<AppUser | undefined>();
  const [accessToken, setaccessToken] = useState();
  const [error, setError] = useState<AppError | undefined>();

  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: msalConfig.scopes,
      interactionType: InteractionType.Popup,
    }
  );

  async function Silent() {
    let getToken = await msal.instance.acquireTokenSilent({
      scopes: msalConfig.scopes,
      redirectUri: msalConfig.redirectUri,
      prompt: "select_account",
      authority: msalConfig.authority,
    });
    if (getToken) {
      setaccessToken(getToken)
    } else if (!accessToken) {
      const msalInstance = new PublicClientApplication(config);
      if (accounts && accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
      const accessTokenRequest = {
        scopes: msalConfig.scopes,
        account: accounts[0],
      };
      msalInstance.acquireTokenSilent(accessTokenRequest)
        .then(function (accessTokenResponse) {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken || ''
          setaccessToken(accessToken)
        })
    } else {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          setaccessToken(response.accessToken)
        });
    }
    const userGet = await getUser(authProvider);
    setUserGet(userGet)
    setUser({
      displayName: userGet.displayName || "",
      email: userGet.mail || userGet.userPrincipalName || "",
      timeFormat: userGet.mailboxSettings?.timeFormat || "",
      timeZone: userGet.mailboxSettings?.timeZone || "UTC",
    });
  }
  let clientOptions: ClientOptions = {
    authProvider,
  };
  const client = Client.initWithMiddleware(clientOptions);

  return {
    instance,
    accounts,
    activeAccount,
    client,
    Silent,
    userGet,
    error,
    accessToken,
    displayError,
    clearError,
    authProvider,
  };
}

export async function getUser(authProvider): Promise<User> {
  let clientOptions: ClientOptions = {
    authProvider,
  };
  const client = Client.initWithMiddleware(clientOptions);

  const user: User = await client.api('/me')
    //.select('id,displayName,mail,mailboxSettings,userPrincipalName')
    .get();
  return user;
}
