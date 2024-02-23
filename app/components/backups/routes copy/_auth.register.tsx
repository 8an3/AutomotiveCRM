import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { useId } from "react";
import { badRequest, forbidden } from "remix-utils";
import { useRootLoaderData, type RootLoaderData } from "~/hooks";
import { toast } from "sonner"
import crypto from "crypto";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Alert,
  ButtonLoading,
  Debug,
  Input,
  InputPassword,
  Label,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
} from "~/components";
import { configSite } from "~/configs";
import { model } from "~/models";
import { schemaUserRegister } from "~/schemas";
//import { authenticator } from "~/services";
import {
  createMetaData,
  getRandomText,
  getRedirectTo,
  useRedirectTo,
} from "~/utils";

import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import type { z } from "zod";
import { prisma } from "~/libs/prisma.server";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/utils/misc.user.server";

export const meta: V2_MetaFunction = () => {
  return createMetaData({
    title: "Register for Dealer Sales Assistant",
    description: "Create your new account to join the easier life.",
  });
};

export const loader = redirectIfLoggedInLoader;



/**
 * More details about the decision here can be read
 * in the _auth.login route action function
 */
export async function action({ request, params }: ActionArgs) {


  let formData = await request.formData();

  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");
  let name = String(formData.get("name") || "");
  let username = String(formData.get("username") || "");

  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }
  if (!errors.email) {
    let user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });

    return Boolean(account);
  }

  if (errors) {
    return json({ ok: false, errors }, 400);
  }
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha256")
    .toString("hex");


  let user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      username: username,
      password: { create: { hash, salt } },
      role: { connect: { id: sales?.id } },
      profile: {
        create: {
          headline: "Sales Dept",
          bio: "Normal User",
        },
      },

    }
  })
  return setAuthOnResponse(redirect("/email"), user.id);
}

export default function Route() {
  const { headerHeadingText, headerDescriptionText } =
    useLoaderData<typeof loader>();
  const { searchParams, redirectTo } = useRedirectTo();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const actionData = useActionData<typeof action>();
  let actionResult = useActionData<typeof action>();

  const id = useId();
  const [form, fields] = useForm<z.infer<typeof schemaUserRegister>>({
    id,
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    constraint: getFieldsetConstraint(schemaUserRegister),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserRegister });
    },
  });
  const { name, username, email, password } = fields;

  return (
    <Card className="w-[95%] md:w-1/3 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px]  bg-slate1  ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          <h1>{headerHeadingText}</h1>
        </CardTitle>
        <CardDescription>
          <p >{headerDescriptionText}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 bg-slate1">
        <Form className="space-y-6" method="post">

          <div className="space-y-1">
            <Label htmlFor={name.id}>Full Name</Label>
            <Input
              {...conform.input(name)}
              type="text"
              placeholder="Your Full Name"
              autoComplete="name"
              autoFocus
              required

            />

          </div>

          <div className="space-y-1">
            <Label htmlFor={username.id}>Username</Label>
            <Input
              {...conform.input(username)}
              type="text"
              placeholder="yourname"
              autoComplete="username"
              required

            />
            {username.error && (
              <Alert variant="danger" id={username.errorId}>
                {username.error}
              </Alert>
            )}
            <p className="text-xs text-slate1">
              4 to 20 characters (letters, numbers, dot, underscore)
            </p>
          </div>

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
              autoFocus
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-describedby={
                actionResult?.errors?.email ? "email-error" : "signup-header"
              }
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
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-describedby="password-error"
              required
            />

            <p className="text-xs ">8 characters or more</p>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <ButtonLoading
            size="lg"
            type="submit"
            name="intent"
            value="submit"
            isSubmitting={isSubmitting}
            loadingText="Creating account..."
            className="w-full "
            onClick={() => toast.success(`Welcome ${actionData.username}`)}
          >
            Join {configSite.name}
          </ButtonLoading>

          {/* <div>
            <p>By clicking "Create {configSite.name}" you agree to our Code of Conduct, Terms of Service and Privacy Policy.</p>
          </div> */}

          <div>
            <p className="text-center">
              <RemixLinkText

                to={{ pathname: "/login", search: searchParams.toString() }}
              >
                Have an account? Login
              </RemixLinkText>
            </p>
          </div>
        </Form>

        <Debug name="form">{{ actionData, fields }}</Debug>
      </CardContent>

    </Card>
  );
}
