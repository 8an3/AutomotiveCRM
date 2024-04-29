import { type ActionFunction, json, redirect, type LoaderFunction } from "@remix-run/node"
import { GetUser } from "~/utils/loader.server"
import {
  authSessionStorage,
  commitSession,
  destroySession,
  getSession,
} from "~/sessions/auth-session.server"

export async function action({ request }: ActionFunction) {
  let session = await getSession(request.headers.get("Cookie"))
  const payload = Object.fromEntries(await request.formData())
  const email = payload.email
  const name = payload.name
  const expiry = payload.expiry
  const user = await GetUser(email);
  const sessionEmail = session.get('email')
  if (!sessionEmail) {
    return redirect('/auth/login', { headers: { 'Set-Cookie': await destroySession(session) } })
  }
  console.log('User data:', user);
  session.set("email", email)
  session.set("expiry", expiry)
  session.set("name", name)
  return redirect('/auth/login', { headers: { 'Set-Cookie': await destroySession(session) } });
}

export async function loader({ request, params }: LoaderFunction) {
  let session = await getSession(request.headers.get("Cookie"))
  const email = session.get('email')
  if (!email) {
    return redirect('/auth/login', { headers: { 'Set-Cookie': await destroySession(session) } })
  } else {
    return redirect('/usercheck')

  }
}
