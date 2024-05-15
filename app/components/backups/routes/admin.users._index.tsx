import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import pluralize from "pluralize";
import bcrypt from "bcryptjs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";

import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
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

import { Plus, Trash } from "~/icons";
import { prisma } from "~/libs";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { getSession, commitSession, destroySession } from '~/sessions/auth-session.server'

export const handle = createSitemap();

export async function loader({ request, params }: LoaderArgs) {
  const users = await model.adminUser.query.getAll();
  const userCount = await model.adminUser.query.count();
  const userRoles = await model.userRole.query.getAll();
  const usersCount = users.length;
  const userRole = await prisma.userRole.findMany()
  return json({ users, usersCount, userCount, userRole, userRoles });
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  const isActionAllowed = requireUserRole(user, ["ADMIN", "MANAGER"]);
  if (!isActionAllowed) {
    return forbidden({ message: "Not allowed" });
  }

  // const formPayload = await request.formData();
  const formPayload = Object.fromEntries(await request.formData())

  const formData = financeFormSchema.parse(formPayload);

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
        role: { connect: { id: defaultUserRole.id } },
        profile: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },
      }
    })
    return json(userAdd);
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
  return redirect(`.`);
}


export default function Route() {
  const { users, usersCount, userCount, userRole, userRoles } = useLoaderData<typeof loader>();
  const [addUserRole, setAddUserRole] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [omvicNumber, setOmvic] = useState('')
  const handleRowClick = (user) => {
    setIsRowSelected(true);
    setName(user.name);
    setUsername(user.username)
    setPhone(user.phone)
    setEmail(user.email)
    setRole(user.role.name)
    setOmvic(user.omvic)

  };
  if (users.length <= 0) {
    return <span>No users. Please register new.</span>;
  }
  return (
    <Tabs defaultValue="Users" className="m-5 w-[1000px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="Users">Users</TabsTrigger>
        <TabsTrigger value="Add">Add Users</TabsTrigger>
        <TabsTrigger value="UserRoles">User Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="Users">
        <Card>
          <CardContent className="space-y-2 rounded-md bg-myColor-900  text-[#fafafa] border-black">
            <Form method="post" className="">

              <div className=' text-[#fafafa]'>
                <PageAdminHeader size="xs">

                  <div className="queue">

                    {configDev.isDevelopment && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            <span>Delete All {formatPluralItems("User", userCount)}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-white'>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              accounts and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              <RemixForm method="delete">
                                <Button

                                  variant="outline"
                                  name="intent"
                                  value="delete-all-users"
                                  disabled={userCount <= 0}
                                >
                                  <Trash className="size-sm" />
                                  <span>Delete All {formatPluralItems("User", userCount)}</span>
                                </Button>
                              </RemixForm>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    )}
                  </div>
                </PageAdminHeader>
                <div className='max-w-xl   text-[#fafafa]'>
                  <header>
                    <span>{formatPluralItems("user", usersCount)}</span>
                  </header>
                  {!isRowSelected ? (
                    <>
                      <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          Invite your team members to collaborate.
                        </CardDescription>
                      </CardHeader>
                      <ul className="space-y-2">
                        {users.map((user) => {
                          const userNotesCount = user.notes?.length;
                          const userImagesCount = user.images?.length;

                          return (
                            <li key={user.id}>
                              <CardContent className="grid gap-6">
                                <div className="flex items-center justify-between space-x-4">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className='bg-black t'>
                                      <AvatarImage src="/avatars/01.png" />
                                      <AvatarFallback>OM</AvatarFallback>
                                    </Avatar>
                                    <div className='grid grid-colds-2'>
                                      <div className='flex items-center justify-between'>
                                        <p className="text-sm font-medium leading-none mr-2">{user.name}</p>
                                        <p className="text-sm text-muted-foreground ml-2">@{user.username}</p>
                                      </div>
                                      <div className='flex items-center justify-between'>
                                        <p className="text-sm text-muted-foreground mr-2">{user.email}</p>
                                        <p className="text-sm text-muted-foreground ml-2">{user.phone}</p>
                                      </div>
                                      <Badge className='mt-2'>{user.role.name}</Badge>
                                    </div>
                                  </div>


                                  <RemixLink
                                    prefetch="intent"
                                    onClick={() => {
                                      handleRowClick(user);

                                    }}
                                    className="card hover:card-hover queue-center"
                                  >
                                    <Button variant="outline" className="ml-auto">
                                      Edit
                                    </Button>
                                  </RemixLink>

                                </div>

                              </CardContent>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <Form method='post' className='max-w-sm' >
                      <div className='mt-5'>
                        <Label className='text-lg'>
                          Full Name
                        </Label>
                        <Input name='name' defaultValue={name} className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md  focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" autoComplete="name"
                          autoFocus
                          required />
                      </div>
                      <div className='mt-5'>
                        <Label className='text-lg'>
                          Username
                        </Label>
                        <Input name='username' defaultValue={username} className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]"  autoComplete="username"
                          autoFocus
                          required />
                      </div>
                      <div className='mt-5'>
                        <Label className='text-lg'>
                          Phone
                        </Label>
                        <Input name='phone' defaultValue={phone} className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" autoComplete="phone"
                          autoFocus
                          required />
                      </div>
                      <div className='mt-5'>
                        <Label className='text-lg'>
                          Email
                        </Label>
                        <Input name='email' defaultValue={email} className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" autoComplete="email"
                          autoFocus
                          required />
                      </div>
                      <div className='mt-5'>
                        <Label className='text-lg'>
                          OMVIC #
                        </Label>
                        <Input name='omvicNumber' defaultValue={omvicNumber} className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                      </div>
                      <div>
                        <Label className='text-lg mt-5'>
                          Role
                        </Label>

                        <Select name='userRole'>
                          <SelectTrigger className='mr-3 w-auto border-[#02a9ff]  text-[#02a9ff]'>
                            Role
                          </SelectTrigger>
                          <SelectContent align="end" className='bg-slate1 text-[#fafafa] ' required>
                            {userRole.map((role) => (
                              <SelectItem key={role.id} value={role.symbol} className="cursor-pointer bg-[#fff] capitalize text-[#000]  hover:text-[#02a9ff] hover:underline">
                                {role.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant='outline' type='submit' name='intent' value='update-user' className="mt-5 ml-auto justify-end">
                        Edit User
                      </Button>
                    </Form>
                  )}
                </div>
              </div>

            </Form>

          </CardContent>
        </Card >
      </TabsContent >

      <TabsContent value="Add">
        <Card>
          <CardContent className="space-y-2 rounded-md bg-slate11 text-[#fafafa]">
            <Form method="post" className="">

              <div className="mt-2  grid  grid-cols-1 gap-2">
                <Form method='post' className='space-y-3 max-w-sm '>
                  <div className='mt-5'>
                    <Label className='text-lg'>
                      Name
                    </Label>
                    <Input name='name' placeholder="Justin Doe" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Username
                    </Label>
                    <Input name='username' placeholder="Justin" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Email
                    </Label>
                    <Input name='email' placeholder="justindoe@mail.com" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Phone
                    </Label>
                    <Input name='phone' placeholder="6136136134" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Position
                    </Label>
                    <Input name='phone' placeholder="6136136134" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      OMVIC #
                    </Label>
                    <Input name='omvicNumber' placeholder="654165" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Role
                    </Label>

                    <Select name='userRole'>
                      <SelectTrigger className='mr-3 w-auto border-[#02a9ff]  text-[#02a9ff]'>
                        Role
                      </SelectTrigger>
                      <SelectContent align="end" className='bg-slate1 text-[#fafafa] '>
                        {userRole.map((role) => (
                          <SelectItem key={role.id} value={role.symbol} className="cursor-pointer bg-[#fff] capitalize text-[#000]  hover:text-[#02a9ff] hover:underline">
                            {role.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className='text-lg'>
                      Password
                    </Label>
                    <Input name='password' className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                  </div>
                  <Button variant='outline' type='submit' name='intent' value='addUser' className='mt-5'>
                    Add User
                  </Button>
                </Form>
              </div>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="UserRoles">
        <Card>
          <CardContent className="space-y-2 rounded-md bg-slate11 text-[#fafafa]  mt-5">
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
                  <Input name='name' placeholder="Sales" className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
                </div>
                <div className='mt-5'>
                  <Label className='text-lg'>
                    Description
                  </Label>
                  <Input name='description' placeholder="Vehichle sales staff member." className="mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center rounded bg-myColor-900 px-5  text-[15px] font-bold uppercase leading-none text-slate4 shadow outline-none transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff] hover:text-[#02a9ff] hover:shadow-md
                 focus:text-[#02a9ff] focus:outline-none    active:bg-[#02a9ff]" />
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
              <ul className="stack grid grid-cols-2">
                {userRoles.map((userRole) => {
                  return (
                    <li key={userRole.symbol} className="card-sm mt-5">
                      <div className="queue-center  ">
                        <Badge>{userRole.symbol}</Badge>
                      </div>
                      <p>{userRole.description}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs >

  );
}
