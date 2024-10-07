import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";



export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <div className="mx-auto grid w-full items-start gap-6 m-10">
      <Outlet />
    </div>
  )
}
