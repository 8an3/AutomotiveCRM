import { requireUserSession } from "~/helpers";
//import { authenticator } from "~/services";
import { prisma } from "~/libs";
import { type LoaderFunctionArgs, type ActionArgs, json, redirect } from '@remix-run/node'
import { getSession, destroySession } from '../sessions/auth-session.server';
import { model } from '../models'




export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session) { return json({ status: 302, redirect: '/login' }); };

  if (!session) { return redirect('/login') }
  const email = session.get("email")
  const user = await model.user.query.getForSession({ email: email });
  if (!user) {
    return json({ status: 302, redirect: '/login' })
  }
  else {
    return redirect('/emails', {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  if (!user) {
    return redirect('/login')
  } else {
    return redirect('/emails', {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
