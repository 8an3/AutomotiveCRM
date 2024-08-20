import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";

export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <main className="min-h-screen min-w-screen max-h-screen max-w-screen gap-4 bg-muted/40 p-4 ">
      <Outlet />
    </main>
  )
}
