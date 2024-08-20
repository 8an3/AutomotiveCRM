import { ActionArgs, ActionFunctionArgs, LoaderFunction, UploadHandler, json, redirect, } from "@remix-run/node";
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { GetUser } from '~/utils/loader.server';
import { getSession } from "~/sessions/auth-session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  return redirect(`/dealer/admin/reports/endOfDay`)
};
