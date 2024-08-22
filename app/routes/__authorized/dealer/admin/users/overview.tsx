import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, useNavigation } from "@remix-run/react";
import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, CardFooter, Input, Label, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { forbidden } from "remix-utils";
import { Resend } from "resend";
import { requireUserRole, requireUserSession } from "~/helpers";
import { EmployEmail } from "../employeeOnboarding";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { toast } from "sonner";
import { ButtonLoading } from "~/components/ui/button-loading";
import { Menu } from "lucide-react";




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
        reply_to: dealer?.dealerEmailAdmin,
        to: [`${formData?.email}`],
        subject: 'Onboarding Email',
        react: <EmployEmail dealer={formData.dealer} userAdd={userAdd} />
      });
      return onboardingEmail
    default:
      break;
  }
  return redirect(`/`);
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
  const handleRowClick = (user) => {
    console.log(user, 'from row click user')
    //   setIsRowSelected(true);
    setName(user.name);
    setUsername(user.username)
    setPhone(user.phone)
    setEmail(user.email)
    setRole(user.role.name)
    setOmvic(user.omvic)
    setDealer(user.dealer)
    setActivixEmail(user.activixEmail)
    setDept(user.dept)
    setPosition(user.positions.position)
  };

  if (users.length <= 0) {
    return <span>No users. Please register new.</span>;
  }
  const submit = useSubmit()
  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="mt-8">
            <TableHead>
              <TableRow className="">
                <TableHeaderCell className="w-[20px] text-tremor-content-strong dark:text-dark-tremor-content-strong">

                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">

                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">

                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">

                </TableHeaderCell>
                <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">

                </TableHeaderCell>
                <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                </TableHeaderCell>
                <TableHeaderCell className="text-right text-tremor-content-strong dark:text-dark-tremor-content-strong">
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item, index) => {
                const userNotesCount = item.notes?.length;
                const userImagesCount = item.images?.length;
                const initials = item.name.split(' ').map(word => word[0]).join('');
                return (
                  <>
                    <TableRow key={index}>
                      <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        <Avatar className='bg-black border-[#fafafa]'>
                          <AvatarImage src="/avatars/01.png" />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell><div className='grid grid-cols-1 text-left'>
                        <p>{item.name}</p>
                        <p className='text-muted-foreground'>{item.email}</p>
                      </div></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right"></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger><Menu color="#ffffff" /></DropdownMenuTrigger>
                          <DropdownMenuContent className='bg-background border border-border'>
                            <DropdownMenuLabel>User Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleRowClick(item) }}>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <p className=''>
                                    Edit
                                  </p>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] border border-border">
                                  <DialogHeader>
                                    <DialogTitle>Edit user profile</DialogTitle>
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
                                    <div className="relative mt-4">
                                      <Select name='userRole' defaultValue={role} >
                                        <SelectTrigger className="w-full  bg-background text-foreground border border-border">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className='bg-background text-foreground border border-border '>
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
                                    <Button variant='outline' type='submit' name='intent' value='update-user' className="mt-5 ml-auto justify-end">
                                      Save User
                                    </Button>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleRowClick(item) }}>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <p className=''>
                                    View
                                  </p>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>User profile</DialogTitle>
                                  </DialogHeader>
                                  <ul className="grid gap-3">
                                    {userData.map((user, index) => (
                                      <>
                                        <li key={index} className="flex items-center justify-between mt-3">
                                          <span className="text-muted-foreground">{user.label}</span>
                                          <span>{user.defaultValue}</span>
                                        </li>
                                      </>
                                    ))}
                                  </ul>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => {
                              const formData = new FormData();
                              formData.append("email", item.email);
                              formData.append("dealer", item.dealer);
                              formData.append("name", item.name);
                              formData.append("intent", 'sendOnboardingEmail');
                              console.log(formData, 'formData');
                              submit(formData, { method: "post" });
                              toast.success(`Sending email`)
                            }}>
                              Send Onboarding Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => {
                              const formData = new FormData();
                              formData.append("email", item.email);
                              formData.append("userId", item.id);
                              formData.append("intent", 'deleteUser');
                              console.log(formData, 'formData');
                              submit(formData, { method: "post" });
                              toast.success(`Deleting client info...`)
                            }}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>

      </Card>

    </div>
  )
}
