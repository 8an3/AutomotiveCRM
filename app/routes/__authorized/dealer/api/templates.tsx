import { json, type LoaderFunction } from '@remix-run/node';
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { Form, Link, Outlet, useFetcher, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import PaymentsCalc from './finance.blocked';
import { getSession } from '~/sessions/auth-session.server';

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user.email, }, });


  return getTemplates//json({ lockedData, finance })
}
