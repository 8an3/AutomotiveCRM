

import { DataFunctionArgs, LoaderArgs, json } from "@remix-run/node";
import { model } from "~/models";
import { schemaUserLogin } from "~/schemas";
import { authenticator } from '~/services/auth.server'
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { badRequest, forbidden } from "remix-utils";
import { createMetaData, getRandomText, getRedirectTo, useRedirectTo, } from "~/utils";
import { getSession } from "~/sessions/session.server";
import { prisma } from "~/libs";
import financeFormSchema from './overviewUtils/financeFormSchema';

export async function loader({ request }: LoaderArgs) {
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = 'skylerzanth@gmail.com'//userSession.get("email");
  const user = await prisma.user.findUnique({ where: { email: email } })
  async function simulateFormSubmission() {
    const formData = new FormData();
    const email = 'skylerzanth@gmail.com'
    const name = user.name
    const username = user.name
    const password = 'teste123123'
    formData.append('email', email);
    formData.append('name', name);
    formData.append('username', username);
    formData.append('password', password);
    const response = await fetch('http://localhost:3000/google/form', {
      method: 'POST',
      body: formData,
    });
    console.log(await response.text()); // Log the server's response
    if (response.ok) {
      const responseBody = await response.json();
      console.log(responseBody);
    } else {
      console.error('Form submission failed:', response.status);
    }
  }
  await simulateFormSubmission();
  return json({ status: 'Form submitted' });
}

export async function action({ request }: DataFunctionArgs) {
  const clonedRequest = request.clone();

  //const formPayload = Object.fromEntries(await request.formData())
  //let formData = financeFormSchema.parse(formPayload);
  const formData = await clonedRequest.formData();
  //const formData2 = await clonedRequest.formData();
  // let formData = await request.formData();
  // let email = String(formData.get("email") || "");
  console.log(formData, 'formdata')
  //const submission = parse(formData, { schema: schemaUserLogin });
  // if (!submission.value || submission.intent !== "submit") {
  //  return badRequest(submission);
  // }
  const result = await prisma.user.findUnique({ where: { email: formData.email } })
  //  if (!result) {
  //   return forbidden({ ...submission, error: result.error });
  // }
  // if (result.error) {
  // return forbidden({ ...submission, error: result.error });
  // }
  await authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
    failureRedirect: "/login",
  });
  return json(result);
}

