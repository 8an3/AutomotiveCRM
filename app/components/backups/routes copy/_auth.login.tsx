import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, type LoaderFunctionArgs, type ActionArgs, type V2_MetaFunction, type DataFunctionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
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

export const meta: V2_MetaFunction = () => {
  return createMetaData({
    title: "Login",
    description: `Continue with your DSA account`,
  });
};

export async function loader({ request }: LoaderArgs) {


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

  let actionResult = useActionData<typeof action>();

  return (
    <Card className="w-[95%] md:w-1/3 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px]  bg-slate1  ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>

      </CardHeader>
      <CardContent className="grid gap-4 bg-slate1 justify-center items-center">


        <Form action="/google" method="post">
          <Button variant='outline' className='text-black border-black border px-8 py-5 w-auto rounded-xl text-xl '>
            <p className='mr-1'> Login with </p>
            <FcGoogle className='text-[28px]' /><p>oogle</p>
          </Button>
        </Form>

      </CardContent>

    </Card>
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
