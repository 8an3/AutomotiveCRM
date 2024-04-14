import { getSession, commitSession, authSessionStorage, destroySession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";

export default async function GetUserFromRequest(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email);
  if (!user) {
    await destroySession(session);
    return null;
  }
  return user;
}
