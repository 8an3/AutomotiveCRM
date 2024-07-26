import { Button } from '~/components';
import { Link, useSubmit, useNavigate, useLocation } from '@remix-run/react';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from '~/components/microsoft/AppContext';
import { TfiMicrosoft } from "react-icons/tfi";
import { useState, useEffect } from 'react'
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { type ActionFunction, json, type LoaderFunction, redirect } from "@remix-run/node"
import { getUser } from '~/components/microsoft/GraphService';
import { config, msalConfig } from '~/components/microsoft/Config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"



export async function action({ request }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  const formData = financeFormSchema.parse(formPayload);
  const email = formData.email || ''
  const name = formData.name || ''
  return redirect(`/createSession?email=${email}&name=${name}`)
}

export default function Welcome() {
  const app = useAppContext();
  const { instance } = useMsal();
  const navigate = useNavigate()
  const activeAccount = instance.getActiveAccount();
  const email = activeAccount?.username || '';
  const name = activeAccount?.name || '';
  const idToken = activeAccount?.idToken || '';
  console.log(email, 'email', name, 'name', idToken, 'idToken', activeAccount)
  const [currentURL, setCurrentURL] = useState()


  const submit = useSubmit();
  const [user, setUser] = useState();

  useEffect(() => {
    const currentUrl2 = window.location.href;
    console.log("Current URL:", currentUrl2);
    setCurrentURL(currentUrl2)
    if (idToken && activeAccount) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("idToken", idToken);
      return submit(formData, { method: "post" });
    }
    if (!idToken && !activeAccount) {
      const fetchUnreadCount = async () => {
        const user = await getUser(app.authProvider!)
        setUser(user)
      };
      fetchUnreadCount();
    }
  }, []);

  const OnClick = async () => {
    console.log(user, 'user')
    instance.loginPopup(config).catch(e => {
      console.log(e);
    });
    //  const signIn = app.signIn!
    // return signIn
  }

  const OnClickContinue = async () => {
    console.log(user, 'user')
    const goTo = navigate(`/createSession?email=${email}&name=${name}`)
    return goTo
  }

  const OnClickLogout = async () => {
    console.log(user, 'user')
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/"
    });
    //  const signOut = app.signOut!
    // return signOut
  }
  return (
    <>
      <div className="p-5 mb-4 bg-light rounded-3">
        <UnauthenticatedTemplate>
          <Card className="max-w-[350px] w-[350px]  fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Login with your microsoft account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  onClick={OnClick}
                  variant="outline"
                  className=" w-full text-foreground bg-primary"  >
                  <p className="mr-1">Login with </p>
                  <TfiMicrosoft className="text-[28px]" />{" "}
                </Button>
                <hr className="solid text-muted-foreground" />
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
      </div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <AuthenticatedTemplate>
          <Card className="max-w-[350px] w-[350px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <CardHeader>
              <CardTitle className="text-2xl"> Welcome back {activeAccount?.name}!
              </CardTitle>
              <CardDescription>
                Have a nice day!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  onClick={() => {
                    OnClickContinue()
                  }}
                  variant="outline"
                  className=" w-full text-foreground bg-primary"  >
                  Continue...
                </Button>
                <hr className="solid text-foreground" />
                <Link to="/privacy">
                  <Button onClick={OnClickLogout} className="w-full  text-foreground ">
                    <p className="mr-1">Logout of your </p>
                    <TfiMicrosoft className="text-[28px]" />{" "}
                    <p className="ml-2">account</p>
                  </Button>
                </Link>
                <Link to="/privacy">
                  <Button variant='outline' type="submit" className="w-full">
                    <p className=" text-foreground ">To review our Privacy Policy</p>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>


        </AuthenticatedTemplate>
      </div>
    </>
  );
}
/** <div className="grid  w-full grid-cols-1">
            <div className="w-[50%]">
              <div className="flex items-center justify-center text-center">

                <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <h1 className="text-foreground">Have a nice day!</h1>
                  <p className="mt-5 text-foreground">
                    Welcome {activeAccount?.name} to D.S.A.!
                  </p>
                  <div className='grid grid-cols-1'>
                    <Button
                      onClick={() => {
                        OnClickContinue()
                      }}
                      variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-foreground "  >
                      <p className="mr-1">Continue...</p>
                    </Button>

                    <Button onClick={OnClickLogout} variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-foreground bg-[#c72323] "  >
                      <p className="mr-1">Logout of your </p>
                      <TfiMicrosoft className="text-[28px]" />{" "}
                      <p className="ml-2">account</p>
                    </Button>
                  </div>

                  <hr className="solid mb-5 mt-5 text-foreground" />
                  <Link to="/privacy">
                    <p className="text-foreground">To review our Privacy Policy</p>
                  </Link>
                </div>

              </div>
            </div>
          </div>
 */

/**  <>
      <div className="p-5 mb-4 bg-light rounded-3">
        <UnauthenticatedTemplate>

        </UnauthenticatedTemplate>
      </div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <AuthenticatedTemplate>


        </AuthenticatedTemplate>
      </div>
    </> */
