
import { createCookie } from "@remix-run/node";

export const layoutCookie = createCookie("react-resizable-panels:layout", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 365 * 10, // 10 years to simulate "infinite" expiration
});

export const collapsedCookie = createCookie("react-resizable-panels:collapsed", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
});
