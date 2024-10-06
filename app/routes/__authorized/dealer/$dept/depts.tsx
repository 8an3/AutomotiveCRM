import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";



export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <main className=" bg-background m-">
      <div className="mx-auto grid  gap-2">
        <Outlet />
      </div>
    </main>
  )
}
