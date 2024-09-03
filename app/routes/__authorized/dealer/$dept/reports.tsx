import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Reports</h1>
      </div>
      <div className="mx-auto grid w-full max-w-8xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"        >
          <NavLink to="endOfDay"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
            ${pathname === ("/dealer/admin/reports/endOfDay") ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}
          >
            End of Day
          </NavLink>
          <NavLink to="commissions"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
            ${pathname === ("/dealer/admin/reports/commissions") ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Commissions
          </NavLink>

        </nav>
        <Outlet />
      </div>
    </main>
  )
}
