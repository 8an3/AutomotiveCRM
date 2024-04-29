import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { model } from "~/models";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { GetUser } from "~/utils/loader.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  return ({ user })

}
