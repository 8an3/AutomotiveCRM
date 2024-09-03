import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { requireUserSession, getUserIsAllowed } from "~/helpers";
import { Separator } from "~/components";
import { SidebarNav } from "~/components/ui/sidebar-nav";
import { LampDesk} from 'lucide-react'


export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const user = await GetUser(email);
  if (!user) {    redirect("/login");  }
  const { userIsAllowed } = await requireUserSession(request, [
    "Administrator",
    "Manager",
  ]);
  if (!userIsAllowed) {
    return redirect(`/`);
  }
const whereRYa = params.dept
  return json({ user, whereRYa });
}


export default function NavMenuAdminAndMan() {
  const { user,whereRYa } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname

  const inventorySide = [
    {
      title: "Unit",
      to: `/dealer/${whereRYa}/inventory/units`,
    },
    {
      title: "PAC",
      to: `/dealer/${whereRYa}/inventory/pac`,
    },
  ]
  const customerSide = [
    {
      title: "Customers",
      to: `/dealer/${whereRYa}/customers/all`,
    },
  ]
  const reportsSide = [
    {
      title: "Commissions",
      to: `/dealer/${whereRYa}/reports/commissions`,
    },
    {
      title: "End Of Day",
      to: `/dealer/${whereRYa}/reports/endOfDay`,
    },
  ]
  const ordersSide = [
    {
      title: "Service",
      to: `/dealer/${whereRYa}/orders/service`,
    },
    {
      title: "PAC",
      to: `/dealer/${whereRYa}/orders/pac`,
    },
  ]
  const deptsSide = [
    {
      title: "Sales ",
      to: `/dealer/${whereRYa}/depts/sales`,
    },
    {
      title: "PAC ",
      to: `/dealer/${whereRYa}/depts/pac`,
    },
    {
      title: "Service ",
      to: `/dealer/${whereRYa}/depts/service`,
    },
    {
      title: "Service ",
      to: `/dealer/${whereRYa}/depts/service`,
    },
  ]

  const importExportSide = [
    {
      title: "Units",
      to: `/dealer/${whereRYa}/importexport/units`,
    },
    {
      title: "Client",
      to: `/dealer/${whereRYa}/importexport/clients`,
    },
    {
      title: "Quotes",
      to: `/dealer/${whereRYa}/importexport/quotes`,
    },
    {
      title: "PAC",
      to: `/dealer/${whereRYa}/importexport/pac`,
    },
  ]
  return (
    <div className=" space-y-6 p-10 pb-16 h-screen w-screen">
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{whereRYa} Section</h2>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />

    </div>
    <div className="  my-6" />
    {userIsManager && (
              <>
                  <NavLink
            to="/dealer/manager/depts/sales"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
    ${pathname.startsWith("/dealer/manager/depts/sales") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Dashboard
            <span className="sr-only">Dashboard</span>
          </NavLink>
          <NavLink
            to="/dealer/manager/scheduling/storeHours"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/manager/scheduling/storeHours") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Scheduling
          </NavLink>
          <NavLink
            to="/dealer/manager/csi"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/manager/csi") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            CSI
          </NavLink>
              </>
    )}
        {userIsADMIN && (
              <>
               <NavLink
            to="/dealer/admin/settings/general"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
    ${pathname.startsWith("/dealer/admin/settings/general") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Dashboard
            <span className="sr-only">Dashboard</span>
          </NavLink>
          <NavLink
            to="/dealer/admin/users/overview"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/admin/users/overview") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Users
          </NavLink>
              </>
    )}



    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-64 text-foreground">
        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Customers</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={customerSide} />
        </div>
        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Inventory</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={inventorySide} />
        </div>

        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Reports</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={reportsSide} />
        </div>

        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Depts</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={deptsSide} />
        </div>

        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Order</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={ordersSide} />
        </div>

        <div className='my-2' >
      <p className="font-bold tracking-tight text-foreground">Immport / Export</p>
      <Separator className="text-border border-border bg-border w-[95%] mb-3" />
        <SidebarNav items={importExportSide} />
        </div>
      </aside>
      <div className="flex-1  w-auto">
        <Outlet />
      </div>
    </div>
  </div>

  )
}

export const links: LinksFunction = ({params}) => [
  { rel: "icon", type: "image/svg", href: params.dept === 'service' ? '/favicons/wrench.svg' :  LampDesk },
]

export const meta = ({params}) => {
const whereRYa = params.dept

  return [
    { title: `${whereRYa} - Dealer Sales Assistant` },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};

/**  <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Import / Export</h1>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"        >
          <NavLink to="units"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/importexport/units" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Units
          </NavLink>
          <NavLink to="clients"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/importexport/" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Clients
          </NavLink>
          <NavLink to="quotes"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/importexport/" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Quotes
          </NavLink>
          <NavLink to="acc"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === "/dealer/admin/importexport/acc" ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}>
            Parts/Accessories
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </main> */
