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
      newLook: true,
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
        activixActivated: formData.activixActivated,
        activixEmail: formData.activixEmail,
        activisUserId: formData.activisUserId,
        activixId: formData.activixId,
        dealerAccountId: formData.dealerAccountId,
        role: { connect: { id: defaultUserRole.id } },
        profile: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },
      }
    })
    const email = await resend.emails.send({
      from: user?.email,
      to: [`${userAdd.email}`],
      subject: `Welcome to the ${dealer?.dealerName} team, ${userAdd.name}.`,
      react: <EmployEmail dealer={dealer} userAdd={userAdd} />
    });
    return json({ userAdd, email });
  }

  if (formData.intent === "delete-all-user-roles") {
    const deleteAll = await model.userRole.mutation.deleteAll();
    return json(deleteAll);
  }
  if (formData.intent === "addUserRole") {
    const adduserrole = await prisma.userRole.create({
      data: {
        name: formData.name,
        description: formData.description,
        symbol: formData.name.toUpperCase(),
      }
    });
    console.log(adduserrole)
    return json(adduserrole);
  }
  if (formData.intent === "update-user") {
    await model.adminUser.mutation.update({
      user: formData.value,
      roleSymbol: formData.value.roleSymbol,
    });
    return redirect(`..`);
  }
  switch (formData.intent) {
    case 'sendOnboardingEmail':
      const userAdd = {
        name: formData.name,
      }
      const onboardingEmail = await resend.emails.send({
        from: "Sales <sales@resend.dev>",
        reply_to: user?.email,
        to: [`${formData?.email}`],
        subject: 'Onboarding Email',
        react: <EmployEmail dealer={formData.dealer} userAdd={userAdd} />
      });
      return onboardingEmail
      break;
    default:
      break;
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
    { name: 'dept', defaultValue: dept, label: 'Dept' },
    { name: 'activixEmail', defaultValue: activixEmail, label: 'Activix Email' },
    { name: 'omvicNumber', defaultValue: omvicNumber, label: 'Omvic Number' },
    { name: 'position', defaultValue: position, label: 'Position' },
  ]

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
                <Select name='userRole' defaultValue={role} >
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
