import slider from '~/styles/slider.css'
import { Outlet, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json, createCookie, redirect } from "@remix-run/node";
import secondary from "~/styles/secondary.css";
import global from "~/globals.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: global },


]
export default function Quote() {
  return (
    <>
      <div className="w-[100%] h-[100%] overflow-clip    bg-background  ">
        <Outlet />
      </div>
    </>
  );
}

