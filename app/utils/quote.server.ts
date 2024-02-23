import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const quoteCookie = createCookie("quote-cookie", {
  maxAge: 604_800, // one week
});
