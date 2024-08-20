import { authSessionStorage } from "~/sessions/auth-session.server";
import { Authenticator } from "remix-auth";


export let authenticator = new Authenticator<User>(authSessionStorage);
