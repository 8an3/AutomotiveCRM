import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { type DataFunctionArgs, type ActionFunction, json, type LinksFunction, redirect } from '@remix-run/node'
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { cn } from "~/components/ui/utils"
import {
  Tabs, Badge,
  TabsContent,
  TabsList,
  TabsTrigger, Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger, Card,
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
  CardTitle, Avatar,
  AvatarFallback,
  AvatarImage,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
  RemixNavLink, Input, Separator, Button, TextArea, Label, buttonVariants
} from "~/components"
import { ButtonLoading } from "~/components/ui/button-loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { FaMotorcycle, FaSave } from "react-icons/fa";
import { toast } from "sonner"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

export async function loader({ params, request }: DataFunctionArgs) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  let { clientId, financeId } = params;
  const clientfile = await prisma.clientfile.findUnique({
    where: { id: clientId }
  })

  const financeList = await prisma.finance.findMany({
    where: {
      email: clientfile.email
    }
  })
  return json({ clientfile })
}

export default function SettingsLayout() {
  const { clientfile, } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [date, setDate] = useState<Date>()

  let customerCard = [
    { name: 'firstName', value: clientfile.firstName, label: 'First Name', },
    { name: 'lastName', value: clientfile.lastName, label: 'Last Name', },
    { name: 'phone', value: clientfile.phone, label: 'Phone', },
    { name: 'email', value: clientfile.email, label: 'Email', },
    { name: 'address', value: clientfile.address, label: 'Address', },
    { name: 'city', value: clientfile.city, label: 'City', },
    { name: 'postal', value: clientfile.postal, label: 'Postal', },
    { name: 'dl', value: clientfile.dl, label: 'Drivers Lic.', },
  ];

  let customerCardNonInput = [
    { name: 'dob', value: clientfile.dob, label: 'DOB', },
    { name: 'billingAddress', value: clientfile.billingAddress, label: 'Billing Address', },
    { name: 'timeToContact', value: clientfile.timeToContact, label: 'Preferred Time', },
    { name: 'typeOfContact', value: clientfile.typeOfContact, label: 'Preferred Contact', },
  ];

  useEffect(() => {
    if (clientfile.dob) {
      setDate(clientfile.dob);
    }

  }, []);



  const sidebarNavItems = [
    {
      title: "Profile",
      href: "/examples/forms",
    },
    {
      title: "Purchase History",
      href: "/examples/forms/account",
    },
    {
      title: "Appearance",
      href: "/examples/forms/appearance",
    },
    {
      title: "Notifications",
      href: "/examples/forms/notifications",
    },
    {
      title: "Display",
      href: "/examples/forms/display",
    },
  ]
  const [tabState, setTabState] = useState('Profile')


  function SidebarNav({ className, items, ...props }: SidebarNavProps) {

    return (
      <nav
        className={cn(
          "flex space-x-2 flex-row max-w-[95%] lg:flex-col lg:space-x-0 lg:space-y-1 mt-3",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Button variant='ghost'
            key={item.title}
            onClick={() => setTabState(item.title)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              tabState === item.title
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


  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{clientfile.firstName} {clientfile.lastName}</h2>
          <p className="text-sm text-muted-foreground">
            Manage your clients profile, does not effect unit files, or any other data on the crm.
          </p>
        </div>
        <Separator className="my-6 border-border bg-border text-border" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            {tabState === 'Profile' && (


              <Form method='post' className='grid w-full max-w-sm space-y-8 items-center  gap-1.5'>

                {customerCard.map((item, index) => (

                  <div key={index} className="relative mt-5">
                    <Input
                      name={item.name}
                      defaultValue={item.value}
                      className={` bg-background text-foreground border border-border`}
                    />
                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">{item.label}</label>
                  </div>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " pl-3 text-left font-normal mt-4 ",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>DOB</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-border" align="start">
                    <Calendar
                      className='w-auto'
                      mode="single"
                      fromYear={1900}
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative mt-5 ">
                  <Select name='timeToContact' defaultValue={clientfile.timeToContact}  >
                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                      <SelectValue defaultValue={clientfile.timeToContact} />
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
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">Best Time To Contact</label>
                </div>
                <div className="relative mt-5 ">
                  <Select name='typeOfContact' defaultValue={clientfile.typeOfContact} >
                    <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                      <SelectValue defaultValue={clientfile.typeOfContact} />
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
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground text-muted-foreground">Best Type To Contact</label>
                </div>
                <ButtonLoading
                  size="sm"
                  value="updateClient"
                  className="w-auto cursor-pointer ml-auto mt-5 mb-5 "
                  name="intent"
                  type="submit"
                  isSubmitting={isSubmitting}
                  onClick={() => toast.success(`${clientfile.firstName}'s customer file is updated...`)}
                  loadingText={`${clientfile.firstName}'s customer file is updated...`}
                >
                  Save
                  <FaSave className="h-4 w-4 ml-2" />
                </ButtonLoading>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const intent = formPayload.intent
  if (intent === 'updateClient') {
    const update = await prisma.clientfile.update({
      where: { id: formPayload.id },
      data: {
        firstName: formPayload.firstName,
        lastName: formPayload.lastName,
        name: formPayload.name,
        email: formPayload.email,
        phone: formPayload.phone,
        address: formPayload.address,
        city: formPayload.city,
        postal: formPayload.postal,
        province: formPayload.province,
        dl: formPayload.dl,
        typeOfContact: formPayload.typeOfContact,
        timeToContact: formPayload.timeToContact,
        conversationId: formPayload.conversationId,
        billingAddress: formPayload.billingAddress,
        dob: formPayload.dob,
      }
    })
    return json({ update })
  }
}
