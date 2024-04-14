/**so after a lot of hours with no docs to go off of, great when your new to programming lol, I decided to recreate the entire auth flow. Not only does it work without a hitch, but I can use it to get resources off of their apis accross my entire site, and I spent a lot less time on creating this then trying to make the sdks work. I have a plan on how integrate MSAL into the custom flow, which according to some posts they claim its impossible, we'll see about that, I think it will be pretty easy tbh. Also I made it knowing I will be upgrading remix shortly, so it better fing work since I've seen a lot of people complain about that, but it should. So the flow will be for remix-run, authentication and gaining access to services where you need them, when you need them and will work over production releases instead of just one release, tested it on two releases so far. Not posting yet because I haven't integrated msal yet, should be done tonight if all goes well. Probably won't go well, since I haven't seen any one do this yet. */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, {
  useContext,
  createContext,
  useState,
  type MouseEventHandler,
  useEffect,
} from "react";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import {
  InteractionType,
  type PublicClientApplication,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import {
  getSession,
  commitSession,
  destroySession,
} from "../sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";

//import { getUser } from './GraphService';
import config from "./_auth.config";

// <AppContextSnippet>
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

type AppContext = {
  user?: AppUser;
  error?: AppError;
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  displayError?: Function;
  clearError?: Function;
  authProvider?: AuthCodeMSALBrowserAuthenticationProvider;
};

const appContext = createContext<AppContext>({
  user: undefined,
  error: undefined,
  signIn: undefined,
  signOut: undefined,
  displayError: undefined,
  clearError: undefined,
  authProvider: undefined,
});

export function useAppContext(): AppContext {
  return useContext(appContext);
}

interface ProvideAppContextProps {
  children: React.ReactNode;
}

export default function ProvideAppContext({
  children,
}: ProvideAppContextProps) {
  const auth = useProvideAppContext();
  return <appContext.Provider value={auth}>{children}</appContext.Provider>;
}

const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";


export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let email = session.get("email");
  let accessToken = session.get("accessToken");
  let user = await GetUser(email);
  const microId = await prsima.microsoftAccount.findUnique({
    where: { email: email },
  });
  return json({ user, accessToken, microId });
}

async function GetActiveAccount() {
  const { user, accessToken, microId } = useLoaderData();
  console.log(user, accessToken, "frist try");
  return {
    email: microId.email,
    username: microId.username,
    id: microId.microId,
    name: microId.name,
    givenName: microId.givenName,
    familyName: microId.familyName,
    identityProvider: "Microsoft", // Or the name of the identity provider used
    // Any other relevant properties you expect to receive
  };
}

function useProvideAppContext() {
  const msal = useMsal();
  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [error, setError] = useState<AppError | undefined>(undefined);

  const displayError = (message: string, debug?: string) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };
  // this is where it matters, so we can hook our custom auth to this
  // replace msal.instance.getActiveAccount(); which shows up twice in this file

  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
    msal.instance as PublicClientApplication,
    {
      account: GetActiveAccount(),
      scopes: config.scopes,
      interactionType: InteractionType.Popup,
    }
  );

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        try {
          // Check if user is already signed in
          const account = GetActiveAccount();
          if (account) {
            // Get the user from Microsoft Graph
            const user = await getUser(authProvider);

            setUser({
              displayName: user.displayName || "",
              email: user.mail || user.userPrincipalName || "",
              timeFormat: user.mailboxSettings?.timeFormat || "h:mm a",
              timeZone: user.mailboxSettings?.timeZone || "UTC",
            });
          }
        } catch (err: any) {
          displayError(err.message);
        }
      }
    };
    checkUser();
  });

  const signIn = async () => {
    // need to change this over to opur auth
    await msal.instance.loginPopup({
      scopes: config.scopes,
      prompt: "select_account",
    });

    const user = await getUser(authProvider);

    setUser({
      displayName: user.displayName || "",
      email: user.mail || user.userPrincipalName || "",
      timeFormat: user.mailboxSettings?.timeFormat || "",
      timeZone: user.mailboxSettings?.timeZone || "UTC",
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
    authProvider,
  };
}
