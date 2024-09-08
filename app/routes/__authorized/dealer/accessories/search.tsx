import React, { useEffect, useRef, useState } from "react"
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
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Outlet, Link, useFetcher, useActionData, useSubmit, Form } from "@remix-run/react"
import { LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/libs"
import { getSession } from "~/sessions/auth-session.server"
import { GetUser } from "~/utils/loader.server"

export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.clientfile.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.email?.toLowerCase().includes(q) ||
      result.phone?.includes(q) ||
      result.firstName?.toLowerCase().includes(q) ||
      result.lastName?.toLowerCase().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}

export async function action({ request, params }: LoaderFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)

  if (formPayload.intent === 'createNewOrder') {
    const order = await prisma.accOrder.create({
      data: {
        userName: user.name,
        userEmail: email,
        dept: 'Accessories',
        status: 'Quote',
        total: 0.00,
        sellingDept: user.dept,
        clientfileId: formPayload.clientfileId,
      }
    })
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: order.id }
    })
    return redirect(`/dealer/accessories/newOrder/${order.id}`)
  }
  return null
}

export default function SearchCustomers() {
  let ref = useRef();
  let search = useFetcher();
  let fetcher = useFetcher();
  const submit = useSubmit();


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Card x-chunk="dashboard-05-chunk-3 " className='mx-5 w-[95%] md:w-[600px]'>
      <CardHeader className="px-7">
        <CardTitle>
          <div className='flex justify-between items-center'>
            <p>Customers</p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Create New Customer</span>
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          <search.Form method="get" action='/dealer/accessories/search'>
            <div className="relative ml-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={ref}
                type="search"
                name="q"
                onChange={e => {
                  search.submit(e.currentTarget.form);
                }}
                autoFocus
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </search.Form>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className='border-border'>
              <TableHead>
                Customer
              </TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                Phone
              </TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                Address
              </TableHead>
              <TableHead className="text-center hidden md:table-cell">
                Actions
              </TableHead>
              <TableHead className="text-right">
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
            {search.data &&
              search.data.map((result, index) => (
                <TableRow key={index} className="hover:bg-accent border-border">
                  <TableCell>
                    <div className="font-medium">
                      {capitalizeFirstLetter(result.firstName)}{" "}
                      {capitalizeFirstLetter(result.lastName)}
                    </div>
                    <div className="text-sm text-muted-foreground ">
                      {result.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-center  hidden sm:table-cell">
                    {result.phone}
                  </TableCell>
                  <TableCell className="text-center  hidden md:table-cell">
                    {result.address}
                  </TableCell>
                  <TableCell className="flex text-center text-lg text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Form method='post'                         >
                          <Button size='icon' variant='ghost' name='intent' value='createNewOrder' className="hover:bg-primary mr-3">
                            <Plus className="h-5 w-5" />
                          </Button>
                          <input type='hidden' name='email' value={result.email} />
                          <input type='hidden' name='clientfileId' value={result.id} />
                        </Form>
                      </TooltipTrigger>
                      <TooltipContent side="right">Create New Order</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={`/dealer/customer/${result.id}`} className="hover:bg-primary w-5 h-5 "                        >
                          <Button size='icon' variant='ghost' className="hover:bg-primary">
                            <User className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Customer Profile</TooltipContent>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              ))}

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}



export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "Search || PAC || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
