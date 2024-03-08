import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import type { LoaderArgs, DataFunctionArgs } from "@remix-run/node";

import { Form, Link, useParams, useMatches, useNavigation, useLocation, useLoaderData } from "@remix-run/react";
import React, { useId } from "react";
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
import { FcGoogle } from "react-icons/fc";



export async function loader({ request }: LoaderArgs) {
  const domain = request.headers.get('host');
  console.log(domain, 'url url')

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
    redirectIfLoggedInLoader,
    headerHeadingText,
    headerDescriptionText,
  });

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
  await authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
    failureRedirect: "/login",
  });
  return json(submission);
}



export default function Route() {
  const navigation = useNavigation();
  const { domain } = useLoaderData()
  // const isSubmitting = navigation.state === "submitting";
  const isSubmitting = navigation.formAction === "/login";
  function BusyIndicator() {
    const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));
    React.useEffect(() => {
      toast.promise(promise, {
        loading: 'Loading...',
        success: (data) => {
          return `Welcome back!`;
        },
        error: 'Error',
      });
    }, []);

    return null; // Return null because this component doesn't render anything
  }
  return (
    <div className="w-full  grid grid-cols-1">

      <div className="w-[50%]">
        <div className='flex items-center justify-center text-center'>
          <Form action="/google" method="post">
            <div className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <h1 className="text-white">Welcome to D.S.A.</h1>
              <p className="text-white mt-5">Continue with your google account to login</p>
              <Button variant='outline' className='w-auto rounded-xl mt-5 border border-white px-8 py-5 text-xl text-white '>
                <p className='mr-1'> Login with </p>
                <FcGoogle className='text-[28px]' /><p>oogle</p>
              </Button>
              <hr className="solid mt-5 text-white mb-5" />
              <Link to='/privacy'>
                <p className='text-white'>To review our Privacy Policy</p>

              </Link>
            </div>
          </Form>
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
