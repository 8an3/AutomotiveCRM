import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import type { LoaderArgs, DataFunctionArgs } from "@remix-run/node";

import { Form, Link, useParams, useMatches, useNavigation, useLocation, useLoaderData } from "@remix-run/react";
import React, { useEffect, useId, useState } from "react";
import { badRequest, forbidden } from "remix-utils";
import { Alert, ButtonLoading, Debug, InputPassword, Layout, PageHeader, emixForm, RemixLinkText, } from "~/components";
import { configSite } from "~/configs";
import { model } from "~/models";
import { schemaUserLogin } from "~/schemas";
import { createMetaData, getRandomText, getRedirectTo, useRedirectTo, } from "~/utils";
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "~/components/ui/card"
import { Toaster, toast } from 'sonner'
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/utils/misc.user.server";
import { TfiMicrosoft } from "react-icons/tfi";
import { authenticator, } from "~/services/auth";
import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import type { User } from '@prisma/client'
import { prisma } from "~/libs";
import { useMsalAuthentication, AuthenticatedTemplate, UnauthenticatedTemplate, useAccount, useMsal } from "@azure/msal-react";
import { callMsGraph } from "~/utils/microsoft/MsGraphApiCall";

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let user;
  if (session) {
    const email = session.get('email')
    user = await GetUser(email)
    if (user) {
      return getRedirectTo('/checksubscription')
    } else {
      await destroySession(session)
      return getRedirectTo('/login')
    }
  }
  let email = session.get("email")
  let accessToken = session.get("accessToken")

  await authenticator.isAuthenticated(request, { successRedirect: "/checksubscription", });
  if (session.data.length < 5000) { await destroySession(session); session = await getSession(request.headers.get("Cookie")); }

  let error = session.get(authenticator.sessionErrorKey);
  if (error) { return json({ error }); }
  console.log(session, email, 'sessoin data')
  if (email) {
    user = await GetUser(email)
    console.log('user logged in')
  }
  if (!email) {
    console.log('no user')
  }

  console.log(email, accessToken, 'loader')
  const domain = request.headers.get('host');

  const headerHeadingText = getRandomText([
    "Hello again!",
    "Welcome back!",
    "Glad to see you!",
  ]);

  const headerDescriptionText = getRandomText([
    `Continue to ${configSite.name}`,
    `Continue with your ${configSite.name} account`,
    `Use your ${configSite.name} account to continue`,
  ]);



  return json({
    domain,
    accessToken,
    email,
    redirectIfLoggedInLoader,
    headerHeadingText,
    headerDescriptionText,
  },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}
export async function action({ request }: DataFunctionArgs) {
  const clonedRequest = request.clone();

  const formData = await clonedRequest.formData();
  const submission = parse(formData, { schema: schemaUserLogin });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  // Check user email and password
  const result = await model.user.mutation.login(submission.value);

  // Use custom error for Conform submission
  if (result.error) {
    return forbidden({ ...submission, error: result.error });
  }
  await authenticator.authenticate("microsoft", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard/settings",
    failureRedirect: "/login",
  });
  return json((submission), {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin'
    }
  }
  )
};

export default function Route() {
  const navigation = useNavigation();
  /**
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }
   */

  return (
    <div className="grid  w-full grid-cols-1">
      <div className="w-[50%]">
        <div className='flex items-center justify-center text-center'>
          {/*
              onClick={() => instance.loginPopup()}

          */}
          <AuthenticatedTemplate>
            <p>Signed in.</p>


          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>

            <Form action="/microsoft" method="post">
              <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <h1 className="text-white">Welcome to D.S.A.</h1>
                <p className="mt-5 text-white">Continue with your microsoft account to login</p>
                <Button

                  variant='outline'
                  className='mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-white '
                >
                  <p className='mr-1'>Login with your</p>
                  <TfiMicrosoft className='text-[28px]' /> <p className="ml-2">account</p>
                </Button>
                <hr className="solid mb-5 mt-5 text-white" />
                <Link to='/privacy'>
                  <p className='text-white'>To review our Privacy Policy</p>
                </Link>
              </div>
            </Form>
          </UnauthenticatedTemplate>

        </div>
      </div>
    </div >
  );
}

/**    <Form method='post' >

          <div className="space-y-1">
            <Label htmlFor="email">
              Email address{" "}
              {actionResult?.errors?.email && (
                <span id="email-error" className="text-brand-red">
                  {actionResult.errors.email}
                </span>
              )}
            </Label>
            <Input
              name='email'
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              autoFocus
              required
            />

          </div>

          <div className="space-y-1">
            <Label htmlFor="password">
              Password{" "}
              {actionResult?.errors?.password && (
                <span id="password-error" className="text-brand-red">
                  {actionResult.errors.password}
                </span>
              )}
            </Label>
            <InputPassword
              name='password'
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />

            <p className="text-xs text-surface-500">At least 8 characters</p>
          </div>




            <ButtonLoading
            size="lg"
            type="submit"
            className="w-auto cursor-pointer"
            name="intent"
            value="submit"
            isSubmitting={isSubmitting}
            loadingText="Logging in..."
          >
            Login
          </ButtonLoading>

          <p className="text-center">
            <RemixLinkText to='/register'   >
              New to {configSite.name}? Register for free
            </RemixLinkText>
          </p>

          {isSubmitting ? <BusyIndicator /> : null}
        </Form> */
/*(**
export async function loader({ request, params }: LoaderFunctionArgs) {
  const userSession = await sessionGet(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  const email = userSession.get("email")
  const user = await getUserByEmail(email)
  console.log(user, 'email')
  //await authenticator.isAuthenticated(request, {
  ///  successRedirect: "/checksubscription",
  //});

  const headerHeadingText = getRandomText([
    "Hello again!",
    "Welcome back!",
    "Glad to see you!",
  ]);

  const headerDescriptionText = getRandomText([
    `Continue to ${configSite.name}`,
    `Continue with your ${configSite.name} account`,
    `Use your ${configSite.name} account to continue`,
  ]);

  return json({
    headerHeadingText,
    headerDescriptionText,
  });
}
)
*/
