import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";



export default function SettingsLayout() {
  return (
    <main className="">
      <div className="mx-auto grid w-full max-w-[90%] gap-2">
        <Outlet />
      </div>
    </main>
  )
}
