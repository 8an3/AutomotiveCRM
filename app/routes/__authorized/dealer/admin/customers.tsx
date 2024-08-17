import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";

export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Customers</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"        >
          <NavLink to="sales"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/customers/sales" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}
          >
            Sales
          </NavLink>
          <NavLink to="service"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/customers/service" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}
          >
            Service
          </NavLink>
          <NavLink to="parts"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/customers/parts" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Parts
          </NavLink>
          <NavLink to="accessories"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/customers/accessories" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Accessories
          </NavLink>
          <NavLink to="client"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/customers/client" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Client
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </main>
  )
}
