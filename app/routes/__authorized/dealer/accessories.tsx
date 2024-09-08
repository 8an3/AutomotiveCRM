
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
  Binary
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
import { prisma } from "~/libs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import Purchase from '~/components/accessories/currentOrder';
import { Button } from "~/components";
import shirt from '~/images/favicons/shirt.svg'

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: shirt },
]


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
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4 mt-[40px] ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                disabled={!orderId}
                onClick={() => navigate("/dealer/accessories/currentOrder")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg  bg-transparent  text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/currentOrder" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Receipt className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Customer Sync</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/order"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/order" ? 'bg-primary text-foreground ' : ''}`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/search"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                ${pathname === "/dealer/accessories/search" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Searh Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/products"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/products" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/labelPrinter"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/labelPrinter" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Tags className="h-5 w-5" />
                <span className="sr-only">Label Maker</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Label Maker</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/inventoryCounter"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/inventoryCounter" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Binary className="h-5 w-5" />
                <span className="sr-only">Inventory Counter</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Inventory Counter</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dealer/accessories/receiving"
                className={`flex h-9 w-9 items-center justify-center rounded-lg    text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8
                  ${pathname === "/dealer/accessories/receiving" ? 'bg-primary text-foreground ' : ''}`}
              >
                <Truck className="h-5 w-5" />
                <span className="sr-only">Receiving</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Receiving</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
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

