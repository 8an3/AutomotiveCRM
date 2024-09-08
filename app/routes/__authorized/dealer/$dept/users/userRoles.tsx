import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError } from "@remix-run/react";
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
import { createCacheHeaders, createSitemap, formatPluralItems } from "~/utils";
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
  const { users, usersCount, userCount, userRole, userRoles, user } = useLoaderData<typeof loader>();
  const navigation = useNavigate();
  const [addUserRole, setAddUserRole] = useState(false)

  const isSubmitting = navigation.state === "submitting";



  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <Form method='post' className='space-y-3'>

          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>
              Where you can adjust the roles in the system to match your dealer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between mb-4'>
              <Button variant='outline' onClick={() => { setAddUserRole(true) }}>
                Add User Role
              </Button>
              <Button variant='outline' name="intent"
                value="delete-all-user-roles">
                <span>
                  Delete All {formatPluralItems("User Role", userCount)}
                </span>
              </Button>
            </div>
            {addUserRole === true && (
              <Form method='post' className='max-w-sm' >
                <div className='mt-5'>
                  <Label className='text-lg'>
                    Name
                  </Label>
                  <Input name='name' placeholder="Sales" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary hover:text-primary hover:shadow-md
                 focus:text-primary focus:outline-none    active:bg-primary" />
                </div>
                <div className='mt-5'>
                  <Label className='text-lg'>
                    Description
                  </Label>
                  <Input name='description' placeholder="Vehicle sales staff member." className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary hover:text-primary hover:shadow-md
                 focus:text-primary focus:outline-none    active:bg-primary" />
                </div>
                <Button variant='outline' type='submit' name='intent' value='addUserRole' className="mt-5 ml-auto">
                  Add
                </Button>
              </Form>
            )}
            <header>
              <span>All User Roles</span>
            </header>

            {userRoles.length <= 0 && <span>No user roles. Please add.</span>}

            {userRoles.length > 0 && (
              <div className="grid gap-3">
                {userRoles.map((userRole) => {
                  return (
                    <li key={userRole.symbol} className="flex items-center justify-between">
                      <Badge>{userRole.symbol}</Badge>
                      <span className="text-[#8a8a93]">{userRole.description}</span>
                    </li>
                  );
                })}
              </div>
            )}

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



export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "User Roles || ADMIN || Dealer Sales Assistant" },
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
