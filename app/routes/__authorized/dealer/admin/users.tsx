import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import pluralize from "pluralize";
import bcrypt from "bcryptjs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { ButtonLoading } from "~/components/ui/button-loading";

import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
} from "~/components";
import { model } from "~/models";
import {
  createSitemap,
  formatDateTimeTimezone,
  formatPluralItems,
  formatRelativeTime,
} from "~/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { configDev } from "~/configs";
import { forbidden } from "remix-utils";
import { requireUserRole, requireUserSession } from "~/helpers";
import { parse } from "@conform-to/react";
import { Resend } from "resend";

import { Plus, Trash } from "~/icons";
import { prisma } from "~/libs";
import { useState } from "react";
import { ChevronDownIcon, Menu } from "lucide-react";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'
import { GetUser } from "~/utils/loader.server";
import { EmployEmail } from "./employeeOnboarding";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
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
import { toast } from "sonner";


export const handle = createSitemap();

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

  // const formPayload = await request.formData();
  const formPayload = Object.fromEntries(await request.formData())

  const formData = financeFormSchema.parse(formPayload);
  const dealer = await prisma.dealer.findUnique({ where: { id: 1 } })
  //const submission = parse(formData, {});

  if (formData.intent === "delete-all-users") {
    const deleteAll = await model.adminUser.mutation.deleteAll();
    return json(deleteAll);
  }

  if (formData.intent === "addUser") {
    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: formData.userRole },
    });
    const hashed = bcrypt.hash(formData.password, 10)
    const userAdd = await prisma.user.create({
      data: {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        password: hashed,
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


export default function Route() {
  const { users, usersCount, userCount, userRole, userRoles, user } = useLoaderData<typeof loader>();
  const [addUserRole, setAddUserRole] = useState(false)
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
  const userData = [
    { name: 'name', defaultValue: name, label: 'Name' },
    { name: 'username', defaultValue: username, label: 'Username' },
    { name: 'email', defaultValue: email, label: 'Email' },
    { name: 'phone', defaultValue: phone, label: 'Phone' },
    { name: 'dealer', defaultValue: dealer, label: 'Dealer' },
    { name: 'dept', defaultValue: dept, label: 'Dept' },
    { name: 'activixEmail', defaultValue: activixEmail, label: 'Activix Email' },
    { name: 'omvicNumber', defaultValue: omvicNumber, label: 'Omvic Number' },
    { name: 'position', defaultValue: position, label: 'Position' }, // Extract position(s)
  ]

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  return (
    <Tabs defaultValue="Users" className="m-5  ">
      <TabsList className="">
        <TabsTrigger value="Users">Users</TabsTrigger>
        <TabsTrigger value="Add">Add Users</TabsTrigger>
        <TabsTrigger value="UserRoles">User Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="Users">

        <>
          <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
            <div>
              <p className="mt-3 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                To add or keep track of, this is where you do it all for your users.
              </p>
            </div>


            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  type="button"
                  className="mt-4 bg-primary w-full whitespace-nowrap rounded-tremor-small  px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:mt-0 sm:w-fit"
                >
                  Add user
                </Button>
              </DialogTrigger>
              <DialogContent className="md:max-w-[325px] border border-border w-full mx-3 ">
                <DialogHeader>
                  <DialogTitle>Add user profile</DialogTitle>

                </DialogHeader>
                <Form method='post' className='max-w-sm' >
                  {userData.map((user, index) => (
                    <div key={index} className="relative mt-5">
                      <Input
                        name={user.name}
                        className={` bg-background text-foreground border border-border`}
                      />
                      <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{user.label}</label>
                    </div>
                  ))}
                  <div className="relative mt-4">
                    <Select name='userRole'>
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
                  <Button variant='outline' type='submit' name='intent' value='addUser' className="mt-5 ml-auto justify-end">
                    Add User
                  </Button>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
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
                                  <p className='w-full rounded-[4px] bg-[#262626]'>
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
                                      Edit User
                                    </Button>
                                  </Form>

                                  <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleRowClick(item) }}>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <p className='w-full rounded-[4px] bg-[#262626]'>
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
                                          <span>{user.name}</span>
                                        </li>
                                        <li className="flex items-center justify-between mt-3">
                                          <span className="text-muted-foreground">Position</span>
                                          <span>{user.defaultValue}</span>
                                        </li>
                                        <hr className="my-1 text-muted-foreground w-[98%] mx-auto" />

                                      </>
                                    ))}
                                  </ul>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Form method='post'>
                                <input type='hidden' name='email' value={item.email} />
                                <input type='hidden' name='dealer' value={item.dealer} />
                                <input type='hidden' name='name' value={item.name} />
                                <ButtonLoading
                                  size="sm"
                                  value='sendOnboardingEmail'
                                  className="w-auto cursor-pointer ml-3 hover:text-primary border-border"
                                  name="intent"
                                  type="submit"
                                  isSubmitting={isSubmitting}
                                  onClick={() => toast.success(`Sending email`)}
                                  loadingText="Updating client info..."
                                >
                                  Send Onboarding Email
                                </ButtonLoading>
                              </Form>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Form method='post'>
                                <input type='hidden' name='userId' value={item.id} />
                                <input type='hidden' name='email' value={item.email} />
                                <ButtonLoading
                                  size="sm"
                                  variant='ghost'
                                  value='deleteUser'
                                  className="w-auto cursor-pointer ml-3 hover:text-primary border-border tex-left"
                                  name="intent"
                                  type="submit"
                                  isSubmitting={isSubmitting}
                                  onClick={() => toast.success(`Sending email`)}
                                  loadingText="Deleting client info..."
                                >
                                  Delete
                                </ButtonLoading>
                              </Form>
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
        </>
      </TabsContent >
      <TabsContent value="Add">

        <div className="mt-2  grid  grid-cols-1 gap-2">
          <Form method='post' className='space-y-3 max-w-sm '>
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
                <SelectContent className='bg-background text-foreground '>
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
            <Button size='sm' variant='outline' type='submit' name='intent' value='addUser' className='mt-5 bg-primary'>
              Add User
            </Button>
          </Form>
        </div>

      </TabsContent >

      <TabsContent value="UserRoles">
        <Card className='w-[600px] '>
          <CardContent className="space-y-2 rounded-md bg-background text-foreground border-border mt-5">
            <div className='flex justify-between'>
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
        </Card>
      </TabsContent>
    </Tabs >

  );
}
