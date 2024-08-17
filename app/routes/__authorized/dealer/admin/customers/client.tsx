import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError } from "@remix-run/react";
import {
  buttonVariants,
  Debug,
  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button,
  Input,
  Checkbox
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
  Settings2,
  Edit
} from "lucide-react"
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { json, LinksFunction, redirect } from "@remix-run/node";
import { createCacheHeaders, createSitemap } from "~/utils";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail } from '~/utils/user.server'
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import useSWR from 'swr'
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import tablecss from '~/styles/table.css'


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tablecss },
]

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const metrics = await model.admin.query.getMetrics();
  const dealer = await prisma.dealer.findUnique({
    where: { id: 1 }
  })
  const userEmail = user?.email
  const comsRecords = await prisma.comm.findMany({ where: { userEmail: user.email, }, });
  return json(
    { user, metrics, dealer, comsRecords },
    { headers: createCacheHeaders(request) }
  );
}



export async function action({ request }: ActionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent

  if (intent === 'inputDealerLogo') {
    const logo = await prisma.dealerLogo.update({
      where: { id: 1 },
      data: {
        dealerLogo: formPayload.dealerLogo
      }
    })
    return json({ logo })
  }
  if (intent === 'updateDealerFeesAdmin') {

    const update = await prisma.dealer.update({
      where: {
        id: 1
      },
      data: {
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userLicensing: formData.userLicensing,
        userFinance: formData.userFinance,
        userDemo: formData.userDemo,
        userGasOnDel: formData.userGasOnDel,
        userOMVIC: formData.userOMVIC,
        userOther: formData.userOther,
        userTax: formData.userTax,
        userAirTax: formData.userAirTax,
        userTireTax: formData.userTireTax,
        userGovern: formData.userGovern,
        userPDI: formData.userPDI,
        userLabour: formData.userLabour,
        userMarketAdj: formData.userMarketAdj,
        userCommodity: formData.userCommodity,
        destinationCharge: formData.destinationCharge,
        userFreight: formData.userFreight,
        userAdmin: formData.userAdmin,
      }
    })
    return update;
  }
  if (intent === 'updateUser') {
    delete Input.intent;

    const saveUser = await updateUser(Input)
    const saveDealer = await updateDealerFees(Input)
    return ({ saveUser, saveDealer })
  }

  if (intent === 'updateDealerInfo') {
    const dealer = await prisma.dealer.update({
      data: {
        dealerName: formData.dealerName,
        dealerAddress: formData.dealerAddress,
        dealerCity: formData.dealerCity,
        dealerProv: formData.dealerProv,
        dealerPostal: formData.dealerPostal,
        dealerPhone: formData.dealerPhone,
        dealerEmail: formData.dealerEmail,
        dealerContact: formData.dealerContact,
        dealerAdminContact: formData.dealerAdminContact,
        dealerEmailAdmin: formData.dealerEmailAdmin,
        vercel: formData.vercel,
        github: formData.github,
      },
      where: {
        id: 1
      }
    })
    return dealer
  }
  return null
}


export default function SettingsGenerral() {
  const { user, dealer, } = useLoaderData()
  const submit = useSubmit();
  const navigate = useNavigate()
  let ref = useRef();

  const [pageIndex, setPageIndex] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [newData, setNewData] = useState();
  const swrFetcher = url => axios.get(url).then(res => res.data)
  const { data: partsData } = useSWR(`/dealer/api/customers/client/${pageIndex}/${perPage}`, swrFetcher, { refreshInterval: 20000 });
  console.log(tableData, 'table')
  useEffect(() => { if (partsData) { setTableData(partsData) } }, [partsData]);

  const [selected, setSelected] = useState([]);

  const userData = [
    { name: 'firstName', defaultValue: selected.firstName, label: 'First Name' },
    { name: 'lastName', defaultValue: selected.lastName, label: 'Last Name' },
    { name: 'name', defaultValue: selected.name, label: 'Name' },
    { name: 'email', defaultValue: selected.email, label: 'Email' },
    { name: 'phone', defaultValue: selected.phone, label: 'Phone' },
    { name: 'address', defaultValue: selected.address, label: 'Address' },
    { name: 'city', defaultValue: selected.city, label: 'City' },
    { name: 'postal', defaultValue: selected.postal, label: 'Postal' },
    { name: 'province', defaultValue: selected.province, label: 'Province' },
    { name: 'dl', defaultValue: selected.dl, label: 'Drivers License' },
    { name: 'typeOfContact', defaultValue: selected.typeOfContact, label: 'Type of Contact' },
    { name: 'timeToContact', defaultValue: selected.timeToContact, label: 'Time of Contact' },
    { name: 'billingAddress', defaultValue: selected.billingAddress, label: 'Billing Address' },
  ]
  const totalOrders = tableData.total;
  const totalPages = Math.ceil(totalOrders / perPage);
  const maxPages = 5;
  const halfMaxPages = Math.floor(maxPages / 2);
  const pageNumbers = [];

  let startPage = Math.max(pageIndex - halfMaxPages, 1);
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">

        <CardHeader className='bg-muted/50'>
          <CardTitle>Sales Customers</CardTitle>
          <CardDescription className='flex-col'>
            <p className='text-muted-foreground'>
              Any client file that has a quote open or sale closed will be displayed here.
            </p>
            <div className="relative flex-1 md:grow-0 mt-3 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={ref}
                type="search"
                name="q"
                onChange={(e) => {
                  let q = e.currentTarget.value
                  q = q.toLowerCase();
                  let result = tableData.finance.filter(
                    (result) =>
                      result.firstName?.toLowerCase().includes(q) ||
                      result.lastName?.toLowerCase().includes(q) ||
                      result.brand?.toLowerCase().includes(q) ||
                      result.model?.toLowerCase().includes(q) ||
                      result.email?.toLowerCase().includes(q) ||
                      result.address?.toLowerCase().includes(q) ||
                      result.phone?.includes(q)
                  );
                  setNewData(result)
                }}
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className=' mt-3 w-auto max-w-[700px]'>
          <Table className='overflow-x-scroll mt-3 w-auto max-w-[400px]'>
            <TableHeader>
              <TableRow className='border-border'>
                <TableHead className="w-[250px] mx-auto text-center">First Name</TableHead>
                <TableHead className="w-[250px] mx-auto text-center">Last Name</TableHead>
                <TableHead className="text-center w-[150px]">Actions</TableHead>
                <TableHead className="hidden md:table-cell w-[250px] mx-auto text-center">Email</TableHead>
                <TableHead className="w-[250px] mx-auto text-center">Phone</TableHead>
                <TableHead className="hidden sm:table-cell  w-[200px] mx-auto text-center">Address</TableHead>
                <TableHead className="hidden sm:table-cell w-[200px] mx-auto text-center">City</TableHead>
                <TableHead className="hidden sm:table-cell w-[150px] mx-auto text-center">Province</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newData ? (
                <>
                  {newData &&
                    newData.map((result, index) => (
                      <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                        <TableCell className="tableCell w-auto min-w-[100px]">
                          <p className='mx-auto text-center'>{result.firstName}</p>
                        </TableCell>
                        <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[100px]">
                          <p className='mx-auto text-center'>{result.lastName}</p>
                        </TableCell>
                        <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                          <p className='mx-auto text-center'>{result.email}</p>
                        </TableCell>
                        <TableCell className="tableCell text-right  w-auto min-w-[100px]">
                          <p className='mx-auto text-center'>{result.phone}</p>
                        </TableCell>
                        <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                          <p className='mx-auto text-center'>{result.address}</p>
                        </TableCell>
                        <TableCell className="tableCell text-right  w-auto min-w-[100px]">
                          <p className='mx-auto text-center'>{result.city}</p>
                        </TableCell>
                        <TableCell className="tableCell text-right  w-auto min-w-[50px]">
                          <p className='mx-auto text-center'>{result.province}</p>
                        </TableCell>
                        <TableCell className="text-right flex">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableDialog userData={userData} setSelected={setSelected} result={result} />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Edit Custoner
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="mr-3 hover:bg-primary"
                                onClick={() => {
                                  navigate(`/dealer/customer/${result.clientfileId}/${result.id}`)
                                }}
                              >
                                <File className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Customer File
                            </TooltipContent>
                          </Tooltip>

                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ) : (
                <> {tableData.finance &&
                  tableData.finance.map((result, index) => (
                    <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                      <TableCell className="tableCell w-auto min-w-[100px]">
                        <p className='mx-auto text-center'>{result.firstName}</p>
                      </TableCell>
                      <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[100px]">
                        <p className='mx-auto text-center'>{result.lastName}</p>
                      </TableCell>
                      <TableCell className="text-right flex">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableDialog userData={userData} setSelected={setSelected} result={result} />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Edit Custoner
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="mr-3 hover:bg-primary my-auto"
                              onClick={() => {
                                navigate(`/dealer/customer/${result.clientfileId}/${result.id}`)
                              }}
                            >
                              <File className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Customer File
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                        <p className='mx-auto text-center'>{result.email}</p>
                      </TableCell>
                      <TableCell className="tableCell text-right  w-auto min-w-[100px]">
                        <p className='mx-auto text-center'>{result.phone}</p>
                      </TableCell>
                      <TableCell className="tableCell text-right  w-auto min-w-[200px]">
                        <p className='mx-auto text-center'>{result.address}</p>
                      </TableCell>
                      <TableCell className="tableCell text-right  w-auto min-w-[100px]">
                        <p className='mx-auto text-center'>{result.city}</p>
                      </TableCell>
                      <TableCell className="tableCell text-right  w-auto min-w-[50px]">
                        <p className='mx-auto text-center'>{result.province}</p>
                      </TableCell>
                    </TableRow>
                  ))}</>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
          <div className='mx-auto mt-4'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className='cursor-pointer'
                    isActive={pageIndex > 1}
                    onClick={() => handlePageChange(pageIndex - 1)}
                  />
                </PaginationItem>
                {pageNumbers.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === pageIndex}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {endPage < totalPages && (
                  <>
                    <PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    isActive={pageIndex < totalPages}
                    onClick={() => handlePageChange(pageIndex + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>

      </Card>

    </div>
  )
}


function TableDialog({ userData, setSelected, result }) {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="mr-3 hover:bg-primary my-auto"
          onClick={() => {
            setSelected(result)
          }}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border h-auto max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client Finance Info</DialogTitle>
          <DialogDescription>
            Make changes to the profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form method='post' className='max-w-sm' >
          {userData.map((user, index) => (
            <div key={index} className="relative mt-4">
              <Input
                name={user.name}
                defaultValue={user.defaultValue}
                className={` bg-background text-foreground border border-border`}
              />
              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{user.label}</label>
            </div>
          ))}

          <Button variant='outline' type='submit' name='intent' value='update-user' className="mt-5 ml-auto justify-end">
            Save
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
