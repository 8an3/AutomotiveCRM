/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { dashboardLoader, dashboardAction, } from "~/components/actions/dashboardCalls";

import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, } from '@remix-run/node'

export async function loader({ params, request }: DataFunctionArgs) {
  return null
}

export default function CustomerProfile() {
  return (
    <div className="w-full">
      <div className="mx-auto bg-slate12 " >
        <Outlet />
      </div>
    </div>
  );
}
