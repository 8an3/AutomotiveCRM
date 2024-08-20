import {
  Tabs,
  Badge,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  Alert,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  RemixNavLink,
  Input,
  Separator,
  Button,
  TextArea,
  Label,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "~/components/ui/dropdown-menu";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit,
  useNavigation,
  useParams,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import { ButtonLoading } from "~/components/ui/button-loading";
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
} from "lucide-react";
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";

import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { FaCheck } from "react-icons/fa";

import { buttonVariants } from "~/components/ui/button"



export default function ClientDialog({ data, user }) {
  let sortedEvents = [];
  let customerCard = [
    { name: "firstName", value: data.firstName, label: "firstName", },
    { name: "lastName", value: data.lastName, label: "lastName", },
    { name: "name", value: data.name, label: "name", },
    { name: "email", value: data.email, label: "email", },
    { name: "phone", value: data.phone, label: "phone", },
    { name: "address", value: data.address, label: "address", },
    { name: "city", value: data.city, label: "city", },
    { name: "postal", value: data.postal, label: "postal", },
    { name: "province", value: data.province, label: "province", },
    { name: "dl", value: data.dl, label: "dl", },
    { name: "typeOfContact", value: data.typeOfContact, label: "typeOfContact", },
    { name: "timeToContact", value: data.timeToContact, label: "timeToContact", },
    { name: "billingAddress", value: data.billingAddress, label: "billingAddress", },
  ];

  let workorderCard = [
    { name: "workOrderId", value: data.WorkOrder.workOrderId, label: "workOrderId", },
    { name: "unit", value: data.WorkOrder.unit, label: "unit", },
    { name: "mileage", value: data.WorkOrder.mileage, label: "mileage", },
    { name: "vin", value: data.WorkOrder.vin, label: "vin", },
    { name: "tag", value: data.WorkOrder.tag, label: "tag", },
    { name: "motor", value: data.WorkOrder.motor, label: "motor", },
    { name: "color", value: data.WorkOrder.color, label: "color", },
    { name: "budget", value: data.WorkOrder.budget, label: "budget", },
    { name: "waiter", value: data.WorkOrder.waiter, label: "waiter", },
    { name: "totalLabour", value: data.WorkOrder.totalLabour, label: "totalLabour", },
    { name: "totalParts", value: data.WorkOrder.totalParts, label: "totalParts", },
    { name: "subTotal", value: data.WorkOrder.subTotal, label: "subTotal", },
    { name: "total", value: data.WorkOrder.total, label: "total", },
    { name: "writer", value: data.WorkOrder.writer, label: "writer", },
    { name: "userEmail", value: data.WorkOrder.userEmail, label: "userEmail", },
    { name: "tech", value: data.WorkOrder.tech, label: "tech", },
    { name: "techEmail", value: data.WorkOrder.techEmail, label: "techEmail", },
    { name: "notes", value: data.WorkOrder.notes, label: "notes", },
    { name: "customerSig", value: data.WorkOrder.customerSig, label: "customerSig", },
    { name: "status", value: data.WorkOrder.status, label: "status", },
    { name: "location", value: data.WorkOrder.location, label: "location", },
    { name: "quoted", value: data.WorkOrder.quoted, label: "quoted", },
    { name: "paid", value: data.WorkOrder.paid, label: "paid", },
    { name: "remaining", value: data.WorkOrder.remaining, label: "remaining", },
    { name: "FinanceUnitId", value: data.WorkOrder.FinanceUnitId, label: "FinanceUnitId", },
    { name: "ServiceUnitId", value: data.WorkOrder.ServiceUnitId, label: "ServiceUnitId", },
    { name: "financeId", value: data.WorkOrder.financeId, label: "financeId", },
    { name: "clientfileId", value: data.WorkOrder.clientfileId, label: "clientfileId", },
    { name: "note", value: data.WorkOrder.note, label: "note", },
    { name: "closedAt", value: data.WorkOrder.closedAt, label: "closedAt", },
  ];
  let pacCard = [
    { name: "userEmail", value: data.userEmail, label: "userEmail", },
    { name: "userName", value: data.userName, label: "userName", },
    { name: "dept", value: data.dept, label: "dept", },
    { name: "sellingDept", value: data.sellingDept, label: "sellingDept", },
    { name: "total", value: data.total, label: "total", },
    { name: "discount", value: data.discount, label: "discount", },
    { name: "discPer", value: data.discPer, label: "discPer", },
    { name: "paid", value: data.paid, label: "paid", },
    { name: "paidDate", value: data.paidDate, label: "paidDate", },
    { name: "status", value: data.status, label: "status", },
    { name: "workOrderId", value: data.workOrderId, label: "workOrderId", },
    { name: "note", value: data.note, label: "note", },
  ];

  const fetcher = useFetcher();

  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };



  let financesCard = [
    { name: "financeManager", value: data.Finance.financeManager, label: "financeManager", },
    { name: "userEmail", value: data.Finance.userEmail, label: "userEmail", },
    { name: "userName", value: data.Finance.userName, label: "userName", },
    { name: "financeManagerName", value: data.Finance.financeManagerName, label: "financeManagerName", },
    { name: "email", value: data.Finance.email, label: "email", },
    { name: "firstName", value: data.Finance.firstName, label: "firstName", },
    { name: "lastName", value: data.Finance.lastName, label: "lastName", },
    { name: "phone", value: data.Finance.phone, label: "phone", },
    { name: "name", value: data.Finance.name, label: "name", },
    { name: "address", value: data.Finance.address, label: "address", },
    { name: "city", value: data.Finance.city, label: "city", },
    { name: "postal", value: data.Finance.postal, label: "postal", },
    { name: "province", value: data.Finance.province, label: "province", },
    { name: "dl", value: data.Finance.dl, label: "dl", },
    { name: "typeOfContact", value: data.Finance.typeOfContact, label: "typeOfContact", },
    { name: "timeToContact", value: data.Finance.timeToContact, label: "timeToContact", },
    { name: "dob", value: data.Finance.dob, label: "dob", },
    { name: "othTax", value: data.Finance.othTax, label: "othTax", },
    { name: "optionsTotal", value: data.Finance.optionsTotal, label: "optionsTotal", },
    { name: "lienPayout", value: data.Finance.lienPayout, label: "lienPayout", },
    { name: "leadNote", value: data.Finance.leadNote, label: "leadNote", },
    { name: "sendToFinanceNow", value: data.Finance.sendToFinanceNow, label: "sendToFinanceNow", },
    { name: "dealNumber", value: data.Finance.dealNumber, label: "dealNumber", },
    { name: "iRate", value: data.Finance.iRate, label: "iRate", },
    { name: "months", value: data.Finance.months, label: "months", },
    { name: "discount", value: data.Finance.discount, label: "discount", },
    { name: "total", value: data.Finance.total, label: "total", },
    { name: "onTax", value: data.Finance.onTax, label: "onTax", },
    { name: "on60", value: data.Finance.on60, label: "on60", },
    { name: "biweekly", value: data.Finance.biweekly, label: "biweekly", },
    { name: "weekly", value: data.Finance.weekly, label: "weekly", },
    { name: "weeklyOth", value: data.Finance.weeklyOth, label: "weeklyOth", },
    { name: "biweekOth", value: data.Finance.biweekOth, label: "biweekOth", },
    { name: "oth60", value: data.Finance.oth60, label: "oth60", },
    { name: "weeklyqc", value: data.Finance.weeklyqc, label: "weeklyqc", },
    { name: "biweeklyqc", value: data.Finance.biweeklyqc, label: "biweeklyqc", },
    { name: "qc60", value: data.Finance.qc60, label: "qc60", },
    { name: "deposit", value: data.Finance.deposit, label: "deposit", },
    { name: "biweeklNatWOptions", value: data.Finance.biweeklNatWOptions, label: "biweeklNatWOptions", },
    { name: "weeklylNatWOptions", value: data.Finance.weeklylNatWOptions, label: "weeklylNatWOptions", },
    { name: "nat60WOptions", value: data.Finance.nat60WOptions, label: "nat60WOptions", },
    { name: "weeklyOthWOptions", value: data.Finance.weeklyOthWOptions, label: "weeklyOthWOptions", },
    { name: "biweekOthWOptions", value: data.Finance.biweekOthWOptions, label: "biweekOthWOptions", },
    { name: "oth60WOptions", value: data.Finance.oth60WOptions, label: "oth60WOptions", },
    { name: "biweeklNat", value: data.Finance.biweeklNat, label: "biweeklNat", },
    { name: "weeklylNat", value: data.Finance.weeklylNat, label: "weeklylNat", },
    { name: "nat60", value: data.Finance.nat60, label: "nat60", },
    { name: "qcTax", value: data.Finance.qcTax, label: "qcTax", },
    { name: "otherTax", value: data.Finance.otherTax, label: "otherTax", },
    { name: "totalWithOptions", value: data.Finance.totalWithOptions, label: "totalWithOptions", },
    { name: "otherTaxWithOptions", value: data.Finance.otherTaxWithOptions, label: "otherTaxWithOptions", },
    { name: "desiredPayments", value: data.Finance.desiredPayments, label: "desiredPayments", },
    { name: "admin", value: data.Finance.admin, label: "admin", },
    { name: "commodity", value: data.Finance.commodity, label: "commodity", },
    { name: "pdi", value: data.Finance.pdi, label: "pdi", },
    { name: "discountPer", value: data.Finance.discountPer, label: "discountPer", },
    { name: "userLoanProt", value: data.Finance.userLoanProt, label: "userLoanProt", },
    { name: "userTireandRim", value: data.Finance.userTireandRim, label: "userTireandRim", },
    { name: "userGap", value: data.Finance.userGap, label: "userGap", },
    { name: "userExtWarr", value: data.Finance.userExtWarr, label: "userExtWarr", },
    { name: "userServicespkg", value: data.Finance.userServicespkg, label: "userServicespkg", },
    { name: "deliveryCharge", value: data.Finance.deliveryCharge, label: "deliveryCharge", },
    { name: "vinE", value: data.Finance.vinE, label: "vinE", },
    { name: "lifeDisability", value: data.Finance.lifeDisability, label: "lifeDisability", },
    { name: "rustProofing", value: data.Finance.rustProofing, label: "rustProofing", },
    { name: "userOther", value: data.Finance.userOther, label: "userOther", },
    { name: "referral", value: data.Finance.referral, label: "referral", },
    { name: "visited", value: data.Finance.visited, label: "visited", },
    { name: "bookedApt", value: data.Finance.bookedApt, label: "bookedApt", },
    { name: "aptShowed", value: data.Finance.aptShowed, label: "aptShowed", },
    { name: "aptNoShowed", value: data.Finance.aptNoShowed, label: "aptNoShowed", },
    { name: "testDrive", value: data.Finance.testDrive, label: "testDrive", },
    { name: "metService", value: data.Finance.metService, label: "metService", },
    { name: "metManager", value: data.Finance.metManager, label: "metManager", },
    { name: "metParts", value: data.Finance.metParts, label: "metParts", },
    { name: "sold", value: data.Finance.sold, label: "sold", },
    { name: "depositMade", value: data.Finance.depositMade, label: "depositMade", },
    { name: "refund", value: data.Finance.refund, label: "refund", },
    { name: "turnOver", value: data.Finance.turnOver, label: "turnOver", },
    { name: "financeApp", value: data.Finance.financeApp, label: "financeApp", },
    { name: "approved", value: data.Finance.approved, label: "approved", },
    { name: "signed", value: data.Finance.signed, label: "signed", },
    { name: "pickUpSet", value: data.Finance.pickUpSet, label: "pickUpSet", },
    { name: "demoed", value: data.Finance.demoed, label: "demoed", },
    { name: "lastContact", value: data.Finance.lastContact, label: "lastContact", },
    { name: "status", value: data.Finance.status, label: "status", },
    { name: "customerState", value: data.Finance.customerState, label: "customerState", },
    { name: "result", value: data.Finance.result, label: "result", },
    { name: "timesContacted", value: data.Finance.timesContacted, label: "timesContacted", },
    { name: "nextAppointment", value: data.Finance.nextAppointment, label: "nextAppointment", },
    { name: "followUpDay", value: data.Finance.followUpDay, label: "followUpDay", },
    { name: "deliveryDate", value: data.Finance.deliveryDate, label: "deliveryDate", },
    { name: "delivered", value: data.Finance.delivered, label: "delivered", },
    { name: "deliveredDate", value: data.Finance.deliveredDate, label: "deliveredDate", },
    { name: "notes", value: data.Finance.notes, label: "notes", },
    { name: "visits", value: data.Finance.visits, label: "visits", },
    { name: "progress", value: data.Finance.progress, label: "progress", },
    { name: "metSalesperson", value: data.Finance.metSalesperson, label: "metSalesperson", },
    { name: "metFinance", value: data.Finance.metFinance, label: "metFinance", },
    { name: "financeApplication", value: data.Finance.financeApplication, label: "financeApplication", },
    { name: "pickUpDate", value: data.Finance.pickUpDate, label: "pickUpDate", },
    { name: "pickUpTime", value: data.Finance.pickUpTime, label: "pickUpTime", },
    { name: "depositTakenDate", value: data.Finance.depositTakenDate, label: "depositTakenDate", },
    { name: "docsSigned", value: data.Finance.docsSigned, label: "docsSigned", },
    { name: "tradeRepairs", value: data.Finance.tradeRepairs, label: "tradeRepairs", },
    { name: "seenTrade", value: data.Finance.seenTrade, label: "seenTrade", },
    { name: "lastNote", value: data.Finance.lastNote, label: "lastNote", },
    { name: "applicationDone", value: data.Finance.applicationDone, label: "applicationDone", },
    { name: "licensingSent", value: data.Finance.licensingSent, label: "licensingSent", },
    { name: "liceningDone", value: data.Finance.liceningDone, label: "liceningDone", },
    { name: "refunded", value: data.Finance.refunded, label: "refunded", },
    { name: "cancelled", value: data.Finance.cancelled, label: "cancelled", },
    { name: "lost", value: data.Finance.lost, label: "lost", },
    { name: "dLCopy", value: data.Finance.dLCopy, label: "dLCopy", },
    { name: "insCopy", value: data.Finance.insCopy, label: "insCopy", },
    { name: "testDrForm", value: data.Finance.testDrForm, label: "testDrForm", },
    { name: "voidChq", value: data.Finance.voidChq, label: "voidChq", },
    { name: "loanOther", value: data.Finance.loanOther, label: "loanOther", },
    { name: "signBill", value: data.Finance.signBill, label: "signBill", },
    { name: "ucda", value: data.Finance.ucda, label: "ucda", },
    { name: "tradeInsp", value: data.Finance.tradeInsp, label: "tradeInsp", },
    { name: "customerWS", value: data.Finance.customerWS, label: "customerWS", },
    { name: "otherDocs", value: data.Finance.otherDocs, label: "otherDocs", },
    { name: "urgentFinanceNote", value: data.Finance.urgentFinanceNote, label: "urgentFinanceNote", },
    { name: "funded", value: data.Finance.funded, label: "funded", },
    { name: "leadSource", value: data.Finance.leadSource, label: "leadSource", },
    { name: "financeDeptProductsTotal", value: data.Finance.financeDeptProductsTotal, label: "financeDeptProductsTotal", },
    { name: "bank", value: data.Finance.bank, label: "bank", },
    { name: "loanNumber", value: data.Finance.loanNumber, label: "loanNumber", },
    { name: "idVerified", value: data.Finance.idVerified, label: "idVerified", },
    { name: "dealerCommission", value: data.Finance.dealerCommission, label: "dealerCommission", },
    { name: "financeCommission", value: data.Finance.financeCommission, label: "financeCommission", },
    { name: "salesCommission", value: data.Finance.salesCommission, label: "salesCommission", },
    { name: "firstPayment", value: data.Finance.firstPayment, label: "firstPayment", },
    { name: "loanMaturity", value: data.Finance.loanMaturity, label: "loanMaturity", },
    { name: "quoted", value: data.Finance.quoted, label: "quoted", },
    { name: "InPerson", value: data.Finance.InPerson, label: "InPerson", },
    { name: "Phone", value: data.Finance.Phone, label: "Phone", },
    { name: "SMS", value: data.Finance.SMS, label: "SMS", },
    { name: "Email", value: data.Finance.Email, label: "Email", },
    { name: "Other", value: data.Finance.Other, label: "Other", },
    { name: "paintPrem", value: data.Finance.paintPrem, label: "paintPrem", },
    { name: "licensing", value: data.Finance.licensing, label: "licensing", },
    { name: "stockNum", value: data.Finance.stockNum, label: "stockNum", },
    { name: "options", value: data.Finance.options, label: "options", },
    { name: "accessories", value: data.Finance.accessories, label: "accessories", },
    { name: "freight", value: data.Finance.freight, label: "freight", },
    { name: "labour", value: data.Finance.labour, label: "labour", },
    { name: "year", value: data.Finance.year, label: "year", },
    { name: "brand", value: data.Finance.brand, label: "brand", },
    { name: "mileage", value: data.Finance.mileage, label: "mileage", },
    { name: "model", value: data.Finance.model, label: "model", },
    { name: "model1", value: data.Finance.model1, label: "model1", },
    { name: "color", value: data.Finance.color, label: "color", },
    { name: "modelCode", value: data.Finance.modelCode, label: "modelCode", },
    { name: "msrp", value: data.Finance.msrp, label: "msrp", },
    { name: "trim", value: data.Finance.trim, label: "trim", },
    { name: "vin", value: data.Finance.vin, label: "vin", },
    { name: "bikeStatus", value: data.Finance.bikeStatus, label: "bikeStatus", },
    { name: "invId", value: data.Finance.invId, label: "invId", },
    { name: "motor", value: data.Finance.motor, label: "motor", },
    { name: "tag", value: data.Finance.tag, label: "tag", },
    { name: "tradeValue", value: data.Finance.tradeValue, label: "tradeValue", },
    { name: "tradeDesc", value: data.Finance.tradeDesc, label: "tradeDesc", },
    { name: "tradeColor", value: data.Finance.tradeColor, label: "tradeColor", },
    { name: "tradeYear", value: data.Finance.tradeYear, label: "tradeYear", },
    { name: "tradeMake", value: data.Finance.tradeMake, label: "tradeMake", },
    { name: "tradeVin", value: data.Finance.tradeVin, label: "tradeVin", },
    { name: "tradeTrim", value: data.Finance.tradeTrim, label: "tradeTrim", },
    { name: "tradeMileage", value: data.Finance.tradeMileage, label: "tradeMileage", },
    { name: "tradeLocation", value: data.Finance.tradeLocation, label: "tradeLocation", },
    { name: "lien", value: data.Finance.lien, label: "lien", },
  ];

  const timerRef = useRef(0);

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  const [copiedText, setCopiedText] = useState('');
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])
  console.log(data, 'data finance')
  const fixedData = [
    data
  ]

  const { AccOrder, Finance, WorkOrder } = data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Unit File</Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-[95%] border border-border md:max-w-[90%] h-auto max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unit File</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid items-start gap-4 md:gap-8 lg:col-span-1">
            <Card
              className="overflow-hidden rounded-lg text-foreground"
              x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Timeline
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">
                        Snap shot on customer interactions, whether they are
                        buying something or a sales person following up to make
                        a sale.
                      </span>
                    </Button>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
                <div className="grid h-auto max-h-[65vh] gap-3">
                  <div className="rightbox">
                    <div className="rb-container">
                      <ul className="rb">
                        {sortedEvents.reverse().map((event, index) => (
                          <li
                            key={index}
                            className="rb-item grid-grid-cols-1 bg-muted-background rounded-lg px-3 py-2 "
                          >
                            <div className="timestamp flex justify-between text-primary">
                              <p>{event.date}</p>
                              <p className="text-right">{event.type}</p>
                            </div>
                            <div className="timestamp flex justify-between">
                              <div className="item-title">{event.title}</div>
                              {event.type === "Communication" ? (
                                <>
                                  <p className="item-title text-right">
                                    {event.direction}
                                  </p>
                                </>
                              ) : null}
                            </div>
                            <p>{event.userName}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:col-span-2 ">
            <Tabs defaultValue="Client" className="w-full">
              <TabsList>
                <TabsTrigger value="Client">Client</TabsTrigger>
                <TabsTrigger value="Finances">Finances</TabsTrigger>
                <TabsTrigger value="Work Orders">Work Orders</TabsTrigger>
                <TabsTrigger value="PAC Orders">PAC Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="Client">
                <div className="grid items-start gap-4 md:gap-8 lg:col-span-1">
                  <Card
                    className="overflow-hidden rounded-lg text-foreground"
                    x-chunk="dashboard-05-chunk-4"
                  >
                    <Form method='post'>

                      <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            Timeline
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">
                                Snap shot on customer interactions, whether they
                                are buying something or a sales person following
                                up to make a sale.
                              </span>
                            </Button>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip bg-background p-6 text-sm">
                        <div className="grid h-auto  max-h-[65vh] grid-cols-2 gap-3 mt-5">


                          {customerCard.map((user, index) => (
                            <div key={index} className="relative mt-5">
                              <Input
                                name={user.name}
                                defaultValue={user.value}
                                className={` border border-border bg-background text-foreground`}
                              />
                              <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                {user.label}
                              </label>
                            </div>
                          ))}
                          <div className="relative mt-5  ">
                            <Select
                              onValueChange={(value) => {
                                const formData = new FormData();
                                formData.append("id", data.id);
                                formData.append("typeOfContact", value);
                                formData.append("intent", 'typeOfContact');
                                console.log(formData, 'formData');
                                fetcher.submit(formData, { method: "post" });
                              }}
                              defaultValue={data.typeOfContact}
                              name='typeOfContact'>
                              <SelectTrigger className="w-full focus:border-primary">
                                <SelectValue placeholder='Type Of Contact' />
                              </SelectTrigger>
                              <SelectContent className=' bg-background text-foreground border border-border' >
                                <SelectGroup>
                                  <SelectLabel>Contact Method</SelectLabel>
                                  <SelectItem value="Phone">Phone</SelectItem>
                                  <SelectItem value="InPerson">In-Person</SelectItem>
                                  <SelectItem value="SMS">SMS</SelectItem>
                                  <SelectItem value="Email">Email</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Type Of Contact
                            </label>
                          </div>
                          <div className="relative mt-5  ">
                            <Select
                              onValueChange={(value) => {
                                const formData = new FormData();
                                formData.append("id", data.id);
                                formData.append("timeToContact", value);
                                formData.append("intent", 'timeToContact');
                                console.log(formData, 'formData');
                                fetcher.submit(formData, { method: "post" });
                              }}
                              defaultValue={data.timeToContact}
                              name='timeToContact'>
                              <SelectTrigger className="w-full focus:border-primary">
                                <SelectValue placeholder='Time To Contact' />
                              </SelectTrigger>
                              <SelectContent className=' bg-background text-foreground border border-border' >
                                <SelectGroup>
                                  <SelectLabel>Best Time To Contact</SelectLabel>
                                  <SelectItem value="Morning">Morning</SelectItem>
                                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                                  <SelectItem value="Evening">Evening</SelectItem>
                                  <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Time To Contact
                            </label>
                          </div>
                          <input type='hidden' name='id' value={data.id} />

                        </div>

                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                        <div>
                          <Button type='submit' name='intent' value='updateClient' size='sm' >Save</Button>
                        </div>
                      </CardFooter>

                    </Form>

                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="Finances">
                {Finance && Finance.length > 0 && (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${finance.id}`}>
                      <AccordionTrigger>{finance.year} {finance.brand} {finance.model}</AccordionTrigger>
                      <AccordionContent className='border-border'>
                        {Finance.map((finance) => (
                          <div key={finance.id} className="mb-2 p-2 border rounded">
                            <p><strong>ID:</strong> {finance.id}</p>
                            <p><strong>Amount:</strong> {finance.amount}</p>
                            <p><strong>Description:</strong> {finance.description}</p>
                            <p><strong>Delivered Date:</strong> {finance.deliveredDate}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                )}
                {data.Finance && data.Finance.map((finance, index) => (

                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${finance.id}`}>
                      <AccordionTrigger>{finance.year} {finance.brand} {finance.model}</AccordionTrigger>
                      <AccordionContent className='border-border'>
                        <Card x-chunk="dashboard-04-chunk-1" >
                          <CardHeader>
                            <CardTitle>Sales Files</CardTitle>
                            <CardDescription>
                              To review and edit anything that has to do with the sales floor.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className='flex-col'>
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem className='border-border' value="item-1">
                                  <AccordionTrigger >Deal Information</AccordionTrigger>
                                  <AccordionContent>
                                    <div className='grid grid-cols-2 gap-4'>
                                      {financesCard.map((user, index) => (
                                        <div key={index} className="relative mt-5">
                                          <Input
                                            name={user.name}
                                            defaultValue={user.value}
                                            className={` border border-border bg-background text-foreground`}
                                          />
                                          <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                                            {user.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem className='border-border' value="item-2">
                                  <AccordionTrigger>Sales Storage</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>Storage items associated with the sales file.</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        {finance.financeStorage && finance.financeStorage.map(storage => (
                                          <div key={storage.id} className='flex  group'>
                                            <div className='flex-col' >
                                              <p> {storage.url}</p>
                                              <p className='text-mmuted-foreground'> {storage.filePath}</p>
                                            </div>
                                            <Button
                                              size="icon"
                                              variant="outline"
                                              onClick={() => copyText(storage.url)}
                                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                                            >
                                              <Copy className="h-3 w-3" />
                                              <span className="sr-only">Copy</span>
                                            </Button>
                                            {copiedText === storage.url && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                                          </div>
                                        ))}
                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>

                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem className='border-border' value="item-3">
                                  <AccordionTrigger>Appointments</AccordionTrigger>
                                  <AccordionContent className='border-border'>

                                    <Card x-chunk="dashboard-04-chunk-1" >
                                      <CardHeader>
                                        <CardTitle>Breakdown of any appointments associated with the sales deal.</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid gap-3 max-h-[20vh] h-auto">
                                          <div className="space-y-4 mt-5">

                                            {finance.clientApts && finance.clientApts.map((message, index) => {
                                              const options = {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                              };
                                              const isValidDate = message.start && message.start !== '1969-12-31 19:00';
                                              const date = new Date(message.start);
                                              const formattedDateAppt = isValidDate ? date.toLocaleDateString('en-US', options) : 'TBD';
                                              return (
                                                <div
                                                  key={index}
                                                  className={cn("flex w-[95%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-[#262626] mx-auto")} >
                                                  <div className='grid grid-cols-1'>
                                                    <div className='flex justify-between '>
                                                      {message.completed === 'yes' ? (
                                                        <Badge className="text-xs bg-[#1e9b3d]" variant="secondary">
                                                          Completed!
                                                        </Badge>
                                                      ) : (
                                                        <Badge className="text-xs bg-primary" variant="secondary">
                                                          Incomplete
                                                        </Badge>
                                                      )}
                                                      <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                          <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
                                                            <MoreVertical className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Menu</span>
                                                          </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className=' bg-blackground  text-foreground border border-border'>
                                                          <Form method='post'>
                                                            <DropdownMenuItem
                                                              onSelect={() => {
                                                                const formData = new FormData();
                                                                formData.append("aptId", message.message);
                                                                formData.append("userEmail", user.email);
                                                                formData.append("userName", user.name);
                                                                formData.append("intent", 'deleteApt');
                                                                submit(formData, { method: "post" });
                                                              }}>
                                                              Delete
                                                            </DropdownMenuItem>
                                                            <input type='hidden' name='financeId' defaultValue={finance.id} />
                                                          </Form>
                                                          <DropdownMenuItem>Edit</DropdownMenuItem>
                                                          <DropdownMenuSeparator />
                                                          <DropdownMenuItem>Trash</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                      </DropdownMenu>

                                                    </div>
                                                    <div className='flex justify-between mt-1'>
                                                      <p className='text-muted-foreground'>{formattedDateAppt}</p>
                                                      <p>{message.contactMethod}</p>
                                                    </div>
                                                    <p className='mt-1'> {message.title}</p>
                                                  </div>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4">
                                  <AccordionTrigger>Communications</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-5">
                                  <AccordionTrigger>Finance Products</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-6">
                                  <AccordionTrigger>Unit</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-7">
                                  <AccordionTrigger>Trade</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-8">
                                  <AccordionTrigger>Accessory Orders</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-9">
                                  <AccordionTrigger>Work Orders</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-10">
                                  <AccordionTrigger>Payments</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-11">
                                  <AccordionTrigger>Notes</AccordionTrigger>
                                  <AccordionContent className='border-border'>
                                    <Card x-chunk="dashboard-04-chunk-1" key={finance.id}>
                                      <CardHeader>
                                        <CardTitle>
                                          Storage items associated with the sales file.
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>

                                      </CardContent>
                                      <CardFooter className="border-t border-border px-6 py-4">
                                        <Button
                                          type='submit'
                                          name='intent'
                                          value='updateDealerInfo'>
                                          Save
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </AccordionContent>
                                </AccordionItem>

                              </Accordion>
                            </div>
                          </CardContent>
                          <CardFooter className="border-t border-border px-6 py-4">
                            <Button
                              type='submit'
                              name='intent'
                              value='updateDealerInfo'>
                              Save
                            </Button>
                          </CardFooter>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                ))}
              </TabsContent>
              <TabsContent value="Work Orders">

              </TabsContent>
              <TabsContent value="PAC Orders">

              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}


export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname
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

        <Button
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.to
              ? "bg-[#232324] hover:bg-muted/50 w-[90%]     "
              : "hover:bg-muted/50 text-[#a1a1aa]  w-[90%]  ",
            "justify-start w-[90%] "
          )} >
          {item.title}
        </Button>
      ))
      }
    </nav >
  )
}
