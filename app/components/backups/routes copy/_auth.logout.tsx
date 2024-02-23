import { requireUserSession } from "~/helpers";
//import { authenticator } from "~/services";
import { prisma } from "~/libs";
import { type LoaderFunctionArgs, type ActionArgs, json, redirect } from '@remix-run/node'
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'




export async function action({ request }: ActionArgs) {
  const userSession = await sessionGet(request.headers.get("Cookie"));

  if (!userSession) { return json({ status: 302, redirect: '/login' }); };

  if (!userSession) { return redirect('/login') }
  const email = userSession.get("email")
  const user = await getUserByEmail(email)
  if (!user) { return json({ status: 302, redirect: '/login' }) };

}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, { failureRedirect: "/login", }); const user = await model.user.query.getForSession({ id: userSession.id });

  if (!user) {
    return redirect('/login')
  } else {
    return redirect('/emails')
  }
}
