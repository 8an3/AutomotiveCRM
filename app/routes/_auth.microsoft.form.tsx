

import { DataFunctionArgs, LoaderArgs, json } from "@remix-run/node";
import { model } from "~/models";
import { schemaUserLogin } from "~/schemas";
import { authenticator } from '~/services/auth.server'
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { badRequest, forbidden } from "remix-utils";
import { createMetaData, getRandomText, getRedirectTo, useRedirectTo, } from "~/utils";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import financeFormSchema from './overviewUtils/financeFormSchema';
import axios from 'axios';

export async function loader({ request }: LoaderArgs) {
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get("email");
  const user = await prisma.user.findUnique({ where: { email: email } })

  const formData = new FormData();
  formData.append('email', user.email);
  formData.append('name', user.name);
  formData.append('username', user.username);
  formData.append('password', '121215testest121215');

  try {

    const url = new URL(request.url);
    console.log(url, 'url')
    // const response = await axios.post("http://localhost:3000/google/response", formData);
    const response = await axios.post("https://www.dealersalesassistant.ca/microsoft/response", formData);
    console.log(response.data);



  } catch (error) {
    console.error('An error occurred:', error.message);
    if (error.response) {
      console.error('Server responded with:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
  return json({ status: 'Form submitted' });

}

