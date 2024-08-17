import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";
import {
  buttonVariants,
  Debug,
  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button,
  Input
} from "~/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { configAdmin, configSite } from "~/configs";
import { requireUserSession, getUserIsAllowed } from "~/helpers";
import { RootDocumentBoundary } from "~/root";
import { cn, createSitemap } from "~/utils";
import { redirect, json } from "@remix-run/node";
import { prisma } from "~/libs";
import Sidebar, { adminSidebarNav } from "~/components/shared/sidebar";
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { HeaderUserMenu } from "~/components/shared/userNav";
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'
import { Separator } from "~/components/ui/separator"
import { SidebarNav } from "~/components/ui/sidebar-nav"
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";
import tailwind from "~/styles/tailwind.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
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
  Clipboard,
  Settings2,
  Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { FaCircleUser } from "react-icons/fa6";


export const handle = createSitemap();

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const symbol = user.positions[0].position
  console.log(symbol, 'useradmin')

  if (symbol !== 'Administrator' && symbol !== 'Manager' && symbol !== 'Editor') {
    return redirect(`/`);
  } else {
    return json({ user, });
  }
}

export async function action({ request }: ActionArgs) {
  const { userIsAllowed } = await requireUserSession(request, [
    "Administrator",
    "Manager",
    "Editor",
  ]);
  if (!userIsAllowed) {
    return redirect(`/`);
  }
}

export default function Dashboard() {
  const { user } = useLoaderData()
  const location = useLocation();
  const navigate = useNavigate()
  const pathname = location.pathname
  const orderId = user?.customerSync.orderId
  /**
   * /dealer/admin/acc
   * /dealer/admin/parts
   * /dealer/admin/sales
   * /dealer/admin/Service
   */
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden ">
      <header className="sticky top-0 flex h-[35px] items-center gap-4 border-b border-border  bg-background px-4 md:px-6">
        <nav className="hidden ml-[35px] flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <NavLink
            to="/dealer/admin/settings/general"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
    ${pathname.startsWith("/dealer/admin/settings/general") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Settings
            <span className="sr-only">Settings</span>
          </NavLink>
          <NavLink
            to="/dealer/admin/users/overview"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/admin/users/overview") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Users
          </NavLink>
          <NavLink
            to="/dealer/admin/customers/sales"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/admin/customers/sales") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Customers
          </NavLink>
          <NavLink
            to="/dealer/admin/depts/sales"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/admin/depts/sales") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Dept's
          </NavLink>
          <NavLink
            to="/dealer/admin/reports/endOfDay"
            className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname.startsWith("/dealer/admin/reports/endOfDay") ? ' text-foreground ' : 'text-muted-foreground'}`}
          >
            Reports
          </NavLink>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden ml-auto"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link to="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

      </header>
      <Outlet />
    </div>

  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/wrench.svg' },
]
