import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, useActionData } from "@remix-run/react";
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
  Settings2
} from "lucide-react"
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { json, redirect } from "@remix-run/node";
import { createCacheHeaders, createSitemap } from "~/utils";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail } from '~/utils/user.server'
import { useEffect, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa";

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const paramsName = params.api
  return json(
    { user, paramsName },
  );
}

export default function SettingsGenerral() {
  const { user, dealer, paramsName } = useLoaderData()
  console.log(paramsName, 'paramsName')
  const salesDeal = [
    { label: 'financeManager', value: 'String?', },
    { label: 'userEmail', value: 'String?', },
    { label: 'userName', value: 'String?', },
    { label: 'financeManagerName', value: 'String?', },
    { label: 'email', value: 'String?', },
    { label: 'firstName', value: 'String?', },
    { label: 'lastName', value: 'String?', },
    { label: 'phone', value: 'String?', },
    { label: 'name', value: 'String?', },
    { label: 'address', value: 'String?', },
    { label: 'city', value: 'String?', },
    { label: 'postal', value: 'String?', },
    { label: 'province', value: 'String?', },
    { label: 'dl', value: 'String?', },
    { label: 'typeOfContact', value: 'String?', },
    { label: 'timeToContact', value: 'String?', },
    { label: 'dob', value: 'String?', },
    { label: 'othTax', value: 'String?', },
    { label: 'optionsTotal', value: 'String?', },
    { label: 'lienPayout', value: 'String?', },
    { label: 'leadNote', value: 'String?', },
    { label: 'sendToFinanceNow', value: 'String?', },
    { label: 'dealNumber', value: 'String?', },
    { label: 'iRate', value: 'String?', },
    { label: 'months', value: 'String?', },
    { label: 'discount', value: 'String?', },
    { label: 'total', value: 'String?', },
    { label: 'onTax', value: 'String?', },
    { label: 'on60', value: 'String?', },
    { label: 'biweekly', value: 'String?', },
    { label: 'weekly', value: 'String?', },
    { label: 'weeklyOth', value: 'String?', },
    { label: 'biweekOth', value: 'String?', },
    { label: 'oth60', value: 'String?', },
    { label: 'weeklyqc', value: 'String?', },
    { label: 'biweeklyqc', value: 'String?', },
    { label: 'qc60', value: 'String?', },
    { label: 'deposit', value: 'String?', },
    { label: 'biweeklNatWOptions', value: 'String?', },
    { label: 'weeklylNatWOptions', value: 'String?', },
    { label: 'nat60WOptions', value: 'String?', },
    { label: 'weeklyOthWOptions', value: 'String?', },
    { label: 'biweekOthWOptions', value: 'String?', },
    { label: 'oth60WOptions', value: 'String?', },
    { label: 'biweeklNat', value: 'String?', },
    { label: 'weeklylNat', value: 'String?', },
    { label: 'nat60', value: 'String?', },
    { label: 'qcTax', value: 'String?', },
    { label: 'otherTax', value: 'String?', },
    { label: 'totalWithOptions', value: 'String?', },
    { label: 'otherTaxWithOptions', value: 'String?', },
    { label: 'desiredPayments', value: 'String?', },
    { label: 'admin', value: 'String?', },
    { label: 'commodity', value: 'String?', },
    { label: 'pdi', value: 'String?', },
    { label: 'discountPer', value: 'String?', },
    { label: 'userLoanProt', value: 'Int?', },
    { label: 'userTireandRim', value: 'String?', },
    { label: 'userGap', value: 'Int?', },
    { label: 'userExtWarr', value: 'String?', },
    { label: 'userServicespkg', value: 'Int?', },
    { label: 'deliveryCharge', value: 'Int?', },
    { label: 'vinE', value: 'Int?', },
    { label: 'lifeDisability', value: 'Int?', },
    { label: 'rustProofing', value: 'Int?', },
    { label: 'userOther', value: 'Int?', },
    { label: 'referral', value: 'String?', },
    { label: 'visited', value: 'String?', },
    { label: 'bookedApt', value: 'String?', },
    { label: 'aptShowed', value: 'String?', },
    { label: 'aptNoShowed', value: 'String?', },
    { label: 'testDrive', value: 'String?', },
    { label: 'metService', value: 'String?', },
    { label: 'metManager', value: 'String?', },
    { label: 'metParts', value: 'String?', },
    { label: 'sold', value: 'String?', },
    { label: 'depositMade', value: 'String?', },
    { label: 'refund', value: 'String?', },
    { label: 'turnOver', value: 'String?', },
    { label: 'financeApp', value: 'String?', },
    { label: 'approved', value: 'String?', },
    { label: 'signed', value: 'String?', },
    { label: 'pickUpSet', value: 'String?', },
    { label: 'demoed', value: 'String?', },
    { label: 'lastContact', value: 'String?', },
    { label: 'status', value: 'String?', },
    { label: 'customerState', value: 'String?', },
    { label: 'result', value: 'String?', },
    { label: 'timesContacted', value: 'String?', },
    { label: 'nextAppointment', value: 'String?', },
    { label: 'followUpDay', value: 'String?', },
    { label: 'deliveryDate', value: 'String?', },
    { label: 'delivered', value: 'String?', },
    { label: 'deliveredDate', value: 'String?', },
    { label: 'notes', value: 'String?', },
    { label: 'visits', value: 'String?', },
    { label: 'progress', value: 'String?', },
    { label: 'metSalesperson', value: 'String?', },
    { label: 'metFinance', value: 'String?', },
    { label: 'financeApplication', value: 'String?', },
    { label: 'pickUpDate', value: 'String?', },
    { label: 'pickUpTime', value: 'String?', },
    { label: 'depositTakenDate', value: 'String?', },
    { label: 'docsSigned', value: 'String?', },
    { label: 'tradeRepairs', value: 'String?', },
    { label: 'seenTrade', value: 'String?', },
    { label: 'lastNote', value: 'String?', },
    { label: 'applicationDone', value: 'String?', },
    { label: 'licensingSent', value: 'String?', },
    { label: 'liceningDone', value: 'String?', },
    { label: 'refunded', value: 'String?', },
    { label: 'cancelled', value: 'String?', },
    { label: 'lost', value: 'String?', },
    { label: 'dLCopy', value: 'String?', },
    { label: 'insCopy', value: 'String?', },
    { label: 'testDrForm', value: 'String?', },
    { label: 'voidChq', value: 'String?', },
    { label: 'loanOther', value: 'String?', },
    { label: 'signBill', value: 'String?', },
    { label: 'ucda', value: 'String?', },
    { label: 'tradeInsp', value: 'String?', },
    { label: 'customerWS', value: 'String?', },
    { label: 'otherDocs', value: 'String?', },
    { label: 'urgentFinanceNote', value: 'String?', },
    { label: 'funded', value: 'String?', },
    { label: 'leadSource', value: 'String?', },
    { label: 'financeDeptProductsTotal', value: 'String?', },
    { label: 'bank', value: 'String?', },
    { label: 'loanNumber', value: 'String?', },
    { label: 'idVerified', value: 'String?', },
    { label: 'dealerCommission', value: 'String?', },
    { label: 'financeCommission', value: 'String?', },
    { label: 'salesCommission', value: 'String?', },
    { label: 'firstPayment', value: 'String?', },
    { label: 'loanMaturity', value: 'String?', },
    { label: 'quoted', value: 'String?', },
    { label: 'InPerson', value: 'Int?', },
    { label: 'Phone', value: 'Int?', },
    { label: 'SMS', value: 'Int?', },
    { label: 'Email', value: 'Int?', },
    { label: 'Other', value: 'Int?', },
    { label: 'paintPrem', value: 'String?', },
    { label: 'licensing', value: 'String?', },
    { label: 'stockNum', value: 'String?', },
    { label: 'options', value: 'String?', },
    { label: 'accessories', value: 'Float?', },
    { label: 'freight', value: 'String?', },
    { label: 'labour', value: 'String?', },
    { label: 'year', value: 'String?', },
    { label: 'brand', value: 'String?', },
    { label: 'mileage', value: 'String?', },
    { label: 'model', value: 'String?', },
    { label: 'model1', value: 'String?', },
    { label: 'color', value: 'String?', },
    { label: 'modelCode', value: 'String?', },
    { label: 'msrp', value: 'String?', },
    { label: 'trim', value: 'String?', },
    { label: 'vin', value: 'String?', },
    { label: 'bikeStatus', value: 'String?', },
    { label: 'invId', value: 'String?', },
    { label: 'motor', value: 'String?', },
    { label: 'tag', value: 'String?', },
    { label: 'tradeValue', value: 'String?', },
    { label: 'tradeDesc', value: 'String?', },
    { label: 'tradeColor', value: 'String?', },
    { label: 'tradeYear', value: 'String?', },
    { label: 'tradeMake', value: 'String?', },
    { label: 'tradeVin', value: 'String?', },
    { label: 'tradeTrim', value: 'String?', },
    { label: 'tradeMileage', value: 'String?', },
    { label: 'tradeLocation', value: 'String?', },
    { label: 'lien', value: 'String?', },
    { label: 'id', value: 'String', },
    { label: 'activixId', value: 'String?', },
    { label: 'theRealActId', value: 'String?', },
    { label: 'createdAt', value: 'DateTime ', },
    { label: 'updatedAt', value: 'DateTime ', },
    { label: 'clientfileId', value: 'String?', },
    { label: 'inventoryMotorcycleId', value: 'String?', },
    { label: 'InventoryMotorcycle', value: 'InventoryMotorcycle?', },
    { label: 'financeStorage', value: 'FinanceStorage[]', },
    { label: 'clientApts', value: 'ClientApts[]', },
    { label: 'Comm', value: 'Comm[]', },
    { label: 'FinanceDeptProducts', value: 'FinanceDeptProducts[]', },
    { label: 'FinanceUnit', value: 'FinanceUnit[]', },
    { label: 'FinanceTradeUnit', value: 'FinanceTradeUnit[]', },
    { label: 'AccOrders', value: 'AccOrder[]', },
    { label: 'WorkOrders', value: 'WorkOrder[]', },
    { label: 'Payments', value: 'Payment[]', },
    { label: 'FinanceNote', value: 'FinanceNote[]', },
    { label: 'Clientfile', value: 'Clientfile?', },
    { label: 'finManOptions', value: 'FinManOptions[]', },
    { label: 'bmwMotoOptions', value: 'BmwMotoOptions[]', },
    { label: 'uCDAForm', value: 'UCDAForm[]', },
    { label: 'FinCanOptions', value: 'FinCanOptions[]', },
  ];
  const userData = [
    { label: 'id', value: 'String' },
    { label: 'createdAt', value: 'DateTime' },
    { label: 'updatedAt', value: 'DateTime' },
    { label: 'name', value: 'String' },
    { label: 'username', value: 'String' },
    { label: 'email', value: 'String' },
    { label: 'profileId', value: 'String' },
    { label: 'phone', value: 'String?' },
    { label: 'roleId', value: 'String' },
    { label: 'subscriptionId', value: 'String?' },
    { label: 'returning', value: 'Boolean?' },
    { label: 'lastSubscriptionCheck', value: 'String?' },
    { label: 'customerId', value: 'String?' },
    { label: 'plan', value: 'String?' },
    { label: 'omvicNumber', value: 'String?' },
    { label: 'dealer', value: 'String?' },
    { label: 'dept', value: 'String?' },
    { label: 'order', value: 'Int?' },
    { label: 'activixActivated', value: 'String?' },
    { label: 'activixEmail', value: 'String?' },
    { label: 'activisUserId', value: 'String?' },
    { label: 'activixId', value: 'String?' },
    { label: 'dealerAccountId', value: 'String?' },
    { label: 'microId', value: 'String?' },
    { label: 'givenName', value: 'String?' },
    { label: 'familyName', value: 'String?' },
    { label: 'identityProvider', value: 'String?' },
    { label: 'timeEntries', value: 'TimeEntry[]' },
    { label: 'workorders', value: 'Workorder[]' },
    { label: 'positions', value: 'Position[]' },
    { label: 'userGoals', value: 'UserGoals[]' },
    { label: 'thirtyDayGoals', value: 'ThirtyDayGoal[]' },
    { label: 'columnStateSales', value: 'ColumnStateSales?' },
    { label: 'ColumnStateInventory', value: 'ColumnStateInventory?' },
    { label: 'ColumnStateClient', value: 'ColumnStateClient?' },
    { label: 'customerSync', value: 'CustomerSync?' },
    { label: 'userRoleId', value: 'String?' },
    { label: 'role', value: 'UserRole' },
    { label: 'NotificationsUser', value: 'NotificationsUser[]' },
    { label: 'profile', value: 'UserProfile          ' },
    { label: 'images', value: 'Image[]' },
    { label: 'notes', value: 'Note[]' },
    { label: 'SavedDocuments', value: 'SavedDocuments[]' },
    { label: 'dealerId', value: 'Int?' },
    { label: 'Dealer', value: 'Dealer?' },
  ]
  const userDataCopy = `const userData = {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      username: data.username,
      email: data.email,
      profileId: data.profileId,
      phone: data.phone,
      roleId: data.roleId,
      subscriptionId: data.subscriptionId,
      returning: data.returning,
      lastSubscriptionCheck: data.lastSubscriptionCheck,
      customerId: data.customerId,
      plan: data.plan,
      omvicNumber: data.omvicNumber,
      dealer: data.dealer,
      dept: data.dept,
      order: data.order,
      activixActivated: data.activixActivated,
      activixEmail: data.activixEmail,
      activisUserId: data.activisUserId,
      activixId: data.activixId,
      dealerAccountId: data.dealerAccountId,
      microId: data.microId,
      givenName: data.givenName,
      familyName: data.familyName,
      identityProvider: data.identityProvider,
      timeEntries: data.timeEntries,
      workorders: data.workorders,
      positions: data.positions,
      userGoals: data.userGoals,
      thirtyDayGoals: data.thirtyDayGoals,
      columnStateSales: data.columnStateSales,
      ColumnStateInventory: data.ColumnStateInventory,
      ColumnStateClient: data.ColumnStateClient,
      customerSync: data.customerSync,
      userRoleId: data.userRoleId,
      role: data.role,
      NotificationsUser: data.NotificationsUser,
      profile: data.profile,
      images: data.images,
      notes: data.notes,
      SavedDocuments: data.SavedDocuments,
      dealerId: data.dealerId,
      Dealer: data.Dealer,
    }`
  const Clientfile = [
    { label: 'id', value: "String" },
    { label: 'createdAt', value: "DateTime" },
    { label: 'updatedAt', value: "DateTime" },
    { label: 'financeId', value: "String?" },
    { label: 'userId', value: "String?" },
    { label: 'firstName', value: "String?" },
    { label: 'lastName', value: "String?" },
    { label: 'name', value: "String?" },
    { label: 'email', value: "String?" },
    { label: 'phone', value: "String?" },
    { label: 'address', value: "String?" },
    { label: 'city', value: "String?" },
    { label: 'postal', value: "String?" },
    { label: 'province', value: "String?" },
    { label: 'dl', value: "String?" },
    { label: 'typeOfContact', value: "String?" },
    { label: 'timeToContact', value: "String?" },
    { label: 'conversationId', value: "String?" },
    { label: 'billingAddress', value: "Boolean?" },
    { label: 'dob', value: "String?" },
    { label: 'AccOrder', value: "AccOrder[]" },
    { label: 'Finance', value: "Finance[]" },
    { label: 'WorkOrder', value: "WorkOrder[]" },
    { label: 'ServiceUnit', value: "ServiceUnit[]" },
    { label: 'Comm', value: "Comm[]" },
  ]
  const clientFileCopy = `const clientData = {
id: data.id,
createdAt: data.createdAt,
updatedAt: data.updatedAt,
financeId: data.financeId,
userId: data.userId,
firstName: data.firstName,
lastName: data.lastName,
name: data.name,
email: data.email,
phone: data.phone,
address: data.address,
city: data.city,
postal: data.postal,
province: data.province,
dl: data.dl,
typeOfContact: data.typeOfContact,
timeToContact: data.timeToContact,
conversationId: data.conversationId,
billingAddress: data.billingAddress,
dob: data.dob,
AccOrder: data.AccOrder,
Finance: data.Finance,
WorkOrder: data.WorkOrder,
ServiceUnit: data.ServiceUnit,
Comm: data.Comm,
}`
  const glossary = [
    { label: 'If it does not have anything trailing the type, than it is required value.', value: null },
    { label: '?: Indicates that it is not required.', value: null },
    { label: '[]: Indicates that additional information may be connected in the form of an array of several objects.', value: null },
    { label: 'String: String, ie this whole value for example.', value: null },
    { label: 'Int: Integer, ie 10', value: null },
    { label: 'Float: Floating number or decimal number, ie 1.13', value: null },
    { label: 'FinanceStorage FinanceStorage[]: Signifies that the current object can have an attached dataset from FianceStorate in the form of an array that will have several objects.', value: null },
    { label: 'InventoryMotorcycle InventoryMotorcycle? : It may or may not have a single object attached.', value: null },
    { label: 'Copy cheat: Opposite of the title for each dataset there will be a copy button to quickly copy the entire set in the form of an object to map the data, just paste it into your code. The value in this copy will be an array with other attached arrays, it will be the most common to make it even easier for you. Its quite large, but is a good representation of how each data set can be connected to eachother. You will notice some commented out values, that can be continued to be mapped to other sets. Never had a means for them, but left them there for reference in case they were ever needed.', value: null },
  ]
  const glossaryCopy = `const glossaryData = {
  financeManager: data.financeManager,
  userEmail: data.userEmail,
  userName: data.userName,
  financeManagerName: data.financeManagerName,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  phone: data.phone,
  name: data.name,
  address: data.address,
  city: data.city,
  postal: data.postal,
  province: data.province,
  dl: data.dl,
  typeOfContact: data.typeOfContact,
  timeToContact: data.timeToContact,
  dob: data.dob,
  othTax: data.othTax,
  optionsTotal: data.optionsTotal,
  lienPayout: data.lienPayout,
  leadNote: data.leadNote,
  sendToFinanceNow: data.sendToFinanceNow,
  dealNumber: data.dealNumber,
  iRate: data.iRate,
  months: data.months,
  discount: data.discount,
  total: data.total,
  onTax: data.onTax,
  on60: data.on60,
  biweekly: data.biweekly,
  weekly: data.weekly,
  weeklyOth: data.weeklyOth,
  biweekOth: data.biweekOth,
  oth60: data.oth60,
  weeklyqc: data.weeklyqc,
  biweeklyqc: data.biweeklyqc,
  qc60: data.qc60,
  deposit: data.deposit,
  biweeklNatWOptions: data.biweeklNatWOptions,
  weeklylNatWOptions: data.weeklylNatWOptions,
  nat60WOptions: data.nat60WOptions,
  weeklyOthWOptions: data.weeklyOthWOptions,
  biweekOthWOptions: data.biweekOthWOptions,
  oth60WOptions: data.oth60WOptions,
  biweeklNat: data.biweeklNat,
  weeklylNat: data.weeklylNat,
  nat60: data.nat60,
  qcTax: data.qcTax,
  otherTax: data.otherTax,
  totalWithOptions: data.totalWithOptions,
  otherTaxWithOptions: data.otherTaxWithOptions,
  desiredPayments: data.desiredPayments,
  admin: data.admin,
  commodity: data.commodity,
  pdi: data.pdi,
  discountPer: data.discountPer,
  userLoanProt: data.userLoanProt,
  userTireandRim: data.userTireandRim,
  userGap: data.userGap,
  userExtWarr: data.userExtWarr,
  userServicespkg: data.userServicespkg,
  deliveryCharge: data.deliveryCharge,
  vinE: data.vinE,
  lifeDisability: data.lifeDisability,
  rustProofing: data.rustProofing,
  userOther: data.userOther,
  referral: data.referral,
  visited: data.visited,
  bookedApt: data.bookedApt,
  aptShowed: data.aptShowed,
  aptNoShowed: data.aptNoShowed,
  testDrive: data.testDrive,
  metService: data.metService,
  metManager: data.metManager,
  metParts: data.metParts,
  sold: data.sold,
  depositMade: data.depositMade,
  refund: data.refund,
  turnOver: data.turnOver,
  financeApp: data.financeApp,
  approved: data.approved,
  signed: data.signed,
  pickUpSet: data.pickUpSet,
  demoed: data.demoed,
  lastContact: data.lastContact,
  status: data.status,
  customerState: data.customerState,
  result: data.result,
  timesContacted: data.timesContacted,
  nextAppointment: data.nextAppointment,
  followUpDay: data.followUpDay,
  deliveryDate: data.deliveryDate,
  delivered: data.delivered,
  deliveredDate: data.deliveredDate,
  notes: data.notes,
  visits: data.visits,
  progress: data.progress,
  metSalesperson: data.metSalesperson,
  metFinance: data.metFinance,
  financeApplication: data.financeApplication,
  pickUpDate: data.pickUpDate,
  pickUpTime: data.pickUpTime,
  depositTakenDate: data.depositTakenDate,
  docsSigned: data.docsSigned,
  tradeRepairs: data.tradeRepairs,
  seenTrade: data.seenTrade,
  lastNote: data.lastNote,
  applicationDone: data.applicationDone,
  licensingSent: data.licensingSent,
  liceningDone: data.liceningDone,
  refunded: data.refunded,
  cancelled: data.cancelled,
  lost: data.lost,
  dLCopy: data.dLCopy,
  insCopy: data.insCopy,
  testDrForm: data.testDrForm,
  voidChq: data.voidChq,
  loanOther: data.loanOther,
  signBill: data.signBill,
  ucda: data.ucda,
  tradeInsp: data.tradeInsp,
  customerWS: data.customerWS,
  otherDocs: data.otherDocs,
  urgentFinanceNote: data.urgentFinanceNote,
  funded: data.funded,
  leadSource: data.leadSource,
  financeDeptProductsTotal: data.financeDeptProductsTotal,
  bank: data.bank,
  loanNumber: data.loanNumber,
  idVerified: data.idVerified,
  dealerCommission: data.dealerCommission,
  financeCommission: data.financeCommission,
  salesCommission: data.salesCommission,
  firstPayment: data.firstPayment,
  loanMaturity: data.loanMaturity,
  quoted: data.quoted,
  InPerson: data.InPerson,
  Phone: data.Phone,
  SMS: data.SMS,
  Email: data.Email,
  Other: data.Other,
  paintPrem: data.paintPrem,
  licensing: data.licensing,
  stockNum: data.stockNum,
  options: data.options,
  accessories: data.accessories,
  freight: data.freight,
  labour: data.labour,
  year: data.year,
  brand: data.brand,
  mileage: data.mileage,
  model: data.model,
  model1: data.model1,
  color: data.color,
  modelCode: data.modelCode,
  msrp: data.msrp,
  trim: data.trim,
  vin: data.vin,
  bikeStatus: data.bikeStatus,
  invId: data.invId,
  motor: data.motor,
  tag: data.tag,
  tradeValue: data.tradeValue,
  tradeDesc: data.tradeDesc,
  tradeColor: data.tradeColor,
  tradeYear: data.tradeYear,
  tradeMake: data.tradeMake,
  tradeVin: data.tradeVin,
  tradeTrim: data.tradeTrim,
  tradeMileage: data.tradeMileage,
  tradeLocation: data.tradeLocation,
  lien: data.lien,
  id: data.id,
  activixId: data.activixId,
  theRealActId: data.theRealActId,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  clientfileId: data.clientfileId,
  inventoryMotorcycleId: data.inventoryMotorcycleId,
  InventoryMotorcycle: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      packageNumber: data.packageNumber,
      packagePrice: data.packagePrice,
      stockNumber: data.stockNumber,
      type: data.type,
      class: data.class,
      year: data.year,
      make: data.make,
      model: data.model,
      modelName: data.modelName,
      submodel: data.submodel,
      subSubmodel: data.subSubmodel,
      price: data.price,
      exteriorColor: data.exteriorColor,
      mileage: data.mileage,
      consignment: data.consignment,
      onOrder: data.onOrder,
      expectedOn: data.expectedOn,
      status: data.status,
      orderStatus: data.orderStatus,
      hdcFONumber: data.hdcFONumber,
      hdmcFONumber: data.hdmcFONumber,
      vin: data.vin,
      age: data.age,
      floorPlanDueDate: data.floorPlanDueDate,
      location: data.location,
      stocked: data.stocked,
      stockedDate: data.stockedDate,
      isNew: data.isNew,
      actualCost: data.actualCost,
      mfgSerialNumber: data.mfgSerialNumber,
      engineNumber: data.engineNumber,
      plates: data.plates,
      keyNumber: data.keyNumber,
      length: data.length,
      width: data.width,
      engine: data.engine,
      fuelType: data.fuelType,
      power: data.power,
      chassisNumber: data.chassisNumber,
      chassisYear: data.chassisYear,
      chassisMake: data.chassisMake,
      chassisModel: data.chassisModel,
      chassisType: data.chassisType,
      registrationState: data.registrationState,
      registrationExpiry: data.registrationExpiry,
      grossWeight: data.grossWeight,
      netWeight: data.netWeight,
      insuranceCompany: data.insuranceCompany,
      policyNumber: data.policyNumber,
      insuranceAgent: data.insuranceAgent,
      insuranceStartDate: data.insuranceStartDate,
      insuranceEndDate: data.insuranceEndDate,
      sold: data.sold,
      freight: data.freight,
      financeId: data.financeId,
    }
  },
  //  financeStorage
  clientApts: {
    select: {
      id: data.id,
      financeId: data.financeId,
      title: data.title,
      start: data.start,
      end: data.end,
      contactMethod: data.contactMethod,
      completed: data.completed,
      apptStatus: data.apptStatus,
      apptType: data.apptType,
      note: data.note,
      unit: data.unit,
      brand: data.brand,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      userEmail: data.userEmail,
      userId: data.userId,
      description: data.description,
      userName: data.userName,
      attachments: data.attachments,
      direction: data.direction,
      resultOfcall: data.resultOfcall,
      resourceId: data.resourceId,
      activixId: data.activixId,
      activixNoteId: data.activixNoteId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      isPublished: data.isPublished,
    }
  },
  Comm: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userEmail: data.userEmail,
      type: data.type,
      body: data.body,
      subject: data.subject,
      userName: data.userName,
      direction: data.direction,
      result: data.result,
      financeId: data.financeId,
    }
  },
  /*FinanceDeptProducts*/
  FinanceUnit: {
    select: {
      paintPrem: data.paintPrem,
      licensing: data.licensing,
      stockNum: data.stockNum,
      options: data.options,
      accessories: data.accessories,
      freight: data.freight,
      labour: data.labour,
      year: data.year,
      brand: data.brand,
      mileage: data.mileage,
      model: data.model,
      model1: data.model1,
      color: data.color,
      modelCode: data.modelCode,
      msrp: data.msrp,
      trim: data.trim,
      vin: data.vin,
      bikeStatus: data.bikeStatus,
      invId: data.invId,
      location: data.location,
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      financeId: data.financeId,
      // Finance
      //WorkOrders
    }
  },
  FinanceTradeUnit: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      financeId: data.financeId,
      price: data.price,
      brand: data.brand,
      model: data.model,
      color: data.color,
      accessories: data.accessories,
      options: data.options,
      year: data.year,
      vin: data.vin,
      trim: data.trim,
      mileage: data.mileage,
      location: data.location,
      condition: data.condition,
      repairs: data.repairs,
      stockNum: data.stockNum,
      licensing: data.licensing,
      tradeEval: data.tradeEval,
    }
  },
  AccOrders: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userEmail: data.userEmail,
      userName: data.userName,
      dept: data.dept,
      sellingDept: data.sellingDept,
      total: data.total,
      discount: data.discount,
      discPer: data.discPer,
      paid: data.paid,
      paidDate: data.paidDate,
      status: data.status,
      workOrderId: data.workOrderId,
      note: data.note,
      financeId: data.financeId,
      clientfileId: data.clientfileId,
      AccessoriesOnOrders: {
        select: {
          id: data.id,
          quantity: data.quantity,
          accOrderId: data.accOrderId,
          status: data.status,
          orderNumber: data.orderNumber,
          OrderInvId: data.OrderInvId,
          accessoryId: data.accessoryId,
          service: data.service,
          hour: data.hour,
          //orderInventor
          accessory: {
            select: {
              id: data.id,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              partNumber: data.partNumber,
              brand: data.brand,
              name: data.name,
              price: data.price,
              cost: data.cost,
              quantity: data.quantity,
              minQuantity: data.minQuantity,
              description: data.description,
              category: data.category,
              subCategory: data.subCategory,
              onOrder: data.onOrder,
              distributer: data.distributer,
              location: data.location,
              note: data.note,
              workOrderSuggestion: data.workOrderSuggestion,
            }
          },
          //accOrder
        }
      },
      Payments: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          paymentType: data.paymentType,
          cardType: data.cardType,
          amountPaid: data.amountPaid,
          cardNum: data.cardNum,
          receiptId: data.receiptId,
          financeId: data.financeId,
          userEmail: data.userEmail,
          accOrderId: data.accOrderId,
          workOrderId: data.workOrderId,
          // AccOrder
          //Finance
          //WorkOrder
        }
      },

      // WorkOrder
      //Finance
      AccHandoff: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          sendTo: data.sendTo,
          handOffTime: data.handOffTime,
          status: data.status,
          sendToCompleted: data.sendToCompleted,
          completedTime: data.completedTime,
          notes: data.notes,
          handOffDept: data.handOffDept,
          AccOrderId: data.AccOrderId,
          //AccOrder
        }
      }
      //Clientfile
    }
  },
  WorkOrders: {
    select: {
      workOrderId: data.workOrderId,
      unit: data.unit,
      mileage: data.mileage,
      vin: data.vin,
      tag: data.tag,
      motor: data.motor,
      color: data.color,
      budget: data.budget,
      waiter: data.waiter,
      totalLabour: data.totalLabour,
      totalParts: data.totalParts,
      subTotal: data.subTotal,
      total: data.total,
      writer: data.writer,
      userEmail: data.userEmail,
      tech: data.tech,
      discDollar: data.discDollar,
      discPer: data.discPer,
      techEmail: data.techEmail,
      notes: data.notes,
      customerSig: data.customerSig,
      status: data.status,
      location: data.location,
      quoted: data.quoted,
      paid: data.paid,
      remaining: data.remaining,
      FinanceUnitId: data.FinanceUnitId,
      ServiceUnitId: data.ServiceUnitId,
      financeId: data.financeId,
      clientfileId: data.clientfileId,
      note: data.note,
      closedAt: data.closedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      // FinanceUnit
      //onDelete
      //ServiceUnit
      AccOrders: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          userEmail: data.userEmail,
          userName: data.userName,
          dept: data.dept,
          sellingDept: data.sellingDept,
          total: data.total,
          discount: data.discount,
          discPer: data.discPer,
          paid: data.paid,
          paidDate: data.paidDate,
          status: data.status,
          workOrderId: data.workOrderId,
          note: data.note,
          financeId: data.financeId,
          clientfileId: data.clientfileId,
          AccessoriesOnOrders: {
            select: {
              id: data.id,
              quantity: data.quantity,
              accOrderId: data.accOrderId,
              status: data.status,
              orderNumber: data.orderNumber,
              OrderInvId: data.OrderInvId,
              accessoryId: data.accessoryId,
              service: data.service,
              hour: data.hour,
              //orderInventor
              accessory: {
                select: {
                  id: data.id,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  partNumber: data.partNumber,
                  brand: data.brand,
                  name: data.name,
                  price: data.price,
                  cost: data.cost,
                  quantity: data.quantity,
                  minQuantity: data.minQuantity,
                  description: data.description,
                  category: data.category,
                  subCategory: data.subCategory,
                  onOrder: data.onOrder,
                  distributer: data.distributer,
                  location: data.location,
                  note: data.note,
                  workOrderSuggestion: data.workOrderSuggestion,
                }
              },
              //accOrder
            }
          },
          Payments: {
            select: {
              id: data.id,
              createdAt: data.createdAt,
              paymentType: data.paymentType,
              cardType: data.cardType,
              amountPaid: data.amountPaid,
              cardNum: data.cardNum,
              receiptId: data.receiptId,
              financeId: data.financeId,
              userEmail: data.userEmail,
              accOrderId: data.accOrderId,
              workOrderId: data.workOrderId,
              // AccOrder
              //Finance
              //WorkOrder
            }
          },
          // WorkOrder
          //Finance
          //AccHandoff
          //Clientfile
        }
      },
      Clientfile: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          financeId: data.financeId,
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal: data.postal,
          province: data.province,
          dl: data.dl,
          typeOfContact: data.typeOfContact,
          timeToContact: data.timeToContact,
          conversationId: data.conversationId,
          billingAddress: data.billingAddress,
          dob: data.dob,
          Finance: {
            select: {
              financeManager: data.financeManager,
              userEmail: data.userEmail,
              userName: data.userName,
              financeManagerName: data.financeManagerName,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              name: data.name,
              address: data.address,
              city: data.city,
              postal: data.postal,
              province: data.province,
              dl: data.dl,
              typeOfContact: data.typeOfContact,
              timeToContact: data.timeToContact,
              dob: data.dob,
              othTax: data.othTax,
              optionsTotal: data.optionsTotal,
              lienPayout: data.lienPayout,
              leadNote: data.leadNote,
              sendToFinanceNow: data.sendToFinanceNow,
              dealNumber: data.dealNumber,
              iRate: data.iRate,
              months: data.months,
              discount: data.discount,
              total: data.total,
              onTax: data.onTax,
              on60: data.on60,
              biweekly: data.biweekly,
              weekly: data.weekly,
              weeklyOth: data.weeklyOth,
              biweekOth: data.biweekOth,
              oth60: data.oth60,
              weeklyqc: data.weeklyqc,
              biweeklyqc: data.biweeklyqc,
              qc60: data.qc60,
              deposit: data.deposit,
              biweeklNatWOptions: data.biweeklNatWOptions,
              weeklylNatWOptions: data.weeklylNatWOptions,
              nat60WOptions: data.nat60WOptions,
              weeklyOthWOptions: data.weeklyOthWOptions,
              biweekOthWOptions: data.biweekOthWOptions,
              oth60WOptions: data.oth60WOptions,
              biweeklNat: data.biweeklNat,
              weeklylNat: data.weeklylNat,
              nat60: data.nat60,
              qcTax: data.qcTax,
              otherTax: data.otherTax,
              totalWithOptions: data.totalWithOptions,
              otherTaxWithOptions: data.otherTaxWithOptions,
              desiredPayments: data.desiredPayments,
              admin: data.admin,
              commodity: data.commodity,
              pdi: data.pdi,
              discountPer: data.discountPer,
              userLoanProt: data.userLoanProt,
              userTireandRim: data.userTireandRim,
              userGap: data.userGap,
              userExtWarr: data.userExtWarr,
              userServicespkg: data.userServicespkg,
              deliveryCharge: data.deliveryCharge,
              vinE: data.vinE,
              lifeDisability: data.lifeDisability,
              rustProofing: data.rustProofing,
              userOther: data.userOther,
              referral: data.referral,
              visited: data.visited,
              bookedApt: data.bookedApt,
              aptShowed: data.aptShowed,
              aptNoShowed: data.aptNoShowed,
              testDrive: data.testDrive,
              metService: data.metService,
              metManager: data.metManager,
              metParts: data.metParts,
              sold: data.sold,
              depositMade: data.depositMade,
              refund: data.refund,
              turnOver: data.turnOver,
              financeApp: data.financeApp,
              approved: data.approved,
              signed: data.signed,
              pickUpSet: data.pickUpSet,
              demoed: data.demoed,
              delivered: data.delivered,
              lastContact: data.lastContact,
              status: data.status,
              customerState: data.customerState,
              result: data.result,
              timesContacted: data.timesContacted,
              nextAppointment: data.nextAppointment,
              followUpDay: data.followUpDay,
              deliveryDate: data.deliveryDate,
              deliveredDate: data.deliveredDate,
              notes: data.notes,
              visits: data.visits,
              progress: data.progress,
              metSalesperson: data.metSalesperson,
              metFinance: data.metFinance,
              financeApplication: data.financeApplication,
              pickUpDate: data.pickUpDate,
              pickUpTime: data.pickUpTime,
              depositTakenDate: data.depositTakenDate,
              docsSigned: data.docsSigned,
              tradeRepairs: data.tradeRepairs,
              seenTrade: data.seenTrade,
              lastNote: data.lastNote,
              applicationDone: data.applicationDone,
              licensingSent: data.licensingSent,
              liceningDone: data.liceningDone,
              refunded: data.refunded,
              cancelled: data.cancelled,
              lost: data.lost,
              dLCopy: data.dLCopy,
              insCopy: data.insCopy,
              testDrForm: data.testDrForm,
              voidChq: data.voidChq,
              loanOther: data.loanOther,
              signBill: data.signBill,
              ucda: data.ucda,
              tradeInsp: data.tradeInsp,
              customerWS: data.customerWS,
              otherDocs: data.otherDocs,
              urgentFinanceNote: data.urgentFinanceNote,
              funded: data.funded,
              leadSource: data.leadSource,
              financeDeptProductsTotal: data.financeDeptProductsTotal,
              bank: data.bank,
              loanNumber: data.loanNumber,
              idVerified: data.idVerified,
              dealerCommission: data.dealerCommission,
              financeCommission: data.financeCommission,
              salesCommission: data.salesCommission,
              firstPayment: data.firstPayment,
              loanMaturity: data.loanMaturity,
              quoted: data.quoted,
              InPerson: data.InPerson,
              Phone: data.Phone,
              SMS: data.SMS,
              Email: data.Email,
              Other: data.Other,
              paintPrem: data.paintPrem,
              licensing: data.licensing,
              stockNum: data.stockNum,
              options: data.options,
              accessories: data.accessories,
              freight: data.freight,
              labour: data.labour,
              year: data.year,
              brand: data.brand,
              mileage: data.mileage,
              model: data.model,
              model1: data.model1,
              color: data.color,
              modelCode: data.modelCode,
              msrp: data.msrp,
              trim: data.trim,
              vin: data.vin,
              bikeStatus: data.bikeStatus,
              invId: data.invId,
              tradeValue: data.tradeValue,
              tradeDesc: data.tradeDesc,
              tradeColor: data.tradeColor,
              tradeYear: data.tradeYear,
              tradeMake: data.tradeMake,
              tradeVin: data.tradeVin,
              tradeTrim: data.tradeTrim,
              tradeMileage: data.tradeMileage,
              tradeLocation: data.tradeLocation,
              lien: data.lien,
              id: data.id,
              activixId: data.activixId,
              theRealActId: data.theRealActId,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              FinanceUnit: {
                select: {
                  paintPrem: data.paintPrem,
                  licensing: data.licensing,
                  stockNum: data.stockNum,
                  options: data.options,
                  accessories: data.accessories,
                  freight: data.freight,
                  labour: data.labour,
                  year: data.year,
                  brand: data.brand,
                  mileage: data.mileage,
                  model: data.model,
                  model1: data.model1,
                  color: data.color,
                  modelCode: data.modelCode,
                  msrp: data.msrp,
                  trim: data.trim,
                  vin: data.vin,
                  bikeStatus: data.bikeStatus,
                  invId: data.invId,
                  location: data.location,
                  id: data.id,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  financeId: data.financeId,
                }
              },
            }
          },
          ServiceUnit: {
            select: {
              id: data.id,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              price: data.price,
              brand: data.brand,
              model: data.model,
              color: data.color,
              accessories: data.accessories,
              options: data.options,
              year: data.year,
              vin: data.vin,
              trim: data.trim,
              mileage: data.mileage,
              location: data.location,
              condition: data.condition,
              repairs: data.repairs,
              stockNum: data.stockNum,
              licensing: data.licensing,
              tradeEval: data.tradeEval,
            }
          },
          // AccOrder
          //   Finance
          //   WorkOrder
          //   ServiceUnit
        }
      },
      WorkOrderNotes: {
        select: {
          id: data.id,
          body: data.body,
          userName: data.userName,
          userEmail: data.userEmail,
          workOrderId: data.workOrderId,
          createdAt: data.createdAt,
        }
      },
      //Finance
      //onDelete
      ServicesOnWorkOrders: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          quantity: data.quantity,
          hr: data.hr,
          status: data.status,
          workOrderId: data.workOrderId,
          serviceId: data.serviceId,
          WorkOrder: data.WorkOrder,
          service: data.service,
        }
      },
      Payments: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          paymentType: data.paymentType,
          cardType: data.cardType,
          amountPaid: data.amountPaid,
          cardNum: data.cardNum,
          receiptId: data.receiptId,
          financeId: data.financeId,
          userEmail: data.userEmail,
          accOrderId: data.accOrderId,
          workOrderId: data.workOrderId,
          // AccOrder
          //Finance
          //WorkOrder
        }
      },
      WorkOrderApts: {
        select: {
          id: data.id,
          tech: data.tech,
          techEmail: data.techEmail,
          writer: data.writer,
          start: data.start,
          end: data.end,
          title: data.title,
          workOrderId: data.workOrderId,
          completed: data.completed,
          resourceId: data.resourceId,
          unit: data.unit,
          mileage: data.mileage,
          vin: data.vin,
          tag: data.tag,
          motor: data.motor,
          color: data.color,
          location: data.location,
          WorkOrder: data.WorkOrder,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      },
      WorkOrderClockEntries: {
        select: {
          id: data.id,
          start: data.start,
          end: data.end,
          userEmail: data.userEmail,
          username: data.username,
          workOrderId: data.workOrderId,
          WorkOrder: data.WorkOrder,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      }
    }
  },
  Payments: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      paymentType: data.paymentType,
      cardType: data.cardType,
      amountPaid: data.amountPaid,
      cardNum: data.cardNum,
      receiptId: data.receiptId,
      financeId: data.financeId,
      userEmail: data.userEmail,
      accOrderId: data.accOrderId,
      workOrderId: data.workOrderId,
      // AccOrder
      //Finance
      //WorkOrder
    }
  },
  FinanceNote: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      body: data.body,
      userEmail: data.userEmail,
      userName: data.userName,
      clientfileId: data.clientfileId,
      financeId: data.financeId,
      selectedUsers: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          selectedName: data.selectedName,
          selectedEmail: data.selectedEmail,
          FinanceNoteId: data.FinanceNoteId,
        }
      }
    }
  },
  Clientfile: {
    select: {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      financeId: data.financeId,
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postal: data.postal,
      province: data.province,
      dl: data.dl,
      typeOfContact: data.typeOfContact,
      timeToContact: data.timeToContact,
      conversationId: data.conversationId,
      billingAddress: data.billingAddress,
      dob: data.dob,
      AccOrder: {
        select: {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          userEmail: data.userEmail,
          userName: data.userName,
          dept: data.dept,
          sellingDept: data.sellingDept,
          total: data.total,
          discount: data.discount,
          discPer: data.discPer,
          paid: data.paid,
          paidDate: data.paidDate,
          status: data.status,
          workOrderId: data.workOrderId,
          note: data.note,
          financeId: data.financeId,
          clientfileId: data.clientfileId,
          AccessoriesOnOrders: {
            select: {
              id: data.id,
              quantity: data.quantity,
              accOrderId: data.accOrderId,
              status: data.status,
              orderNumber: data.orderNumber,
              OrderInvId: data.OrderInvId,
              accessoryId: data.accessoryId,
              service: data.service,
              hour: data.hour,
              //orderInventor
              accessory: {
                select: {
                  id: data.id,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  partNumber: data.partNumber,
                  brand: data.brand,
                  name: data.name,
                  price: data.price,
                  cost: data.cost,
                  quantity: data.quantity,
                  minQuantity: data.minQuantity,
                  description: data.description,
                  category: data.category,
                  subCategory: data.subCategory,
                  onOrder: data.onOrder,
                  distributer: data.distributer,
                  location: data.location,
                  note: data.note,
                  workOrderSuggestion: data.workOrderSuggestion,
                }
              },
              //accOrder
            }
          },
          Payments: {
            select: {
              id: data.id,
              createdAt: data.createdAt,
              paymentType: data.paymentType,
              cardType: data.cardType,
              amountPaid: data.amountPaid,
              cardNum: data.cardNum,
              receiptId: data.receiptId,
              financeId: data.financeId,
              userEmail: data.userEmail,
              accOrderId: data.accOrderId,
              workOrderId: data.workOrderId,
              // AccOrder
              //Finance
              //WorkOrder
            }
          },
          // WorkOrder
          //Finance
          AccHandoff: {
            select: {
              id: data.id,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              sendTo: data.sendTo,
              handOffTime: data.handOffTime,
              status: data.status,
              sendToCompleted: data.sendToCompleted,
              completedTime: data.completedTime,
              notes: data.notes,
              handOffDept: data.handOffDept,
              AccOrderId: data.AccOrderId,
            }
          }
          //Clientfile
        }
      },
      //Finance
      //WorkOrder
      //ServiceUnit
    }
  },
  //  finManOptions
  //bmwMotoOptions
  //FinCanOptions
}
`
  const commData = [
    { label: 'id', value: 'String' },
    { label: 'createdAt', value: 'DateTime' },
    { label: 'updatedAt', value: 'DateTime' },
    { label: 'userEmail', value: 'String?' },
    { label: 'type', value: 'String?' },
    { label: 'body', value: 'String?' },
    { label: 'subject', value: 'String?' },
    { label: 'userName', value: 'String?' },
    { label: 'direction', value: 'String?' },
    { label: 'result', value: 'String?' },
    { label: 'ClientfileId', value: 'String?' },
    { label: 'Clientfile', value: 'Clientfile?' },
    { label: 'financeId', value: 'String?' },
    { label: 'Finance', value: 'Finance?' },
  ]
  const commCopy = `const data = {
id: data.id,
createdAt: data.createdAt,
updatedAt: data.updatedAt,
userEmail: data.userEmail,
type: data.type,
body: data.body,
subject: data.subject,
userName: data.userName,
direction: data.direction,
result: data.result,
ClientfileId: data.ClientfileId,
Clientfile: data.Clientfile,
financeId: data.financeId,
Finance: data.Finance,
}`
  const serviceUnitData = [
    { label: 'id', value: 'String' },
    { label: 'createdAt', value: 'DateTime' },
    { label: 'updatedAt', value: 'DateTime' },
    { label: 'price', value: 'String?' },
    { label: 'brand', value: 'String?' },
    { label: 'model', value: 'String?' },
    { label: 'color', value: 'String?' },
    { label: 'accessories', value: 'String?' },
    { label: 'options', value: 'String?' },
    { label: 'year', value: 'String?' },
    { label: 'vin', value: 'String?' },
    { label: 'trim', value: 'String?' },
    { label: 'mileage', value: 'String?' },
    { label: 'location', value: 'String?' },
    { label: 'condition', value: 'String?' },
    { label: 'repairs', value: 'String?' },
    { label: 'stockNum', value: 'String?' },
    { label: 'motor', value: 'String?' },
    { label: 'tag', value: 'String?' },
    { label: 'licensing', value: 'Boolean?' },
    { label: 'tradeEval', value: 'Boolean?' },
    { label: 'clientfileId', value: 'String?' },
    { label: 'WorkOrders', value: 'WorkOrder[]' },
    { label: 'Clientfile', value: 'Clientfile?' },
  ]
  const serviceUnit = `const data = {
id: data.id,
createdAt: data.createdAt,
updatedAt: data.updatedAt,
price: data.price,
brand: data.brand,
model: data.model,
color: data.color,
accessories: data.accessories,
options: data.options,
year: data.year,
vin: data.vin,
trim: data.trim,
mileage: data.mileage,
location: data.location,
condition: data.condition,
repairs: data.repairs,
stockNum: data.stockNum,
motor: data.motor,
tag: data.tag,
licensing: data.licensing,
tradeEval: data.tradeEval,
clientfileId: data.clientfileId,
WorkOrders: data.WorkOrders,
Clientfile: data.Clientfile,
}`
  // { label: 'id', value: 'String' },

  const [apiInfo, setApiInfo] = useState(salesDeal)
  const [apiName, setApiName] = useState('Sales Deals')
  const [getCopy, setGetCopy] = useState(clientFileCopy)
  const [isFile, setIsfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    switch (paramsName) {
      case 'salesDeals':
        setApiName('Sales Deals')
        setApiInfo(salesDeal)
        setGetCopy(clientFileCopy)
        break;
      case 'Glossary':
        setApiName('Glossary')
        setApiInfo(glossary)
        setGetCopy(glossaryCopy)
        break;
      case 'clients':
        setApiName('Clients')
        setApiInfo(Clientfile)
        setGetCopy(clientFileCopy)
        break;
      case 'users':
        setApiName('Users')
        setApiInfo(userData)
        setGetCopy(userDataCopy)
        break;
      case 'comm':
        setApiName('Communications')
        setApiInfo(commData)
        setGetCopy(commCopy)
        break;
      case 'serviceUnit':
        setApiName('Service Unit')
        setApiInfo(serviceUnitData)
        setGetCopy(serviceUnit)
        break;
      case 'workOrderTechTimes':
        setApiName('Work Order Tech Times')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'workOrderApts':
        setApiName('Work Order Apts')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'workOrderNotes':
        setApiName('Work Order Notes')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'workOrders':
        setApiName('Work Orders')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'inventory':
        setApiName('Inventory')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'financePayment':
        setApiName('Sales Deal Payment')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'financeNote':
        setApiName('Sales Deals Note')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'pacOrders':
        setApiName('PAC Orders')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'servicesOnWorkOrders':
        setApiName('Services On Work Orders')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'accessories':
        setApiName('Accessories')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'accOrder':
        setApiName('Acc Order')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'payment':
        setApiName('Payment')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'orderInventory':
        setApiName('Order Inventory')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'clientApts':
        setApiName('Client Apts')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'dealer':
        setApiName('Dealer')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      case 'notificationsUser':
        setApiName('Notifications')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
      default:
        setApiName('Dealer')
        setApiInfo(userData)
        setGetCopy(clientFileCopy)
        break;
    }
  }, [paramsName]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 3000);
      })
      .catch((error) => {
      });
  };
  const [copiedText, setCopiedText] = useState();
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])


  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1" className='h-full max-h-[500px]'>
        <CardHeader>
          <CardTitle className="flex justify-between items-center"><p>{apiName} </p>   <Button
            size="icon"
            variant="outline"
            onClick={() => copyText(getCopy)}
            className="h-7 w-7   ml-2"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          </CardTitle>
          <CardDescription>
            Find out what kind of data you can and cannot assign in the database.

          </CardDescription>
        </CardHeader>
        <CardContent className='h-auto overflow-y-auto  max-h-[425px] '>
          <ul className="grid gap-y-3 text-sm mt-2">
            {apiInfo.map((api, index) => (

              <li key={index} className=" group flex items-center justify-between">
                <div className='flex'>
                  <span className="text-muted-foreground">
                    {api.label}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyText(api.value)}
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  {copiedText === api.value && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                </div>
                <p className='max-w-3/4 text-right'>{api.value}  </p>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="border-t border-border px-6 py-4">
          <div>

          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "Import Export Documentation || ADMIN || Dealer Sales Assistant" },
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


