import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";



export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <main className="w-[100%] m-3">
      <Outlet />
    </main >
  )
}
