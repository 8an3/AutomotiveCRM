import { requireUserSession } from "~/helpers";
//import { authenticator } from "~/services";
import { prisma } from "~/libs";
import { type LoaderFunctionArgs, type ActionArgs, json, redirect } from '@remix-run/node'
import { getSession, destroySession } from '~/sessions/auth-session.server';

import { model } from '../models'
import { GetUser } from "~/utils/loader.server";



export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session) { return json({ status: 302, redirect: '/' }); };

  if (!session) { return redirect('/') }
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) {
    return json({ status: 302, redirect: '/' })
  }
  else {
    return redirect('/', {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  if (!user) {
    return redirect('/')
  } else {
    return redirect('/', {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
