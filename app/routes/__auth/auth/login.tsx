// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// <WelcomeSnippet>
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './AppContext';
import { Link, useSubmit, useRouteLoaderData, useNavigate, } from '@remix-run/react';
import { TfiMicrosoft } from "react-icons/tfi";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { Button } from '~/components';
import { useEffect } from 'react';


export default function Welcome() {
  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const navigate = useNavigate();
  const email = activeAccount?.username || '';
  const name = activeAccount?.name || '';
  useEffect(() => {
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("name", name);
  }, [email, name]);
  if (activeAccount) {

    //const url = '/dealer/quote/Harley-Davidson'
    const url = `/createSession?email=${email}&name=${name}`;

    return navigate(url);
  }




  /** const formData = new FormData();
   const email = String(activeAccount.username)
   const name = String(activeAccount.name)
   const expiry = String(activeAccount?.idTokenClaims?.exp)
   formData.append("email", email);
   formData.append("expiry", expiry);
   formData.append("name", name);
   submit(formData, { method: "post", action: "/usercheck" }); */
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <UnauthenticatedTemplate>
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="grid  w-full grid-cols-1">
            <div className="w-[50%]">
              <div className="flex items-center justify-center text-center">

                <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <h1 className="text-white">Welcome to D.S.A.</h1>
                  <p className="mt-5 text-white">
                    Log-in
                  </p>
                  <Button onClick={app.signIn!} variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-white "  >
                    <p className="mr-1">Login with your </p>
                    <TfiMicrosoft className="text-[28px]" />{" "}
                    <p className="ml-2">account</p>
                  </Button>
                  <hr className="solid mb-5 mt-5 text-white" />
                  <Link to="/privacy">
                    <p className="text-white">To review our Privacy Policy</p>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <div className="grid  w-full grid-cols-1">
          <div className="w-[50%]">
            <div className="flex items-center justify-center text-center">

              <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h1 className="text-white">Welcome to D.S.A.</h1>
                <p className="mt-5 text-white">
                  Are you sure you want to log out?
                </p>
                <Button onClick={app.signOut!} variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-white "  >
                  <p className="mr-1">Logout of your </p>
                  <TfiMicrosoft className="text-[28px]" />{" "}
                  <p className="ml-2">account</p>
                </Button>
                <hr className="solid mb-5 mt-5 text-white" />
                <Link to="/privacy">
                  <p className="text-white">To review our Privacy Policy</p>
                </Link>
              </div>

            </div>
          </div>
        </div>

      </AuthenticatedTemplate>

    </div>
  );
}
