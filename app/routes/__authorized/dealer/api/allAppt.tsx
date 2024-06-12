import { json, type LoaderFunction, } from '@remix-run/node';
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const appt = await prisma.clientApts.findMany({
    where: { userEmail: email }
  })
  return json({ appt })
}
