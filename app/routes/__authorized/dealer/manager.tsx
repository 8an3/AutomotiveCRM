
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
  CalendarDays,
  Shirt,
  WrenchIcon,
  DollarSign,
  Cog,
  Calendar,
  Clipboard
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import Purchase from '~/components/accessories/currentOrder';
import { Button } from "~/components";
import { CalendarClock } from "lucide-react";
import { Download } from "lucide-react";


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
                onClick={() => navigate("/dealer/manager/acc")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg  bg-transparent  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/acc" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Shirt className="h-5 w-5" />
                <span className="sr-only">Accessories</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Accessories</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'

                onClick={() => navigate("/dealer/manager/parts")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg  bg-transparent  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/parts" ? 'bg-primary text-foreground ' : ''}`}
              >
                <WrenchIcon className="h-5 w-5" />
                <span className="sr-only">Parts</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Parts</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/sales"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/sales" ? 'bg-primary text-foreground ' : ''}`}
              >
                <DollarSign className="h-5 w-5" />
                <span className="sr-only">Sales</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Sales</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/Service"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                ${pathname === "/dealer/manager/Service" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Cog className="h-5 w-5" />
                <span className="sr-only">Service</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Service</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/CSI"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/CSI" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <Clipboard className="h-5 w-5" />
                <span className="sr-only">CSI</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>CSI</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/salesSched"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/salesSched" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <Calendar className="h-5 w-5" />
                <span className="sr-only">Sales Sched</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Sales Sched</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/storeHours"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/storeHours" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <CalendarClock className="h-5 w-5" />
                <span className="sr-only">Store Hours</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Store Hours</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/importExport"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/importExport" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">Import Export</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>Import Export</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/manager/endOfDay"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/manager/endOfDay" ? 'bg-primary text-foreground  ' : ''}`}
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">End of Day Reports</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className='text-foreground'>End of Day Reports</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className='mt-[30px]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/wrench.svg' },
]
