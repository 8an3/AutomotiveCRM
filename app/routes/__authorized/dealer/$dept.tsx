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
      to: `/dealer/sales/inventory`,
    },
    {
      title: "PAC Inventory",
      to: `/dealer/accessories/products`,
    },
  ]
  const ordersSide = [
    {
      title: "Service Work Orders",
      to: `/dealer/service/dashboard`,
    },
    {
      title: "PAC Orders",
      to: `/dealer/accessories/order`,
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
      to: `/dealer/${params.dept}/scheduling/hours`,
    },
    {
      title: "Employee Scheduling",
      to: `/dealer/${params.dept}/scheduling/employee`,
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
  const admin = [

    {
      title: "Settings",
      to: `/dealer/admin/settings/general`,
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
      <div className="hidden p-10 space-y-6 pb-16 md:block w-[100%] h-[100%] overflow-clip ">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{capitalizeFirstLetter(params.dept)} Section</h2>
        </div>
        <Separator className="my-6 bg-border border-border text-border" />
        <div className="flex flex-col space-y-5 lg:flex-row lg:space-y-0">
          <aside className="-mx-4 lg:w-[215px]">
            <p className='text-foreground ml-[12px]'>Menu</p>
            <SidebarNav items={admin} />
            <Separator className='my-1 bg-border border-border text-border' />
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
          <div className=" m-5">
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
        "flex space-x-2 flex-row max-w-[100%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
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
              <NavLink to={`/dealer/${params.dept}/users/dashboard`}  >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] '}`}>
                  Dashboard
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/users/addUser`} >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start'}`}>
                  Add Employee
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/users/userRoles`} >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Employee Roles
                </Button>
              </NavLink>
            </nav>
          )}
          {item.title === "CSI Surveys" && pathname.includes(`/dealer/${params.dept}/csi`) && (
            <nav className="grid gap-4 text-sm text-muted-foreground ml-6">
              <NavLink to={`/dealer/${params.dept}/users/dashboard`}              >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Sales
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/users/addUser`}>
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start'}`}>
                  PAC
                </Button>

              </NavLink>
              <NavLink to={`/dealer/${params.dept}/users/userRoles`}              >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Service
                </Button>
              </NavLink>
            </nav>
          )}
          {item.title === "Depts" && pathname.includes(`/dealer/${params.dept}/depts`) && (
            <nav className="grid gap-3  text-sm text-foreground">
              <NavLink to={`/dealer/${params.dept}/depts/sales`}   >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Sales
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/depts/pac`}  >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  PAC
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/depts/service`}  >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Service
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/depts/admin`}  >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%] justify-start '}`}>
                  Admin
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/depts/finance`}   >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Finance
                </Button>
              </NavLink>
            </nav>
          )}
          {item.title === "Import / Export" && pathname.includes(`/dealer/${params.dept}/importexport`) && (
            <nav className="grid gap-4 text-sm text-muted-foreground ml-6">
              <NavLink to={`/dealer/${params.dept}/importexport/units`} >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Units
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/importexport/clients`}   >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Clients
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/importexport/quotes`}    >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Quotes
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/importexport/pac`}    >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  PAC
                </Button>
              </NavLink>
              <NavLink to={`/dealer/${params.dept}/importexport/documentation/Glossary`}  >
                <Button variant='ghost' className={`flex items-center gap-2   md:text-base ml-[30px]
              ${pathname === `/dealer/${params.dept}/users/dashboard` ? 'font-semibold text-primary hover:bg-muted/50 w-[90%] ' : 'hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  justify-start'}`}>
                  Database Documentation
                </Button>
              </NavLink>
            </nav>
          )}
        </Fragment>
      ))
      }
    </nav >
  )
}

/**  {item.title === "Customers" && pathname.includes(`/dealer/${params.dept}/customers`) && (
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
          )} */

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const user = await GetUser(email);
  if (!user) { redirect("/login"); }


  return json({ user })
}

