import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, useNavigation } from "@remix-run/react";
import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
  CardFooter,
} from "~/components";

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
import { useState } from "react";
import { Resend } from "resend";
import { forbidden } from "remix-utils";
import { requireUserRole, requireUserSession } from "~/helpers";
import { EmployEmail } from "../employeeOnboarding";
import { ButtonLoading } from "~/components/ui/button-loading";


export async function loader({ request, params }: LoaderArgs) {
  // const users = await model.adminUser.query.getAll();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      positions: { select: { position: true } },
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      profile: true,
      activisUserId: true,
      activixEmail: true,
      activixActivated: true,
      activixId: true,
      dealerAccountId: true,
      microId: true,
      givenName: true,
      familyName: true,
      identityProvider: true,
      plan: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  const userCount = await model.adminUser.query.count();
  const userRoles = await model.userRole.query.getAll();
  const usersCount = users.length;
  const userRole = await prisma.userRole.findMany()
  return json({ users, usersCount, userCount, userRole, userRoles });
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const resend = new Resend(process.env.resend_API_KEY);


  const user = await GetUser(email)
  const isActionAllowed = requireUserRole(user, ["ADMIN", "MANAGER"]);
  if (!isActionAllowed) {
    return forbidden({ message: "Not allowed" });
  }

  const formPayload = Object.fromEntries(await request.formData())

  const formData = financeFormSchema.parse(formPayload);
  const dealer = await prisma.dealer.findUnique({ where: { id: 1 } })

  if (formData.intent === "delete-all-users") {
    const deleteAll = await model.adminUser.mutation.deleteAll();
    return json(deleteAll);
  }

  if (formData.intent === "addUser") {
    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: formData.userRole },
    });
    const secondUserRole = await prisma.userRole.findFirst({
      where: { symbol: formPayload.newUserRole },
    });
    const userAdd = await prisma.user.create({
      data: {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        roleId: formData.roleId,
        omvicNumber: formData.omvicNumber,
        dealer: formData.dealer,
        dept: formData.dept,
        activixActivated: formData.activixEmail ? 'yes' : null,
        activixEmail: formData.activixEmail,
        activisUserId: formData.activisUserId,
        activixId: formData.activixId,
        dealerAccountId: formData.dealerAccountId,
        role: {
          connect: [{ id: defaultUserRole.id }, { id: secondUserRole.id ? secondUserRole.id : '' }]
        },
        customerSync: { create: { orderId: null } },
        profile: { create: { headline: "I am new here", bio: "This is my profile bio." } },
        ColumnStateInventory: { create: { state: { "id": false, "make": true, "type": false, "year": true, "class": false, "power": false, "width": false, "engine": false, "length": false, "plates": false, "stocked": true, "fuelType": false, "unitInfo": false, "keyNumber": false, "netWeight": false, "chassisMake": false, "chassisType": false, "chassisYear": false, "grossWeight": false, "hdcFONumber": false, "stockNumber": true, "chassisModel": false, "engineNumber": false, "hdmcFONumber": false, "packagePrice": false, "policyNumber": false, "chassisNumber": false, "packageNumber": false, "insuranceAgent": false, "mfgSerialNumber": false, "insuranceCompany": false, "insuranceEndDate": false, "registrationState": false, "insuranceStartDate": false, "registrationExpiry": false } } },
        columnStateSales: { create: { state: { "contactTimesByType": false, "unitPicker": false, "id": false, "email": false, "phone": false, "postal": false, "address": false, "city": false, "province": false, "financeId": false, "userEmail": false, "pickUpTime": false, "timeToContact": false, "deliveredDate": false, "msrp": false, "freight": false, "pdi": false, "admin": false, "commodity": false, "accessories": false, "labour": false, "painPrem": false, "licensing": false, "trailer": false, "depositMade": false, "months": false, "iRate": false, "on60": false, "biweekly": false, "weekly": false, "qc60": false, "biweeklyqc": false, "weeklyqc": false, "nat60": false, "biweeklNat": false, "weeklylNat": false, "oth60": false, "biweekOth": false, "weeklyOth": false, "nat60WOptions": false, "desiredPayments": false, "biweeklNatWOptions": false, "weeklylNatWOptions": false, "oth60WOptions": false, "biweekOthWOptions": false, "visited": false, "aptShowed": false, "bookedApt": false, "aptNoShowed": false, "testDrive": false, "metParts": false, "sold": false, "refund": false, "turnOver": false, "financeApp": false, "approved": false, "signed": false, "pickUpSet": false, "demoed": false, "tradeMake": false, "tradeYear": false, "tradeTrim": false, "tradeColor": false, "tradeVin": false, "delivered": false, "result": false, "referral": false, "metService": false, "metManager": false, "timesContacted": false, "visits": false, "financeApplication": false, "progress": false, "metFinance": false, "metSalesperson": false, "seenTrade": false, "docsSigned": false, "tradeRepairs": false, "tradeValue": false, "modelCode": false, "color": false, "model1": false, "stockNum": false, "otherTaxWithOptions": false, "totalWithOptions": false, "otherTax": false, "qcTax": false, "deposit": false, "rustProofing": false, "lifeDisability": false, "userServicespkg": false, "userExtWarr": false, "userGap": false, "userTireandRim": false, "userLoanProt": false, "deliveryCharge": false, "onTax": false, "total": false, "typeOfContact": false, "contactMethod": false, "note": false, } } },
      }
    })
    return json({ userAdd, email });
  }


  return redirect(`.`);
}


export default function SettingsGenerral() {
  const { users, usersCount, userCount, userRole, userRoles, } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [activixEmail, setActivixEmail] = useState('')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [dealer, setDealer] = useState('')
  const [omvicNumber, setOmvic] = useState('')
  const [position, setPosition] = useState('')

  const userData = [
    { name: 'name', defaultValue: name, label: 'Name' },
    { name: 'username', defaultValue: username, label: 'Username' },
    { name: 'email', defaultValue: email, label: 'Email' },
    { name: 'phone', defaultValue: phone, label: 'Phone' },
    { name: 'dealer', defaultValue: dealer, label: 'Dealer' },
    { name: 'omvicNumber', defaultValue: omvicNumber, label: 'Omvic Number' },
    { name: 'position', defaultValue: position, label: 'Position' },
  ]
  const depts = [
    { name: 'Service', valu: 'Service' },
    { name: 'Sales', value: 'Sales' },
    { name: 'Accessories', value: 'Accessories' },
    { name: 'Parts', value: 'Parts' },
    { name: 'Receiving', value: 'Receiving' },
    { name: 'Administration', value: 'Administration' },
    { name: 'IT', value: 'IT' },
  ]

  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <Form method='post' className='space-y-3 '>
          <CardHeader>
            <CardTitle>Add Users</CardTitle>
            <CardDescription>
              Add new employees as you hire them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2  grid  grid-cols-1 gap-2">
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
              <div className="relative mt-3">
                <Select name='dept' defaultValue={role} >
                  <SelectTrigger className="w-full  bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border-border'>
                    <SelectGroup>
                      <SelectLabel>Positions</SelectLabel>
                      {depts.map((role) => (
                        <SelectItem key={role.id} value={role.value} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Deptartment</label>
              </div>
              <div className="relative mt-3">
                <Select name='userRole'
                  onValueChange={handleRoleChange}
                  defaultValue={role} >
                  <SelectTrigger className="w-full  bg-background text-foreground border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-background text-foreground border-border'>
                    <SelectGroup>
                      <SelectLabel>Positions</SelectLabel>
                      {userRole.map((role) => (
                        <SelectItem key={role.id} value={role.name} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                          {role.symbol}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Role</label>
              </div>
              {selectedRole && (
                <div className="mt-3">
                  <Select
                    name='newUserRole'
                    defaultValue=""
                  >
                    <SelectTrigger className="w-full bg-background text-foreground border border-border">
                      <SelectValue placeholder="Select another role" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border-border">
                      <SelectGroup>
                        <SelectLabel>Additional Positions</SelectLabel>
                        {userRole.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.name}
                            className="cursor-pointer bg-background capitalize text-foreground hover:text-primary hover:underline"
                          >
                            {role.symbol}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <label className="text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all">
                    New Role
                  </label>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button
              size='sm' variant='outline' type='submit' name='intent' value='addUser'>
              Save
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  )
}
