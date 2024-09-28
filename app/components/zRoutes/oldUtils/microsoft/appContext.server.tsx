// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, {
  useContext,
  createContext,
  useState,
  MouseEventHandler,
  useEffect
} from 'react';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

import { GetUser } from './graphService.server';
import config from './config.server';
import { json } from '@remix-run/node';

// <AppContextSnippet>
export interface AppUser {
  displayName?: string,
  email?: string,
  avatar?: string,
  timeZone?: string,
  timeFormat?: string
};

export interface AppError {
  message: string,
  debug?: string
};

type AppContext = {
  user?: AppUser;
  error?: AppError;
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  displayError?: Function;
  clearError?: Function;
  authProvider?: AuthCodeMSALBrowserAuthenticationProvider;
}

const appContext = createContext<AppContext>({
  user: undefined,
  error: undefined,
  signIn: undefined,
  signOut: undefined,
  displayError: undefined,
  clearError: undefined,
  authProvider: undefined
});

export function useAppContext(): AppContext {
  return useContext(appContext);
}

interface ProvideAppContextProps {
  children: React.ReactNode;
}

export default function ProvideAppContext({ children }: ProvideAppContextProps) {
  const auth = useProvideAppContext();
  return (
    <appContext.Provider value={auth}>
      {children}
    </appContext.Provider>
  );
}

function useProvideAppContext() {
  const msal = useMsal();
  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [error, setError] = useState<AppError | undefined>(undefined);

  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  }

  const clearError = () => {
    setError(undefined);
  }

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: config.scopes,
      interactionType: InteractionType.Popup
    }
  );

  const checkUser = async () => {
    if (!user) {
      try {
        // Check if user is already signed in
        const account = msal.instance.getActiveAccount();
        if (account) {
          // Get the user from Microsoft Graph
          const user = await getUser(authProvider);

          setUser({
            displayName: user.displayName || '',
            email: user.mail || user.userPrincipalName || '',
            timeFormat: user.mailboxSettings?.timeFormat || 'h:mm a',
            timeZone: user.mailboxSettings?.timeZone || 'UTC'
          });
        }
      } catch (err: any) {
        displayError(err.message);
      }
    }
  };
  checkUser();

  const signIn = async () => {
    await msal.instance.loginPopup({
      scopes: config.scopes,
      prompt: 'select_account'
    });

    const user = await getUser(authProvider);

    setUser({
      displayName: user.displayName || '',
      email: user.mail || user.userPrincipalName || '',
      timeFormat: user.mailboxSettings?.timeFormat || '',
      timeZone: user.mailboxSettings?.timeZone || 'UTC'
    });
  };

  const signOut = async () => {
    await msal.instance.logoutPopup();
    setUser(undefined);
  };

  return {
    user,
    error,
    signIn,
    signOut,
    displayError,
    clearError,
    authProvider
  };
}

export async function SignIn(msal) {

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: config.scopes,
      interactionType: InteractionType.Popup,
    }
  );

  await msal.instance.loginPopup({
    scopes: config.scopes,
    prompt: 'select_account',
  });

  let user = await GetUser(authProvider);
  user = {
    displayName: user.displayName || '',
    email: user.mail || user.userPrincipalName || '',
    timeFormat: user.mailboxSettings?.timeFormat || '',
    timeZone: user.mailboxSettings?.timeZone || 'UTC'
  }
  console.log(user, 'signin in config')
  return json({ user })
};

export async function CheckUser(user) {
  const msal = useMsal();
  console.log(user, 'CheckUser in config')

  const displayError = (message: string, debug?: string) => {
    return json({ message, debug });
  }

  const clearError = () => {
    return json(undefined);
  }

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: msal.instance.getActiveAccount()!,
      scopes: config.scopes,
      interactionType: InteractionType.Popup
    }
  );
  if (!user) {
    try {
      // Check if user is already signed in
      const account = msal.instance.getActiveAccount();
      if (account) {
        // Get the user from Microsoft Graph
        let user = await GetUser(authProvider);
        user = {
          displayName: user.displayName || '',
          email: user.mail || user.userPrincipalName || '',
          timeFormat: user.mailboxSettings?.timeFormat || '',
          timeZone: user.mailboxSettings?.timeZone || 'UTC'
        }
        console.log(user, 'CheckUser in config2')

        return json({ user })

      }
    } catch (err: any) {
      displayError(err.message);
    }
  }
  else return user
};
