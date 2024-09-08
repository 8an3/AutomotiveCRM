import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink, useParams } from "@remix-run/react";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { requireUserSession, getUserIsAllowed } from "~/helpers";
import { Separator, Button, buttonVariants, } from "~/components";
import { Archive, LampDesk } from 'lucide-react'
import { cn } from "~/components/ui/utils";
import { Fragment } from 'react'
import archive from '~/images/favicons/archive.svg'

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: archive },
];

export default function NavMenuAdminAndMan() {
  const { user } = useLoaderData()
  const location = useLocation();
  const pathname = location.pathname
  const params = useParams();

  const inventorySide = [
    {
      title: "Unit Inventory",
      to: `/dealer/${params.dept}/inventory/units`,
    },
    {
      title: "PAC Inventory",
      to: `/dealer/${params.dept}/inventory/pac`,
    },
  ]
  const ordersSide = [
    {
      title: "Service Work Orders",
      to: `/dealer/${params.dept}/orders/service`,
    },
    {
      title: "Service Work Orders",
      to: `/dealer/${params.dept}/orders/service`,
    },
    {
      title: "PAC Orders",
      to: `/dealer/${params.dept}/orders/pac`,
    },
  ]
  const importExportSide = [
    {
      title: "Import / Export",
      to: `/dealer/${params.dept}/importexport/units`,
    },
  ]


  const bullshit = [
    {
      title: "Store Hours",
      to: `/dealer/${params.dept}/scheduling/storeHours`,
    },
    {
      title: "Employee Scheduling",
      to: `/dealer/${params.dept}/scheduling/storeHours`,
    },
    {
      title: "CSI Surveys",
      to: `/dealer/${params.dept}/csi`,
    },
    {
      title: "Commissions Reports",
      to: `/dealer/${params.dept}/reports/commissions`,
    },
    {
      title: "End Of Day Reports",
      to: `/dealer/${params.dept}/reports/endOfDay`,
    },
    {
      title: "Employees",
      to: `/dealer/${params.dept}/users/dashboard`,
    },

  ]
  const dashboards = [
    {
      title: "Depts",
      to: `/dealer/${params.dept}/depts/sales`,
    },

    {
      title: "Customers",
      to: `/dealer/${params.dept}/customers/all`,
    },
  ]
  /**  {
      title: "Sales",
      to: `/dealer/${params.dept}/depts/sales`,
    },
    {
      title: "PAC",
      to: `/dealer/${params.dept}/depts/pac`,
    },
    {
      title: "Service",
      to: `/dealer/${params.dept}/depts/service`,
    },
    {
      title: "Administrator",
      to: `/dealer/${params.dept}/settings/general`,
    }, */
  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );
  const userIsADMIN = user.positions.some(
    (pos) => pos.position === 'Administrator'
  );

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{capitalizeFirstLetter(params.dept)} Section</h2>
        </div>
        <Separator className="my-6 bg-border border-border text-border" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-[250px]">
            <p className='text-foreground'>Menu</p>
            <SidebarNav items={dashboards} />
            <Separator className='my-1 bg-border border-border text-border' />
            <SidebarNav items={inventorySide} />
            <Separator className='my-1 bg-border border-border text-border' />
            <SidebarNav items={ordersSide} />
            <Separator className='my-1 bg-border border-border text-border' />
            <SidebarNav items={importExportSide} />
            <Separator className='my-1 bg-border border-border text-border' />
            <SidebarNav items={bullshit} />
          </aside>
          <div className="flex-1 lg:max-w-90[%]">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}


export const meta = () => {

  return [
    { title: `Admin / Manager Dashboard || Dealer Sales Assistant` },
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


interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
  const params = useParams();
  console.log(pathname)
  return (
    <nav
      className={cn(
        "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
        className
      )}
      {...props}
    >
      {items.map((item) => (

        <Fragment key={item.to}>
          <Link
            to={item.to}
            className="justify-start" >
            <Button variant='ghost'
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.to
                  ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
                  : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
                "justify-start w-[90%] "
              )} >
              {item.title}
            </Button>
          </Link>
          {item.title === "Employees" && pathname.includes(`/dealer/${params.dept}/users`) && (
            <nav className="grid gap-4 text-sm text-muted-foreground ml-6">
              <NavLink
                to={`/dealer/${params.dept}/users/dashboard`}
                className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/users/addUser`}
                className={`flex items-center gap-2 md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/addUser` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Add Employee
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/users/userRoles`}
                className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/userRoles` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Employee Roles
              </NavLink>
            </nav>
          )}
          {item.title === "Depts" && pathname.includes(`/dealer/${params.dept}/depts`) && (
            <nav className="grid gap-3  text-sm text-foreground">
              <NavLink
                to={`/dealer/${params.dept}/depts/sales`}
                className={`flex items-center gap-2  md:text-base  ml-[30px]
              ${pathname === `/dealer/${params.dept}/depts/sales` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Sales
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/depts/pac`}
                className={`flex items-center gap-2  md:text-base   ml-[30px]
              ${pathname === `/dealer/${params.dept}/depts/pac` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                PAC
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/depts/service`}
                className={`flex items-center gap-2   md:text-base  ml-[30px]
              ${pathname === `/dealer/${params.dept}/depts/service` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Service
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/settings/general`}
                className={`flex items-center gap-2  md:text-base  ml-[30px]
              ${pathname === `/dealer/${params.dept}/depts/user-roles` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]'}`}
              >
                Admin
              </NavLink>
            </nav>
          )}
          {item.title === "Import / Export" && pathname.includes(`/dealer/${params.dept}/importexport`) && (
            <nav className="grid gap-4 text-sm text-muted-foreground ml-6">
              <NavLink
                to={`/dealer/${params.dept}/importexport/units`}
                className={`flex items-center gap-2  md:text-base  ml-[30px]
              ${pathname === `/dealer/${params.dept}/importexport/units` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Units
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/importexport/clients`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/importexport/clients` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Clients
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/importexport/quotes`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/importexport/quotes` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Quotes
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/importexport/pac`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/importexport/pac` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                PAC
              </NavLink>
            </nav>
          )}
          {item.title === "Customers" && pathname.includes(`/dealer/${params.dept}/customers`) && (
            <nav className="grid gap-4 text-sm text-muted-foreground ml-6">
              <NavLink
                to={`/dealer/${params.dept}/customers/all`}
                className={`flex items-center gap-2  md:text-base  ml-[30px]
              ${pathname === `/dealer/${params.dept}/customers/all` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                All Depts
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/customers/sales`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/customers/sales` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Sales
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/customers/service`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/customers/service` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                Service
              </NavLink>
              <NavLink
                to={`/dealer/${params.dept}/importexport/pac`}
                className={`flex items-center gap-2  md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/customers/pac` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}
              >
                PAC
              </NavLink>
            </nav>
          )}
        </Fragment>
      ))

      }
    </nav >
  )
}

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const user = await GetUser(email);
  if (!user) { redirect("/login"); }


  return json({ user })
}

