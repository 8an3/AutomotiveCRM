
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  User,
  Tags,
  Receipt,
  Binary,
  FileClock,
  Wrench,
  User2,
  CalendarDays
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate } from "@remix-run/react";
import { json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { Button } from "~/components";
import wrench from '~/images/favicons/wrench.svg'


export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const user = await GetUser(email);
  if (!user) {
    redirect("/login");
  }
  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData()
  const location = useLocation();
  const navigate = useNavigate()
  const pathname = location.pathname
  const orderId = user?.customerSync.orderId
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[50px] flex-col border-r  border-border bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4 mt-[45px]">


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'

                onClick={() => navigate("/dealer/service/dashboard")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg  bg-transparent  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/service/dashboard" ? 'bg-primary text-foreground ' : ''}`}
              >
                <File className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                onClick={() => navigate("/dealer/service/calendar")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg  bg-transparent  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/service/calendar" ? 'bg-primary text-foreground ' : ''}`}
              >
                <CalendarDays className="h-5 w-5" />
                <span className="sr-only">Calendar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Calendar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/service/waiters"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/service/waiters" ? 'bg-primary text-foreground ' : ''}`}
              >
                <FileClock className="h-5 w-5" />
                <span className="sr-only">Waiters</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Waiters</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/service/technician"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                ${pathname === "/dealer/service/technician" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Wrench className="h-5 w-5" />
                <span className="sr-only">Technician</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Technician Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/service/customerSync"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/service/customerSync" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <User2 className="h-5 w-5" />
                <span className="sr-only">Customer Sync</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customer Sync</TooltipContent>
          </Tooltip>

        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className='mt-[px]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: wrench },
]
