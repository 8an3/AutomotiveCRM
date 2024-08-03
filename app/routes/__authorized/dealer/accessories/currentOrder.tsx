import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import Purchase from '~/components/accessories/currentOrder';

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const user = await GetUser(email);
  if (!user) { redirect("/login"); }
  const orderId = user?.customerSync.orderId
  if (!orderId) { redirect('/dealer/accessories/search') }
  return redirect(`/dealer/accessories/newOrder/${orderId}`)
}
