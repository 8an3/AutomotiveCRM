import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json } from "@remix-run/node";
import {
  type LoaderArgs,
  type DataFunctionArgs,
  redirect,
} from "@remix-run/node";

import {
  Form,
  Link,
  useParams,
  useMatches,
  useNavigation,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import React, { useEffect, useId, useState } from "react";
import { badRequest, forbidden } from "remix-utils";
import {
  Alert,
  ButtonLoading,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  emixForm,
  RemixLinkText,
} from "~/components";
import { configSite } from "~/configs";
import { model } from "~/models";
import { schemaUserLogin } from "~/schemas";
import {
  createMetaData,
  getRandomText,
  getRedirectTo,
  useRedirectTo,
} from "~/utils";
import { Button } from "~/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  redirectIfLoggedInLoader,
  setAuthOnResponse,
} from "~/utils/misc.user.server";
import { TfiMicrosoft } from "react-icons/tfi";
import { authenticator } from "~/services/auth";
import {
  getSession,
  commitSession,
  authSessionStorage,
  destroySession,
} from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import type { User } from "@prisma/client";
import { prisma } from "~/libs";
import {
  useMsalAuthentication,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import { callMsGraph } from "~/utils/microsoft/MsGraphApiCall";

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const accessToken = session.get("accessToken");

  if (session.data.length < 5000) {
    console.log("no user");
    await destroySession(session);
    session = await getSession(request.headers.get("Cookie"));
  }
  if (!email && !accessToken) {
    console.log("no user");
    await destroySession(session);
    session = await getSession(request.headers.get("Cookie"));
  }
  if (!email) {
    console.log("no user");
    await destroySession(session);
    session = await getSession(request.headers.get("Cookie"));
  }

  let user;
  if (email && accessToken) {
    console.log("user logged in");
    console.log(session, email, "sessoin data");

    user = await GetUser(email);
    const me = await fetch("https://graph.microsoft.com/v1.0/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, },
    })
      .then((response) => {
        user = response.json()
        session.set("accessToken", accessToken)
        session.set("email", email);
        console.log(user, 'insdie function')
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    console.log(me, 'mer')
    if (me.email && me.surname) {
      return redirect("/dealer/checksubscription"),
        { headers: { 'Set-Cookie': await commitSession(session) } }
    } else {
      await destroySession(session);
      return redirect("/login"),
        { headers: { 'Set-Cookie': await commitSession(session) } }
    }
  }

  console.log(email, accessToken, "loader");
  const domain = request.headers.get("host");

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

  return json(
    {
      domain,
      accessToken,
      email,
      redirectIfLoggedInLoader,
      headerHeadingText,
      headerDescriptionText,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}


export async function action({ request }: DataFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const submission = parse(formData, { schema: schemaUserLogin });
  if (!submission.value || submission.intent !== "submit") { return badRequest(submission); }
  const result = await model.user.mutation.login(submission.value);
  if (result.error) { return forbidden({ ...submission, error: result.error }); }
  await authenticator.authenticate("microsoft", request, {
    successRedirect: getRedirectTo(request) || "/dealer/user/dashboard/settings",
    failureRedirect: "/login",
  });
  return json(submission, {
    headers: {
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "same-origin",
    },
  });
}

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
        <div className="flex items-center justify-center text-center">
          <Form action="/microsoft" method="post">
            <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
              <h1 className="text-white">Welcome to D.S.A.</h1>
              <p className="mt-5 text-white">
                Continue with your microsoft account to login
              </p>
              <Button variant="outline" className="mt-5 w-auto rounded-xl border border-white px-8 py-5 text-xl text-white "  >
                <p className="mr-1">Login with your</p>
                <TfiMicrosoft className="text-[28px]" />{" "}
                <p className="ml-2">account</p>
              </Button>
              <hr className="solid mb-5 mt-5 text-white" />
              <Link to="/privacy">
                <p className="text-white">To review our Privacy Policy</p>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
