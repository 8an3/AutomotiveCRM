import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, NavLink } from "@remix-run/react";
import {
  buttonVariants,
  Debug,
  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button
} from "~/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
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
  Settings2
} from "lucide-react"


export default function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname

  const docs = [
    { label: 'Glossary', value: 'Glossary', url: '/dealer/admin/importExport/documentation/Glossary' },
    { label: 'Inventory', value: 'inventory', url: '/dealer/admin/importExport/documentation/inventory' },
    { label: 'Clients', value: 'clients', url: '/dealer/admin/importExport/documentation/clients' },
    { label: 'Work Orders', value: 'workOrders', url: '/dealer/admin/importExport/documentation/workOrders' },
    { label: 'Work Orders Notes', value: 'workOrderNotes', url: '/dealer/admin/importExport/documentation/workOrderNotes' },
    { label: 'Work Orders Appts', value: 'workOrderApts', url: '/dealer/admin/importExport/documentation/workOrderApts' },
    { label: 'Work Orders Services', value: 'servicesOnWorkOrders', url: '/dealer/admin/importExport/documentation/servicesOnWorkOrders' },
    { label: 'Work Orders Tech Times', value: 'workOrderTechTimes', url: '/dealer/admin/importExport/documentation/workOrderTechTimes' },
    { label: 'Service Unit', value: 'serviceUnit', url: '/dealer/admin/importExport/documentation/serviceUnit' },
    { label: 'Communications', value: 'comm', url: '/dealer/admin/importExport/documentation/comm' },
    { label: 'Work Orders Tech Times', value: 'workOrderTechTimes', url: '/dealer/admin/importExport/documentation/workOrderTechTimes' },
    { label: 'PAC Orders', value: 'pacOrders', url: '/dealer/admin/importExport/documentation/pacOrders' },
    { label: 'Sales Deals', value: 'salesDeals', url: '/dealer/admin/importExport/documentation/salesDeals' },
    { label: 'Sales Notes', value: 'financeNote', url: '/dealer/admin/importExport/documentation/financeNote' },
    { label: 'Sales Payment', value: 'financePayment', url: '/dealer/admin/importExport/documentation/financePayment' },
    { label: 'Sales Deals', value: 'salesDeals', url: '/dealer/admin/importExport/documentation/salesDeals' },
    { label: 'Accessories', value: 'accessories', url: '/dealer/admin/importExport/documentation/accessories' },
    { label: 'Acc Order', value: 'accOrder', url: '/dealer/admin/importExport/documentation/accOrder' },
    { label: 'Payment', value: 'payment', url: '/dealer/admin/importExport/documentation/Payment' },
    { label: 'Order Inventory', value: 'orderInventory', url: '/dealer/admin/importExport/documentation/orderInventory' },
    { label: 'Client Apts', value: 'clientApts', url: '/dealer/admin/importExport/documentation/clientApts' },
    { label: 'User', value: 'user', url: '/dealer/admin/importExport/documentation/user' },
    { label: 'Dealer', value: 'dealer', url: '/dealer/admin/importExport/documentation/dealer' },
    { label: 'Notifications', value: 'notificationsUser', url: '/dealer/admin/importExport/documentation/notificationsUser' },
    { label: 'Dealer', value: 'dealer', url: '/dealer/admin/importExport/documentation/dealer' },
  ]
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Documentation</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground h-full max-h-[500px] overflow-y-auto" x-chunk="dashboard-04-chunk-0"        >
          {docs.map((api, index) => (
            <NavLink to={api.url}
              key={index}
              className={`flex items-center gap-2 text-lg font-semibold md:text-base
              ${pathname === api.url ? ' font-semibold text-primary ' : 'text-muted-foreground'}`}
            >
              {api.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </main>
  )
}
