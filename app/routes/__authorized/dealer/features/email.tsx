import { Outlet, Link, useSubmit } from '@remix-run/react';
import { ClientOnly } from "remix-utils";
import ProvideAppContext, { useAppContext } from '~/components/microsoft/AppContext';
//import ProvideAppContext from "~/routes/__auth/auth/AppContext";
import {
  PublicClientApplication,
  EventType,
  type EventMessage,
  type AuthenticationResult,
  LogLevel,
} from '@azure/msal-browser';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate, useAccount } from '@azure/msal-react';
import { config } from '~/components/microsoft/Config';
import secondary from "~/styles/secondary.css";
import { json, LinksFunction, LoaderFunction, redirect } from '@remix-run/node';
import { CopilotKit } from "@copilotkit/react-core";
import { useEffect, useRef, useState } from 'react';
import money from '~/images/favicons/money.svg'
import { getUser } from '~/components/microsoft/GraphService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
// https://cloud.copilotkit.ai/dashboard
import { Button, Separator } from '~/components';
import { TfiMicrosoft } from "react-icons/tfi";



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
  { rel: "icon", type: "image/svg", href: money, },
];

export async function loader({ request, params, req }: LoaderFunction) {
  const PROD_CALLBACK_URL = process.env.PROD_CALLBACK_URL
  return json({ PROD_CALLBACK_URL });
}

export default function LoggedIn() {
  const app = useAppContext();
  const { instance, inProgress, accounts } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [user, setUser] = useState();
  const [account, setAccount] = useState()
  // const msalInstance = new PublicClientApplication(config);

  //const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts.length > 0) {
    //msalInstance.setActiveAccount(accounts[0]);
    setAccount(accounts[0])
  }
  /**  msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const authResult = event.payload as AuthenticationResult;
        //  console.log(authResult, authResult.account);
        msalInstance.setActiveAccount(authResult.account);
      }
    }); */

  const email = activeAccount ? activeAccount?.username : accounts[0]?.username;
  const name = activeAccount ? activeAccount?.name : accounts[0]?.name;
  const idToken = activeAccount ? activeAccount?.idToken : accounts[0]?.idToken;

  useEffect(() => {
    if (!idToken && !activeAccount) {
      const fetchUnreadCount = async () => {
        const user = await getUser(app.authProvider!)
        setUser(user)
        console.log(user, 'user')
      };

      fetchUnreadCount();
    }
  }, []);

  if (!user) {
    if (!accounts || !activeAccount) {
      return (
        <NotLoggedIn />
      )
    }
  }
  // console.log(email, 'email', name, 'name', idToken, 'idToken', activeAccount)
  //<MsalProvider instance={msalInstance}>
  //   </MsalProvider>

  const submit = useSubmit();
  return (
    <ClientOnly fallback={<SimplerStaticVersion />} >
      {() => (
        <>
          <AuthenticatedTemplate>
            <ProvideAppContext>
              <div className='max-h-screen max-w-screen' >
                <Outlet />
              </div>
            </ProvideAppContext>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Card className="max-w-[350px] w-[350px]  fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-background">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Login with your microsoft account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Link to={`/auth/login`} >
                    <Button

                      variant="outline"
                      className=" w-full text-foreground bg-primary"  >
                      <p className="mr-1">Login with </p>
                      <TfiMicrosoft className="text-[28px]" />{" "}
                    </Button>
                  </Link>

                  <Separator className="border-border" />
                  <Link to="/privacy">
                    <Button variant='outline' type="submit" className="w-full bg-background">
                      <p className="text-muted-foreground">To review our Privacy Policy</p>
                    </Button>
                  </Link>
                  <div className="mt-4 text-center text-sm">
                    No account?{" "}
                    <Link to="/subscribe" className="underline">
                      Sign up
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </UnauthenticatedTemplate>
        </>
      )}
    </ClientOnly>
  );
}

export function NotLoggedIn() {
  const config = {
    auth: {
      clientId: "0fa1346a-ab27-4b54-bffd-e76e9882fcfe",
      clientSecret: '4hN8Q~RtcN.b9c.1LTCnHtY0UurShP1PIIFQGakw',
      tenantId: 'fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6',
      //redirectUri: PROD_CALLBACK_URL,
      redirectUri: `http://localhost:3000/auth/login`,
      authority: `https://login.microsoftonline.com/common`,
      postLogoutRedirectUri: "/",
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
    },
    cache: {
      cacheLocation: 'localStorage',
      temporaryCacheLocation: "localStorage",

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

  const msalInstance = new PublicClientApplication(config);

  const accounts = msalInstance.getAllAccounts();
  // console.log(msalInstance, accounts, 'accounts')

  if (accounts && accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const authResult = event.payload as AuthenticationResult;
      //    console.log(authResult, authResult.account);
      msalInstance.setActiveAccount(authResult.account);
    }
  });

  if (msalInstance) {
    return (
      <ClientOnly fallback={<SimplerStaticVersion />} >
        {() => (
          <MsalProvider instance={msalInstance}>
            <ProvideAppContext>
              <div className='max-h-screen max-w-screen' >
                <AuthenticatedTemplate>
                  <Outlet />
                </AuthenticatedTemplate>
              </div>
            </ProvideAppContext>
          </MsalProvider>
        )}
      </ClientOnly>
    );
  }
  if (!msalInstance) {
    return redirect('/auth/login')
  }
}
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}
const loginRequest = {
  scopes: [
    "User.ReadWrite",
    "mailboxsettings.read",
    "calendars.readwrite",
    "mail.readwrite",
    "Mail.Send",
    "Notes.ReadWrite.All",
    "Mail.ReadBasic.All",
    "openid",
    "Mail.ReadWrite",
    "offline_access",
  ]
};
const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
async function callMsGraph(accessToken) {
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
