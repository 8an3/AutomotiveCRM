import { requireUserSession } from "~/helpers";
import { prisma } from "~/libs";
import { type LoaderFunctionArgs, type ActionArgs, json, redirect } from '@remix-run/node'
import { getSession, destroySession } from '~/sessions/auth-session.server';
import GetUserFromRequest from "~/utils/auth/getUser";

export async function action({ request }: ActionArgs) {
  const user = await GetUserFromRequest(request);
  if (!user) { return redirect('/login'); }
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
  const user = await GetUserFromRequest(request);
  if (!user) {
    return redirect('/login')
  } else {
    return redirect('/checkscription', {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
