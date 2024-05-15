/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { dashboardLoader, dashboardAction, } from "~/components/actions/dashboardCalls";

import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, } from '@remix-run/node'
import secondary from "~/styles/secondary.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
];

export async function loader({ params, request }: DataFunctionArgs) {
  return null
}

export default function CustomerProfile() {
  return (
    <div className="w-full">
      <div className="mx-auto bg-[#09090b] " >
        <Outlet />
      </div>
    </div>
  );
}
