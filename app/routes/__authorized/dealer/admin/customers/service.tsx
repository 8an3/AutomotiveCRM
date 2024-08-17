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
  const { data: partsData } = useSWR(`/dealer/api/customers/sales/${pageIndex}/${perPage}`, swrFetcher, { refreshInterval: 20000 });
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
    { name: 'typeOfContact', defaultValue: selected.typeOfContact, label: 'Type Of Contact' },
    { name: 'timeToContact', defaultValue: selected.timeToContact, label: 'Time To Contact' },
    { name: 'dob', defaultValue: selected.dob, label: 'DOB' },
    { name: 'financeManager', defaultValue: selected.financeManager, label: 'Finance Manager' },
    { name: 'userEmail', defaultValue: selected.userEmail, label: 'Sales Person Email' },
    { name: 'othTax', defaultValue: selected.othTax, label: 'othTax' },
    { name: 'optionsTotal', defaultValue: selected.optionsTotal, label: 'optionsTotal' },
    { name: 'lienPayout', defaultValue: selected.lienPayout, label: 'lienPayout' },
    { name: 'sendToFinanceNow', defaultValue: selected.sendToFinanceNow, label: 'sendToFinanceNow' },
    { name: 'dealNumber', defaultValue: selected.dealNumber, label: 'Deal Number' },
    { name: 'iRate', defaultValue: selected.iRate, label: 'Interest Rate' },
    { name: 'months', defaultValue: selected.months, label: 'Months' },
    { name: 'discount', defaultValue: selected.discount, label: 'Discount' },
    { name: 'total', defaultValue: selected.total, label: 'Total' },
    { name: 'deposit', defaultValue: selected.deposit, label: 'deposit' },
    { name: 'desiredPayments', defaultValue: selected.desiredPayments, label: 'Desired Payments' },
    { name: 'admin', defaultValue: selected.admin, label: 'Admin Fee' },
    { name: 'commodity', defaultValue: selected.commodity, label: 'Commodity' },
    { name: 'pdi', defaultValue: selected.pdi, label: 'PDI' },
    { name: 'discountPer', defaultValue: selected.discountPer, label: 'Discount %' },
    { name: 'userLoanProt', defaultValue: selected.userLoanProt, label: 'Loan Prot' },
    { name: 'userTireandRim', defaultValue: selected.userTireandRim, label: 'Tire and Rim' },
    { name: 'userGap', defaultValue: selected.userGap, label: 'Gap' },
    { name: 'userExtWarr', defaultValue: selected.userExtWarr, label: 'Ext Warr' },
    { name: 'userServicespkg', defaultValue: selected.userServicespkg, label: 'Services pkg' },
    { name: 'deliveryCharge', defaultValue: selected.deliveryCharge, label: 'Delivery Charge' },
    { name: 'vinE', defaultValue: selected.vinE, label: 'VIN Etching' },
    { name: 'lifeDisability', defaultValue: selected.lifeDisability, label: 'Life & Disability' },
    { name: 'rustProofing', defaultValue: selected.rustProofing, label: 'Rust Proofing' },
    { name: 'userOther', defaultValue: selected.userOther, label: 'Other' },
    { name: 'referral', defaultValue: selected.referral, label: 'Referral' },
    { name: 'visited', defaultValue: selected.visited, label: 'Visited' },
    { name: 'bookedApt', defaultValue: selected.bookedApt, label: 'Booked Apt' },
    { name: 'aptShowed', defaultValue: selected.aptShowed, label: 'Apt Showed' },
    { name: 'aptNoShowed', defaultValue: selected.aptNoShowed, label: 'Apt No Showed' },
    { name: 'testDrive', defaultValue: selected.testDrive, label: 'Test Drive' },
    { name: 'metService', defaultValue: selected.metService, label: 'Met Service' },
    { name: 'metManager', defaultValue: selected.metManager, label: 'Met Manager' },
    { name: 'metParts', defaultValue: selected.metParts, label: 'Met Parts' },
    { name: 'sold', defaultValue: selected.sold, label: 'Sold' },
    { name: 'depositMade', defaultValue: selected.depositMade, label: 'Deposit Made' },
    { name: 'refund', defaultValue: selected.refund, label: 'Refund' },
    { name: 'turnOver', defaultValue: selected.turnOver, label: 'Turn Over' },
    { name: 'financeApp', defaultValue: selected.financeApp, label: 'Finance App' },
    { name: 'approved', defaultValue: selected.approved, label: 'Approved' },
    { name: 'signed', defaultValue: selected.signed, label: 'Signed' },
    { name: 'pickUpSet', defaultValue: selected.pickUpSet, label: 'Pick Up Set' },




    { name: 'demoed', defaultValue: selected.demoed, label: 'demoed' },
    { name: 'lastContact', defaultValue: selected.lastContact, label: 'lastContact' },
    { name: 'status', defaultValue: selected.status, label: 'status' },
    { name: 'customerState', defaultValue: selected.customerState, label: 'customerState' },
    { name: 'result', defaultValue: selected.result, label: 'result' },
    { name: 'timesContacted', defaultValue: selected.timesContacted, label: 'timesContacted' },
    { name: 'nextAppointment', defaultValue: selected.nextAppointment, label: 'nextAppointment' },
    { name: 'followUpDay', defaultValue: selected.followUpDay, label: 'followUpDay' },
    { name: 'deliveryDate', defaultValue: selected.deliveryDate, label: 'deliveryDate' },
    { name: 'delivered', defaultValue: selected.delivered, label: 'delivered' },
    { name: 'deliveredDate', defaultValue: selected.deliveredDate, label: 'deliveredDate' },
    { name: 'notes', defaultValue: selected.notes, label: 'notes' },
    { name: 'visits', defaultValue: selected.visits, label: 'visits' },
    { name: 'progress', defaultValue: selected.progress, label: 'progress' },
    { name: 'metSalesperson', defaultValue: selected.metSalesperson, label: 'metSalesperson' },
    { name: 'metFinance', defaultValue: selected.metFinance, label: 'metFinance' },
    { name: 'financeApplication', defaultValue: selected.financeApplication, label: 'financeApplication' },
    { name: 'pickUpDate', defaultValue: selected.pickUpDate, label: 'pickUpDate' },
    { name: 'pickUpTime', defaultValue: selected.pickUpTime, label: 'pickUpTime' },
    { name: 'depositTakenDate', defaultValue: selected.depositTakenDate, label: 'depositTakenDate' },
    { name: 'docsSigned', defaultValue: selected.docsSigned, label: 'docsSigned' },
    { name: 'tradeRepairs', defaultValue: selected.tradeRepairs, label: 'tradeRepairs' },
    { name: 'seenTrade', defaultValue: selected.seenTrade, label: 'seenTrade' },
    { name: 'lastNote', defaultValue: selected.lastNote, label: 'lastNote' },
    { name: 'applicationDone', defaultValue: selected.applicationDone, label: 'applicationDone' },
    { name: 'licensingSent', defaultValue: selected.licensingSent, label: 'licensingSent' },
    { name: 'liceningDone', defaultValue: selected.liceningDone, label: 'liceningDone' },
    { name: 'refunded', defaultValue: selected.refunded, label: 'refunded' },
    { name: 'cancelled', defaultValue: selected.cancelled, label: 'cancelled' },
    { name: 'lost', defaultValue: selected.lost, label: 'lost' },
    { name: 'dLCopy', defaultValue: selected.dLCopy, label: 'dLCopy' },
    { name: 'insCopy', defaultValue: selected.insCopy, label: 'insCopy' },
    { name: 'testDrForm', defaultValue: selected.testDrForm, label: 'testDrForm' },
    { name: 'voidChq', defaultValue: selected.voidChq, label: 'voidChq' },
    { name: 'loanOther', defaultValue: selected.loanOther, label: 'loanOther' },
    { name: 'signBill', defaultValue: selected.signBill, label: 'signBill' },
    { name: 'ucda', defaultValue: selected.ucda, label: 'ucda' },
    { name: 'tradeInsp', defaultValue: selected.tradeInsp, label: 'tradeInsp' },
    { name: 'customerWS', defaultValue: selected.customerWS, label: 'customerWS' },
    { name: 'otherDocs', defaultValue: selected.otherDocs, label: 'otherDocs' },
    { name: 'urgentFinanceNote', defaultValue: selected.urgentFinanceNote, label: 'urgentFinanceNote' },
    { name: 'funded', defaultValue: selected.funded, label: 'funded' },
    { name: 'leadSource', defaultValue: selected.leadSource, label: 'leadSource' },
    { name: 'financeDeptProductsTotal', defaultValue: selected.financeDeptProductsTotal, label: 'financeDeptProductsTotal' },
    { name: 'bank', defaultValue: selected.bank, label: 'bank' },
    { name: 'loanNumber', defaultValue: selected.loanNumber, label: 'loanNumber' },
    { name: 'idVerified', defaultValue: selected.idVerified, label: 'idVerified' },
    { name: 'dealerCommission', defaultValue: selected.dealerCommission, label: 'dealerCommission' },
    { name: 'financeCommission', defaultValue: selected.financeCommission, label: 'financeCommission' },
    { name: 'salesCommission', defaultValue: selected.salesCommission, label: 'salesCommission' },
    { name: 'firstPayment', defaultValue: selected.firstPayment, label: 'firstPayment' },
    { name: 'loanMaturity', defaultValue: selected.loanMaturity, label: 'loanMaturity' },
    { name: 'quoted', defaultValue: selected.quoted, label: 'quoted' },
    { name: 'InPerson', defaultValue: selected.InPerson, label: 'InPerson' },
    { name: 'Phone', defaultValue: selected.Phone, label: 'Phone' },
    { name: 'SMS', defaultValue: selected.SMS, label: 'SMS' },
    { name: 'Email', defaultValue: selected.Email, label: 'Email' },
    { name: 'Other', defaultValue: selected.Other, label: 'Other' },
    { name: 'paintPrem', defaultValue: selected.paintPrem, label: 'paintPrem' },
    { name: 'licensing', defaultValue: selected.licensing, label: 'licensing' },
    { name: 'stockNum', defaultValue: selected.stockNum, label: 'stockNum' },
    { name: 'options', defaultValue: selected.options, label: 'options' },
    { name: 'accessories', defaultValue: selected.accessories, label: 'accessories' },
    { name: 'freight', defaultValue: selected.freight, label: 'freight' },
    { name: 'labour', defaultValue: selected.labour, label: 'labour' },
    { name: 'year', defaultValue: selected.year, label: 'year' },
    { name: 'brand', defaultValue: selected.brand, label: 'brand' },
    { name: 'mileage', defaultValue: selected.mileage, label: 'mileage' },
    { name: 'model', defaultValue: selected.model, label: 'model' },
    { name: 'model1', defaultValue: selected.model1, label: 'model1' },
    { name: 'color', defaultValue: selected.color, label: 'color' },
    { name: 'modelCode', defaultValue: selected.modelCode, label: 'modelCode' },
    { name: 'msrp', defaultValue: selected.msrp, label: 'msrp' },
    { name: 'trim', defaultValue: selected.trim, label: 'trim' },
    { name: 'vin', defaultValue: selected.vin, label: 'vin' },
    { name: 'bikeStatus', defaultValue: selected.bikeStatus, label: 'bikeStatus' },
    { name: 'invId', defaultValue: selected.invId, label: 'invId' },
    { name: 'motor', defaultValue: selected.motor, label: 'motor' },
    { name: 'tag', defaultValue: selected.tag, label: 'tag' },
    { name: 'tradeValue', defaultValue: selected.tradeValue, label: 'tradeValue' },
    { name: 'tradeDesc', defaultValue: selected.tradeDesc, label: 'tradeDesc' },
    { name: 'tradeColor', defaultValue: selected.tradeColor, label: 'tradeColor' },
    { name: 'tradeYear', defaultValue: selected.tradeYear, label: 'tradeYear' },
    { name: 'tradeMake', defaultValue: selected.tradeMake, label: 'tradeMake' },
    { name: 'tradeVin', defaultValue: selected.tradeVin, label: 'tradeVin' },
    { name: 'tradeTrim', defaultValue: selected.tradeTrim, label: 'tradeTrim' },
    { name: 'tradeMileage', defaultValue: selected.tradeMileage, label: 'tradeMileage' },
    { name: 'tradeLocation', defaultValue: selected.tradeLocation, label: 'tradeLocation' },
    { name: 'lien', defaultValue: selected.lien, label: 'lien' },
    { name: 'activixId', defaultValue: selected.activixId, label: 'activixId' },
    { name: 'theRealActId', defaultValue: selected.theRealActId, label: 'theRealActId' },


    { name: 'biweeklNatWOptions', defaultValue: selected.biweeklNatWOptions, label: 'biweeklNatWOptions' },
    { name: 'weeklylNatWOptions', defaultValue: selected.weeklylNatWOptions, label: 'weeklylNatWOptions' },
    { name: 'nat60WOptions', defaultValue: selected.nat60WOptions, label: 'nat60WOptions' },
    { name: 'weeklyOthWOptions', defaultValue: selected.weeklyOthWOptions, label: 'weeklyOthWOptions' },
    { name: 'biweekOthWOptions', defaultValue: selected.biweekOthWOptions, label: 'biweekOthWOptions' },
    { name: 'oth60WOptions', defaultValue: selected.oth60WOptions, label: 'oth60WOptions' },
    { name: 'biweeklNat', defaultValue: selected.biweeklNat, label: 'biweeklNat' },
    { name: 'weeklylNat', defaultValue: selected.weeklylNat, label: 'weeklylNat' },
    { name: 'nat60', defaultValue: selected.nat60, label: 'nat60' },
    { name: 'qcTax', defaultValue: selected.qcTax, label: 'qcTax' },
    { name: 'otherTax', defaultValue: selected.otherTax, label: 'otherTax' },
    { name: 'totalWithOptions', defaultValue: selected.totalWithOptions, label: 'totalWithOptions' },
    { name: 'otherTaxWithOptions', defaultValue: selected.otherTaxWithOptions, label: 'otherTaxWithOptions' },
    { name: 'onTax', defaultValue: selected.onTax, label: 'ON Tax' },
    { name: 'on60', defaultValue: selected.on60, label: 'on60' },
    { name: 'biweekly', defaultValue: selected.biweekly, label: 'biweekly' },
    { name: 'weekly', defaultValue: selected.weekly, label: 'weekly' },
    { name: 'weeklyOth', defaultValue: selected.weeklyOth, label: 'weeklyOth' },
    { name: 'biweekOth', defaultValue: selected.biweekOth, label: 'biweekOth' },
    { name: 'oth60', defaultValue: selected.oth60, label: 'oth60' },
    { name: 'weeklyqc', defaultValue: selected.weeklyqc, label: 'weeklyqc' },
    { name: 'biweeklyqc', defaultValue: selected.biweeklyqc, label: 'biweeklyqc' },
    { name: 'qc60', defaultValue: selected.qc60, label: 'qc60' },
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
                <TableHead className="hidden sm:table-cell w-[150px] mx-auto text-center">Year</TableHead>
                <TableHead className="hidden sm:table-cell w-[200px] mx-auto text-center">Brand</TableHead>
                <TableHead className="w-[300px] hidden sm:table-cell mx-auto text-center">Model</TableHead>
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
                        <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[50px]">
                          <p className='mx-auto text-center'>{result.year}</p>
                        </TableCell>
                        <TableCell className="tableCell  w-auto min-w-[100px]">
                          <p className='mx-auto text-center'>{result.brand}</p>
                        </TableCell>
                        <TableCell className="tableCell  w-auto min-w-[200px] hidden sm:table-cell">
                          <p className='mx-auto text-center'>{result.model}</p>
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
                      <TableCell className="tableCell hidden sm:table-cell  w-auto min-w-[50px]">
                        <p className='mx-auto text-center'>{result.year}</p>
                      </TableCell>
                      <TableCell className="tableCell  w-auto min-w-[100px]">
                        <p className='mx-auto text-center'>{result.brand}</p>
                      </TableCell>
                      <TableCell className="tableCell  w-auto min-w-[200px] hidden sm:table-cell">
                        <p className='mx-auto text-center'>{result.model}</p>
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
