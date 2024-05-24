

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
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
  Mail,
} from "lucide-react"
import { ActionFunction, redirect, type DataFunctionArgs } from '@remix-run/node'
import { Form, useFetcher, useNavigate, useParams } from "@remix-run/react"
import { RocketIcon } from "@radix-ui/react-icons"
import React, { useEffect, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination"
import { Progress } from "~/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import {
  Tabs, Badge,
  TabsContent,
  TabsList,
  TabsTrigger, Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
  CardTitle, Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider, Avatar,
  AvatarFallback,
  AvatarImage,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
  RemixNavLink, Input, Separator, Button, TextArea, Label, PopoverTrigger, PopoverContent, Popover,
} from "~/components"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';

import { format } from "date-fns"
import { cn } from "~/components/ui/utils"
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { prisma } from "~/libs"


export function Profile({ data, formData, setFormData, handleSubmit, WantedData, TradeData, aptFinance3, page, setCompleteAppt, setOpenAppt, end, start }) {
  const [diff, setDiff] = useState()

  function getSecondsBetweenDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMilliseconds = Math.abs(d1 - d2);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    setDiff(diffInSeconds)
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-[#151518] text-[#fafafa]">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="sm:col-span-2 bg-[#09090b]" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3 text-xl">
                  <CardTitle>Customer Profile</CardTitle>

                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm mt-2">
                    <li className="flex items-center justify-between">
                      <span className="text-[#909098]">
                        Name
                      </span>
                      <span>{data[0].name}</span>
                    </li>

                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-[#909098]">
                          Phone
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                      <span>{data[0].phone}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-[#909098]">
                          Email
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                      <span>{data[0].email}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-[#909098]">
                          Address
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                      <span>1234 Buyers St  </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#909098]">
                        City
                      </span>
                      <span>Buyerstown</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#909098]">
                        Postal
                      </span>
                      <span>7B7 U7Y</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2 " className='sm:col-span-2 bg-[#09090b]'>
                <CardHeader className="pb-2 text-xl grid grid-cols-2 justify-between">
                  <CardDescription>Upcoming Appointments</CardDescription>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {page === 2 ? (

                          <Button
                            size="icon"
                            variant="outline"
                            className="ml-auto rounded-full bg-[#dc2626] text-white"
                            onClick={() => setOpenAppt(true)}
                          >
                            <PlusIcon className="h-4 w-4 text-white" />
                            <span className="sr-only">Add Appointment</span>
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="outline"
                            className="ml-auto rounded-full"
                            onClick={() => setOpenAppt(true)}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span className="sr-only">Add Appointment</span>
                          </Button>
                        )}

                      </TooltipTrigger>
                      <TooltipContent sideOffset={10} className='bg-[#dc2626]'>Add Appointment</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip mt-3">
                  <div className="grid gap-3 max-h-[20vh] h-auto">

                    <Table className='  overflow-x-scroll w-[850px]'>
                      <TableHeader>
                        <TableRow className="bg-accent border-[#27272a]">
                          <TableHead>
                            Title
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Type
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Completed
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Appointment Type
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Note
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Brand
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Model
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Menu
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aptFinance3.map((message) => {


                          return (
                            <TableRow
                              key={message.id}
                              className="bg-accent border-[#27272a]">
                              <TableCell>
                                {message.title}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.contactMethod}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.start}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {!(message.id === '1' && page < 2) ? (
                                  <Badge className="text-xs bg-[#1e9b3d]" variant="secondary">
                                    Completed!
                                  </Badge>
                                ) : (
                                  <Badge className="text-xs bg-transparent" variant="secondary">
                                    Incomplete
                                  </Badge>
                                )}




                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.apptType}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.note}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.brand}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {message.unit}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="outline" className="h-8 w-8">
                                      <MoreVertical className="h-3.5 w-3.5" />
                                      <span className="sr-only">Menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className='bg-[#18181a] text-white'>
                                    <DropdownMenuItem disabled>
                                      <button type='submit'
                                        name='intent'
                                        value='deleteApt' >
                                        Delete
                                      </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer' onClick={() => setCompleteAppt(true)}>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem disabled>Trash</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="Sales">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="Sales">Sales</TabsTrigger>
                  <TabsTrigger value="month">Finance</TabsTrigger>
                  <TabsTrigger value="year">Service</TabsTrigger>
                  <TabsTrigger value="year">Accessories</TabsTrigger>
                  <TabsTrigger value="year">Parts</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="Sales" className="  text-[#f2f2f2] rounded-lg">
                <div className='grid grid-cols-2' >
                  <Card
                    className="overflow-hidden  flex flex-col h-full" x-chunk="dashboard-05-chunk-4 mx-2"
                  >
                    <CardHeader className="flex flex-row items-start bg-[#09090b]">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Wanted Vehichle
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Upload customer docs such as contracts, warranties, etc.</span>
                          </Button>
                        </CardTitle>
                      </div>

                    </CardHeader>
                    <CardContent className="flex-grow !grow  p-6 text-sm bg-[#09090b]">

                      <ul className="grid gap-3">
                        {WantedData.map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-[#909098]">
                              {item.placeholder}
                            </span>
                            <span>{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-self-end flex-row items-center border-t border-[#09090b] bg-[#09090b] px-6 py-3">
                      <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" >
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Unit
                        </span>
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 gap-1 mr-3"  >
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Assign Stock Unit
                        </span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-sm mr-2 text-[#f2f2f2] border-[#f2f2f2]"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only"> Sales Person</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>
                            Fulfilled
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Declined
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Refunded
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-sm text-[#f2f2f2] border-[#f2f2f2]"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">F & I</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>
                            Fulfilled
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Declined
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Refunded
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                  <Card
                    className="overflow-hidden mx-2  flex flex-col h-full" x-chunk="dashboard-05-chunk-4"
                  >
                    <CardHeader className="flex flex-row items-start bg-[#09090b]">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Trade Vehichle
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Upload customer docs such as contracts, warranties, etc.</span>
                          </Button>
                        </CardTitle>
                      </div>

                    </CardHeader>
                    <CardContent className="flex-grow !grow  p-6 text-sm bg-[#09090b]">

                      <ul className="grid gap-3">
                        {TradeData.map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-[#909098]">
                              {item.placeholder}
                            </span>
                            <span>{item.value}</span>

                          </li>
                        ))}
                      </ul>

                    </CardContent>
                    <CardFooter className=" items-end justify-end  flex flex-row  border-t border-[#09090b] bg-[#09090b] px-6 py-3">
                      <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" >
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Unit
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className='grid grid-cols-1'>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-[#18181a]">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order Oe31b70H
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm bg-[#09090b]">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-[#8d8d95]">
                        Glimmer Lamps x <span>2</span>
                      </span>
                      <span>$250.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8d8d95]">
                        Aqua Filters x <span>1</span>
                      </span>
                      <span>$49.00</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-[#8d8d95]">Subtotal</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8d8d95]">Shipping</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#8d8d95]">Tax</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-[#8d8d95]">Total</span>
                      <span>$329.00</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>
                    <address className="grid gap-0.5 not-italic text-[#8d8d95]">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">Billing Information</div>
                    <div className="text-[#8d8d95]">
                      Same as shipping address
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Payment Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-[#8d8d95]">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-[#18181a] px-6 py-3">
                <div className="text-xs text-[#8d8d95]">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>


            < fieldset className="mt-10 mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-auto text-[#f9f9f9]   border-[#27272a] " >
              <legend className="-ml-1 px-1 text-sm font-medium flex">
                <RocketIcon className="h-4 w-4 mr-2" />
                Demo
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="role" className='text-2xl'>{formData.heading}</Label>
                <p></p>
                <p className='text-[#949494] text-xl'>{formData.story}</p>
              </div>
              <div className="grid gap-3">
                {page === 4 ? (
                  <Form method='post' >
                    <input type='hidden' name='start' defaultValue={start} />
                    <input type='hidden' name='end' defaultValue={end} />
                    <input type='hidden' name='diff' defaultValue={diff} />
                    <input type='hidden' name='userEmail' defaultValue='skylerzanth@outlook.com' />
                    <Button
                      name='intent'
                      value='demoTime'
                      className='bg-[#c72323] '
                      onClick={() => {
                        getSecondsBetweenDates(start, end)
                      }}
                    >
                      Next
                    </Button>
                  </Form>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={page === 1}
                    className='bg-[#c72323] '
                  >
                    {page === 0 || page === 1 || page === 2 || page === 3 ? "Next" : "Submit"}
                  </Button>
                )}
              </div>
            </fieldset >
          </div>
        </main>
      </div>
    </div>
  )
}

export async function loader({ params, request }: DataFunctionArgs) {
  return null
}

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  name: string
  phone: string
  model: string
  brand: string
  nextAppt: string
}
export default function MainForm() {
  const [page, setPage] = useState(0)
  const [openAppt, setOpenAppt] = useState(false)
  const [completeAppt, setCompleteAppt] = useState(false)
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const params = useParams()

  let minusOneDay = new Date();
  minusOneDay.setDate(minusOneDay.getDate() - 1);
  let plusOneHour = new Date();
  plusOneHour.setHours(plusOneHour.getHours() + 1);
  const dateString = String(plusOneHour)
  const parts = dateString.split(' ');
  const trimmedStringOneHour = parts.slice(0, 5).join(' ');
  const dateStringminusOneDay = String(plusOneHour)
  const partsminusOneDay = dateStringminusOneDay.split(' ');
  const trimmedStringminusOneDay = partsminusOneDay.slice(0, 5).join(' ');

  const [date, setDate] = useState<Date>()

  const newDate = new Date()
  const padTime = (unit) => String(unit).padStart(2, '0');

  const hour = padTime(new Date().getHours());
  const min = padTime(new Date().getMinutes());
  const currentSecond = padTime(new Date().getSeconds());

  const currentTime = `${hour}:${min}:${currentSecond}`;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [diff, setDiff] = useState();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const startTime = params.start

    setStart(startTime)
  }, []);

  useEffect(() => {
    const getSecs = end - start
    setDiff(getSecs)

    console.log(getSecs, 'minus difference')

  }, [start, end]);


  const data: Payment[] = [
    {
      id: "m5gr84i9",
      name: 'Ken Tucker',
      phone: '6136136134',
      model: "Ram 1500",
      brand: "Dodge",
      nextAppt: trimmedStringOneHour,
      amount: 316,
      status: "success",
      email: "ken99@yahoo.com",
    },
    {
      id: "3u1reuv4",
      name: 'Abe',
      phone: '6136136135',
      model: "Ram 2500",
      brand: "Dodge",
      nextAppt: trimmedStringminusOneDay,
      amount: 242,
      status: "success",
      email: "Abe45@gmail.com",
    },
    {
      id: "derv1ws0",
      name: 'Monserrat',
      phone: '6136136136',
      model: "Ram 1500 Crew Cab",
      brand: "Dodge",
      nextAppt: trimmedStringminusOneDay,
      amount: 837,
      status: "processing",
      email: "Monserrat44@gmail.com",
    },
    {
      id: "5kma53ae",
      name: 'Silas',
      phone: '6136136137',
      model: "Ram 2500 Diesel",
      brand: "Dodge",
      nextAppt: trimmedStringminusOneDay,
      amount: 874,
      status: "success",
      email: "Silas22@gmail.com",
    },
    {
      id: "bhqecj4p",
      name: 'carmella',
      phone: '6136136138',
      model: "Ram 1500",
      brand: "Dodge",
      nextAppt: trimmedStringminusOneDay,
      amount: 721,
      status: "failed",
      email: "carmella@hotmail.com",
    },
  ]
  const WantedData = [
    { name: 'year', value: '2023', placeholder: 'Year' },
    { name: 'brand', value: 'BMW Motorrad', placeholder: 'Brand' },
    { name: 'model', value: 'R1250GSA', placeholder: 'Model' },
    { name: 'trim', value: '', placeholder: 'Trim' },
    { name: 'stockNum', value: 'BMW-1004', placeholder: 'Stock Number' },
    { name: 'modelCode', value: 'R1250GSA', placeholder: 'Model Code' },
    { name: 'color', value: 'Kalamata Olive', placeholder: 'Color' },
    { name: 'mileage', value: '4', placeholder: 'Mileage' },
    { name: 'location', value: 'Storage PDIed', placeholder: 'Location' },
    { name: 'vin', value: 'b1232141231', placeholder: 'VIN' },
  ]
  const TradeData = [
    { name: 'tradeYear', value: '2020', placeholder: 'Year' },
    { name: 'tradeMake', value: 'BMW Motorrad', placeholder: 'Brand' },
    { name: 'tradeDesc', value: 'R1200GS', placeholder: 'Model' },
    { name: 'tradeTrim', value: '', placeholder: 'Trim' },
    { name: 'tradeColor', value: 'Black Storm Black', placeholder: 'Color' },
    { name: 'tradeMileage', value: '22350', placeholder: 'Mileage' },
    { name: 'tradeLocation', value: 'Shop', placeholder: 'Location' },
    { name: 'tradeVin', value: 'b1232141231', placeholder: 'VIN' },
  ]
  let aptFinance3 = [
    {
      id: '1',
      title: 'BMW Motorrad - R1250GSA',
      contactMethod: 'Phone',
      start: trimmedStringOneHour,
      completed: 'no',
      apptType: 'Sales',
      note: 'Gave pricing, need to follow up',
      brand: 'BMW Motorrad',
      unit: 'R1250GSA'
    },
    {
      id: '2',
      title: 'BMW Motorrad - R1250GSA',
      contactMethod: 'Phone',
      start: trimmedStringminusOneDay,
      completed: 'yes',
      apptType: 'Sales',
      note: 'Talked to spouse, client was not home',
      brand: 'BMW Motorrad',
      unit: 'R1250GSA'
    },
    {
      id: '3',
      title: 'BMW Motorrad - R1250GSA',
      contactMethod: 'Email',
      start: trimmedStringminusOneDay,
      completed: 'yes',
      apptType: 'Sales',
      note: 'Needs to discuss with spouse',
      brand: 'BMW Motorrad',
      unit: 'R1250GSA'
    },
    {
      id: '4',
      title: 'BMW Motorrad - R1250GSA',
      contactMethod: 'Phone',
      start: trimmedStringminusOneDay,
      completed: 'yes',
      apptType: 'Sales',
      note: 'No Answer / Left Message',
      brand: 'BMW Motorrad',
      unit: 'R1250GSA'
    },
    {
      id: '5',
      title: 'BMW Motorrad',
      contactMethod: 'Phone',
      start: trimmedStringminusOneDay,
      completed: 'yes',
      apptType: 'Sales',
      note: 'Wants to come back in to view and negotiate',
      brand: 'BMW Motorrad',
      unit: 'R1250GSA'
    },
  ]

  function handleSubmit() {
    setPage(page + 1);
  }

  const [formData, setFormData] = useState({
    count: '0',
    step: 0,
    story: '',
    employment_status: null
  });

  useEffect(() => {
    if (page === 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        story: 'Now we just have to open the appointment we just completed and set it to complete.',
        heading: 'Heads up!',
      }));
    }
    else if (page === 2) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        story: 'Great! Now we have to create a new appointment to follow up with the customer.',
        count: '2',
        heading: 'Up next...',

      }));
      aptFinance3 = [
        {
          id: '1',
          title: 'BMW Motorrad - R1250GSA',
          contactMethod: 'Phone',
          start: trimmedStringOneHour,
          completed: 'yes',
          apptType: 'Sales',
          note: 'Gave pricing, need to follow up',
          brand: 'BMW Motorrad',
          unit: 'R1250GSA'
        },
        {
          id: '2',
          title: 'BMW Motorrad - R1250GSA',
          contactMethod: 'Phone',
          start: trimmedStringminusOneDay,
          completed: 'yes',
          apptType: 'Sales',
          note: 'Talked to spouse, client was not home',
          brand: 'BMW Motorrad',
          unit: 'R1250GSA'
        },
        {
          id: '3',
          title: 'BMW Motorrad - R1250GSA',
          contactMethod: 'Email',
          start: trimmedStringminusOneDay,
          completed: 'yes',
          apptType: 'Sales',
          note: 'Needs to discuss with spouse',
          brand: 'BMW Motorrad',
          unit: 'R1250GSA'
        },
        {
          id: '4',
          title: 'BMW Motorrad - R1250GSA',
          contactMethod: 'Phone',
          start: trimmedStringminusOneDay,
          completed: 'yes',
          apptType: 'Sales',
          note: 'No Answer / Left Message',
          brand: 'BMW Motorrad',
          unit: 'R1250GSA'
        },
        {
          id: '5',
          title: 'BMW Motorrad',
          contactMethod: 'Phone',
          start: trimmedStringminusOneDay,
          completed: 'yes',
          apptType: 'Sales',
          note: 'Wants to come back in to view and negotiate',
          brand: 'BMW Motorrad',
          unit: 'R1250GSA'
        },
      ]
    } else if (page === 4) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        story: "Want to know your time? Lets face it, you know you have a colleague or employee that will go this slow. Let's look at a chart to see how this time compounds.",
        heading: 'Congrats!',
      }));
    }
  }, [page]);

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <Profile data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} TradeData={TradeData} WantedData={WantedData} aptFinance3={aptFinance3} page={page} setCompleteAppt={setCompleteAppt} setOpenAppt={setOpenAppt} end={end} start={start} diff={diff} />;
      case 1:
        return <Profile data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} TradeData={TradeData} WantedData={WantedData} aptFinance3={aptFinance3} page={page} setCompleteAppt={setCompleteAppt} setOpenAppt={setOpenAppt} end={end} start={start} diff={diff} />;
      case 2:
        return <Profile data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} TradeData={TradeData} WantedData={WantedData} aptFinance3={aptFinance3} page={page} setCompleteAppt={setCompleteAppt} setOpenAppt={setOpenAppt} end={end} start={start} diff={diff} />;
      default:
        return <Profile data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} TradeData={TradeData} WantedData={WantedData} aptFinance3={aptFinance3} page={page} setCompleteAppt={setCompleteAppt} setOpenAppt={setOpenAppt} end={end} start={start} diff={diff} />;
    }
  };
  return (
    <>
      <Dialog open={openAppt} onOpenChange={setOpenAppt}>
        <DialogContent className="gap-0 p-0 outline-none border-[#27272a] text-[#fafafa]">

          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Add Appointment</DialogTitle>
          </DialogHeader>
          <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
          <div className="grid gap-3 mx-3 mb-3">
            <div className="grid gap-3">

              <Label htmlFor="name">Title</Label>
              <Input
                name="title"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Note</Label>
              <Input
                name="note"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />

            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Contact Method</Label>
              <Input
                name="method"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Type of appointment</Label>
              <Input
                name="apptType"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Brand</Label>
              <Input
                name="brand"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Model</Label>
              <Input
                name="model"
                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Result</Label>
              <Select name='resultOfcall'  >
                <SelectTrigger className="w-auto  focus:border-[#60b9fd]  bg-[#09090b] border-[#27272a]">
                  <SelectValue placeholder="Result of call" />
                </SelectTrigger>
                <SelectContent className='bg-[#09090b] text-[#fafafa] bg-[#09090b]'>
                  <SelectGroup>
                    <SelectLabel>Result of call</SelectLabel>
                    <SelectItem value="Reached">Reached</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                    <SelectItem value="Attempted">Left Message</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Direction</Label>
              <Select name='direction' >
                <SelectTrigger className="w-auto  focus:border-[#60b9fd]  bg-[#09090b] border-[#27272a]">
                  <SelectValue placeholder="Direction of call" />
                </SelectTrigger>
                <SelectContent className='bg-[#09090b] text-[#fafafa] bg-[#09090b]'>
                  <SelectGroup>
                    <SelectLabel>Direction of call</SelectLabel>
                    <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className=' flex-col mx-auto justify-center'>
              <div className="mx-auto w-[280px] rounded-md border-white bg-[#09090b] px-3 text-[#fafafa] " >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] px-4 text-[#fafafa] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]",
                        !date && " text-[#fafafa]"
                      )}
                    >
                      <div className=' text-[#fafafa]  mx-auto flex justify-center  '>
                        <CalendarIcon className="mr-2 size-8 " />
                        {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[275px] bg-[#151518] p-0 text-[#f1f1f1] border-[#27272a]" align="start">
                    <div className='align-center my-3 flex justify-center   '>
                      <SmallCalendar
                        className='mx-auto w-auto   bg-[#09090b] text-[#fafafa]'
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className=' flex-col mx-auto justify-center' >
              <div className="mx-auto w-[280px] rounded-md border-white bg-[#09090b] px-3 text-[#fafafa] " >

                <input type='hidden' value={String(date)} name='value' />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] px-4 text-[#fafafa] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]",
                        !date && " text-[#fafafa]"
                      )}
                    >
                      <div className=' text-[#fafafa]  mx-auto flex justify-center  '>
                        <ClockIcon className="mr-2 size-8 " />
                        {currentTime ? (currentTime) : <span>Pick a Time</span>}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[275px] bg-[#151518] p-0 text-[#f1f1f1] border-[#27272a]" align="start">
                    <div className='align-center my-3 flex justify-center   '>
                      <Select name='pickHour'  >
                        <SelectTrigger className="m-3 w-auto mx-auto bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]" >
                          <SelectValue defaultValue='09' />
                        </SelectTrigger>
                        <SelectContent className='bg-white text-black' >
                          <SelectGroup>
                            <SelectLabel>Hour</SelectLabel>
                            <SelectItem value="09">09</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="13">13</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="17">17</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select name='pickMin'   >
                        <SelectTrigger className="m-3 w-auto" >
                          <SelectValue defaultValue='10' />
                        </SelectTrigger>
                        <SelectContent className='bg-white text-black'  >
                          <SelectGroup>
                            <SelectLabel>Minute</SelectLabel>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <input type='hidden' name='apptType' defaultValue='sales' />
          <DialogFooter className=" border-t border-[#27272a] p-4  ">
            <div className='flex justify-center' >
              <Button
                value="addAppt"
                type="submit"
                name="intent"
                onClick={() => {
                  setPage(3)
                  setEnd(String(newDate))
                }}
                className='bg-[#dc2626] ml-auto  mr-auto'>
                Add Appointment
                <PaperPlaneIcon className="h-4 w-4 ml-2" />

              </Button>
            </div>
          </DialogFooter>


        </DialogContent>
      </Dialog>
      <Dialog open={completeAppt} onOpenChange={setCompleteAppt}>
        <DialogContent className="gap-0 p-0 outline-none border-[#27272a] text-[#fafafa]">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Add Appointment</DialogTitle>
          </DialogHeader>
          <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
          <div className="grid gap-3 mx-3 mb-3">
            <div className="grid gap-3">

              <Label htmlFor="name">Title</Label>
              <Input
                name="title"
                type="text"
                defaultValue={aptFinance3[0].title}
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Note</Label>
              <Input
                name="note"
                type="text"
                defaultValue={aptFinance3[0].note}

                className="w-full bg-[#09090b] border-[#27272a] "
              />

            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Contact Method</Label>
              <Input
                name="method"
                type="text"
                defaultValue={aptFinance3[0].contactMethod}

                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Type of appointment</Label>
              <Input
                name="apptType"
                type="text"
                defaultValue={aptFinance3[0].apptType}

                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Brand</Label>
              <Input
                name="brand"
                type="text"
                defaultValue={aptFinance3[0].brand}

                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Model</Label>
              <Input
                name="model"
                defaultValue={aptFinance3[0].unit}

                type="text"
                className="w-full bg-[#09090b] border-[#27272a] "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Result</Label>
              <Select name='resultOfcall'  >
                <SelectTrigger className="w-auto  focus:border-[#60b9fd]  bg-[#09090b] border-[#27272a]">
                  <SelectValue placeholder="Result of call" />
                </SelectTrigger>
                <SelectContent className='bg-[#09090b] text-[#fafafa] bg-[#09090b]'>
                  <SelectGroup>
                    <SelectLabel>Result of call</SelectLabel>
                    <SelectItem disabled value="Reached">Reached</SelectItem>
                    <SelectItem disabled value="N/A">N/A</SelectItem>
                    <SelectItem disabled value="Attempted">Left Message</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem disabled value="Rescheduled">Rescheduled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Direction</Label>
              <Select name='direction' >
                <SelectTrigger className="w-auto  focus:border-[#60b9fd]  bg-[#09090b] border-[#27272a]">
                  <SelectValue placeholder="Direction of call" />
                </SelectTrigger>
                <SelectContent className='bg-[#09090b] text-[#fafafa] bg-[#09090b]'>
                  <SelectGroup>
                    <SelectLabel>Direction of call</SelectLabel>
                    <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className=' flex-col mx-auto justify-center'>
              <div className="mx-auto w-[280px] rounded-md border-white bg-[#09090b] px-3 text-[#fafafa] " >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] px-4 text-[#fafafa] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]",
                        !date && " text-[#fafafa]"
                      )}
                    >
                      <div className=' text-[#fafafa]  mx-auto flex justify-center  '>
                        <CalendarIcon className="mr-2 size-8 " />
                        {aptFinance3[0].start}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[275px] bg-[#151518] p-0 text-[#f1f1f1] border-[#27272a]" align="start">
                    <div className='align-center my-3 flex justify-center   '>
                      <SmallCalendar
                        className='mx-auto w-auto   bg-[#09090b] text-[#fafafa]'
                        mode="single"
                        selected={new Date(aptFinance3[0].start)}
                        onSelect={setDate}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className=' flex-col mx-auto justify-center' >
              <div className="mx-auto w-[280px] rounded-md border-white bg-[#09090b] px-3 text-[#fafafa] " >

                <input type='hidden' value={String(date)} name='value' />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] px-4 text-[#fafafa] mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]",
                        !date && " text-[#fafafa]"
                      )}
                    >
                      <div className=' text-[#fafafa]  mx-auto flex justify-center  '>
                        <ClockIcon className="mr-2 size-8 " />
                        {currentTime ? (currentTime) : <span>Pick a Time</span>}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[275px] bg-[#151518] p-0 text-[#f1f1f1] border-[#27272a]" align="start">
                    <div className='align-center my-3 flex justify-center   '>
                      <Select name='pickHour'  >
                        <SelectTrigger className="m-3 w-auto mx-auto bg-transparent hover:bg-transparent hover:text-[#02a9ff] border-[#27272a]" >
                          <SelectValue defaultValue='09' />
                        </SelectTrigger>
                        <SelectContent className='bg-white text-black' >
                          <SelectGroup>
                            <SelectLabel>Hour</SelectLabel>
                            <SelectItem value="09">09</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="13">13</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="17">17</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select name='pickMin'   >
                        <SelectTrigger className="m-3 w-auto" >
                          <SelectValue defaultValue='10' />
                        </SelectTrigger>
                        <SelectContent className='bg-white text-black'  >
                          <SelectGroup>
                            <SelectLabel>Minute</SelectLabel>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className='flex justify-center' >
            <Button
              name="intent"
              onClick={() => setPage(2)}
              className='bg-[#dc2626] ml-auto  mr-auto'>
              Add Appointment
              <PaperPlaneIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>

        </DialogContent>
      </Dialog>
      {conditionalComponent()}

    </>
  )
}

export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  await prisma.demoTime.create({
    data: {
      end: formPayload.end,
      start: formPayload.start,
      userEmail: formPayload.userEmail,
      diff: formPayload.diff,
    }
  })
  return redirect('/demo/chart')
}



/**<Dialog  >
              <DialogTrigger asChild>
              </DialogTrigger>
              <DialogContent className="gap-0 p-0 outline-none bg-[#18181a] text-[#f9f9f9] ">
                <DialogHeader className="px-4 pb-4 pt-5">
                  <DialogTitle>Sending an email to {data.name}...</DialogTitle>
                  <DialogDescription>
                    Invite a user to this thread. This will create a new group
                    message.
                  </DialogDescription>
                  <TextArea
                    placeholder='Write message here...'
                    className="text-black"
                    value={input}
                    onChange={(event) => setInput(event.target.value)} />
                  {inputLength > 5 ? (
                    <Button
                      className='bg-[#c72323] '
                      onMouseEnter={handleSubmit}
                      disabled={inputLength === 0}
                    >
                      Send
                    </Button>
                  ) : (
                    <Button
                      className='bg-[#c72323] '
                      disabled={inputLength === 0}
                    >
                      Send
                    </Button>
                  )}
                </DialogHeader>
                <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
                </DialogFooter>
              </DialogContent>
            </Dialog> */
