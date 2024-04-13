

import { DataFunctionArgs, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { model } from "~/models";
import { schemaUserLogin } from "~/schemas";
import { authenticator } from '~/services/auth'
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { badRequest, forbidden } from "remix-utils";
import { createMetaData, getRandomText, getRedirectTo, useRedirectTo, } from "~/utils";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import financeFormSchema from './overviewUtils/financeFormSchema';


export async function loader({ request, params }: LoaderFunction) {
  return redirect('/user/dashboard')
}

export async function action({ request }: DataFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const formPayload = Object.fromEntries(formData);
  const email = formPayload.email;
  console.log('requestfice')

  const requestfice = await authenticator.authenticate("user-pass", request, {
    successRedirect: "/user/dashboard",
    failureRedirect: "/login",
  });
  console.log('requestfice', requestfice)

  let validatedData;
  try {
    validatedData = formPayload
    console.log('validatedData', validatedData)

  } catch (error) {
    console.log('Form data validation failed', error);
    return badRequest(error);
  }
  if (!validatedData.value || validatedData.intent !== "submit") {
    return badRequest(validatedData);
  }
  if (!formPayload.value || formPayload.intent !== "submit") {
    return badRequest(formPayload);
  }
  const result = await prisma.user.findUnique({
    where: {
      email: 'skylerzanth@gmail.com'
    }
  });
  console.log(result)

  if (!result) {
    return forbidden({ ...validatedData, error: 'User not found' });
  }
  // Assuming result.error indicates an error during the user lookup
  if (result.error) {
    return forbidden({ ...validatedData, error: result.error });
  }
  await authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
    failureRedirect: "/login",
  });
  return json(result);
}

