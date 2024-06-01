/* eslint-disable tailwindcss/classnames-order */
import { prisma } from "~/libs";
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json } from '@remix-run/node'
import { Progress } from "~/components/ui/progresss"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "~/components/ui/sheet"
//import { HiPhone, HiOutlineMail, HiAnnotation, HiPlus, HiUser } from "react-icons/hi";
//import { CaretSortIcon, CheckIcon, DotsHorizontalIcon, CalendarIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenu, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"

import { useLoaderData, Form } from '@remix-run/react'
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '~/components/ui/index'
import React from "react";
import { model } from "~/models";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dealer Sales Assistant - Sales Dashboard" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',

    },
  ];
};
const salesTrackerSchema = z.object({
  date: zfd.text(z.string().optional()),
  sales: zfd.numeric(z.number().optional()),
  intent: zfd.text(z.string().optional()),
  email: zfd.text(z.string().optional()),
})

export function createSalesInput({ email, sales, date }) {
  return prisma.sales.create({
    data: {
      email,
      sales,
      date
    }
  })
}

export async function getSalesData({ email }) {

  try {
    const salesRecord = await prisma.sales.findMany({
      where: {
        email: email
      }
    })
    return salesRecord
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const salesInputs = salesTrackerSchema.parse(formPayload)

  if (salesInputs.intent === 'updateSales') {
    const updateSalesData = await createSalesInput(salesInputs)
    return json({ updateSalesData })

  }
}

export async function loader({ request }: DataFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });

  const email = user?.email
  const salesData = await getSalesData(email)
  return json({ user, salesData } as const)
}


export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <Form method="post">

      <div className="w-full mt-[75px]">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-48 pr-4"
          />
          <Input
            placeholder="Filter models..."
            value={(table.getColumn("model")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("model")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-48  ml-4"
          />
          <Button name="intent" type="submit" className='bg-white '>
            <User className="size-sm me-2" /> Create Client
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto">
                Columns <ArrowDown className="size-sm me-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm ">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button

              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button

              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Form>


  )
}


const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "Active",
    email: "ken99@yahoo.com",
    name: 'Ken',
    lastContact: 'June 15',
    result: 'Reached',
    model: 'S1000RR',
    year: 2024,
    notes: 'wants to trade in her veihhcle',
    touches: '1 2 1',
    nextAppt: 'June 19',
    setFollowUpDats: 2,
    visited: 'true',
    deposit: 'false',
    comepleteCall: 'yes',
    followUpD: 2,

    sold: 'false',
    finance: 'false',
    delivered: 'false',
    phone: 6136136134,
    city: 'ottawa',
    province: 'ON',
    timeToCall: 'night',
    bestContact: 'Cell',
    followUp: 'june 15',
    managerHandOff: 'false',
    refferall: 'false',
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "Active",
    email: "Abe45@gmail.com",
    name: 'Abe',
    lastContact: 'June 15',
    result: 'Reached',
    model: 'S1000RR',
    year: 2024,
    notes: 'wants to trade in her veihhcle',
    touches: '1 2 1',
    nextAppt: 'June 19',
    setFollowUpDats: 2,
    visited: 'true',
    deposit: 'false',
    sold: 'false',
    finance: 'false',
    comepleteCall: 'yes',
    followUpD: 2,
    delivered: 'false',
    phone: 6136136134,
    city: 'ottawa',
    province: 'ON',
    timeToCall: 'night',
    bestContact: 'Cell',
    followUp: 'june 15',
    managerHandOff: 'false',
    refferall: 'false',

  },

  {
    id: "5kma53ae",
    amount: 874,
    status: "Duplicate",
    email: "Silas22@gmail.com",
    name: 'Silas',
    lastContact: 'June 15',
    result: 'Reached',
    model: 'S1000RR',
    year: 2024,
    notes: 'wants to trade in her veihhcle',
    touches: '1 2 1',
    nextAppt: 'June 19',
    setFollowUpDats: 2,
    visited: 'true',
    deposit: 'false',
    sold: 'false',
    finance: 'false',
    delivered: 'false',
    phone: 6136136134,
    city: 'ottawa',
    province: 'ON',
    timeToCall: 'night',
    comepleteCall: 'yes',
    followUpD: 2,
    bestContact: 'Cell',
    followUp: 'june 15',
    managerHandOff: 'false',
    refferall: 'false',
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "Active",
    email: "carmella@hotmail.com",
    name: 'Carmella',
    lastContact: 'June 15',
    result: 'Reached',
    model: 'S1000RR',
    year: 2024,
    notes: 'wants to trade in her veihhcle',
    touches: '1 2 1',
    nextAppt: 'June 19',
    setFollowUpDats: 2,
    visited: 'true',
    deposit: 'false',
    sold: 'false',
    finance: 'false',
    comepleteCall: 'yes',
    delivered: 'false',
    phone: 6136136134,
    city: 'ottawa',
    province: 'ON',
    followUpD: 2,
    timeToCall: 'night',
    bestContact: 'Cell',
    followUp: 'june 15',
    managerHandOff: 'false',
    refferall: 'false',

  },
  {
    id: '1',
    amount: 1000,
    status: "Active",
    email: "example1@example.com",
    name: "John Doe",
    lastContact: "2023-07-19T12:00:00Z",
    result: "Attempted",
    model: "Sedan",
    year: 2022,
    followUpD: 2,
    comepleteCall: 'yes',
    notes: "This is a note.",
    touches: "Some touches",
    nextAppt: "2023-07-20T14:00:00Z",
    setFollowUpDats: 7,
    phone: 1234567890,
    city: "New York",
    province: "NY",
    timeToCall: "Morning",
    bestContact: "Phone",
    visited: "Yes",
    deposit: "Yes",
    sold: "No",
    finance: "Yes",
    followUp: "Yes",
    managerHandOff: "No",
    refferall: "No",
    delivered: "No"
  },
  {
    id: '2',
    amount: 2000,
    status: "Active",
    email: "example2@example.com",
    name: "Jane Smith",
    lastContact: "2023-07-18T14:00:00Z",
    result: "Pending",
    model: "SUV",
    year: 2021,
    notes: "Another note here.",
    touches: "More touches",
    nextAppt: "2023-07-21T10:00:00Z",
    setFollowUpDats: 5,
    phone: 9876543210,
    followUpD: 2,
    city: "Los Angeles",
    province: "CA",
    timeToCall: "Afternoon",
    bestContact: "Email",
    comepleteCall: 'yes',
    visited: "No",
    deposit: "No",
    sold: "No",
    finance: "No",
    followUp: "No",
    managerHandOff: "Yes",
    refferall: "Yes",
    delivered: "No"


  },
  {
    id: '1',
    amount: 1000,
    status: "Active",
    email: "example1@example.com",
    name: "John Doe",
    lastContact: "2023-07-19T12:00:00Z",
    result: "Attempted",
    model: "Sedan",
    year: 2022,
    notes: "This is a note.",
    touches: "Some touches",
    nextAppt: "2023-07-20T14:00:00Z",
    setFollowUpDats: 7,
    phone: 1234567890,
    city: "New York",
    province: "NY",
    timeToCall: "Morning",
    bestContact: "Phone",
    visited: "Yes",
    deposit: "Yes",
    followUpD: 2,

    sold: "No",
    finance: "Yes",
    comepleteCall: 'yes',
    followUp: "Yes",
    managerHandOff: "No",
    refferall: "No",
    delivered: "No"
  },
  {
    id: '2',
    amount: 2000,
    status: "Active",
    email: "example2@example.com",
    name: "Jane Smith",
    lastContact: "2023-07-18T14:00:00Z",
    result: "Pending",
    model: "SUV",
    year: 2021,
    notes: "Another note here.",
    touches: "More touches",
    nextAppt: "2023-07-21T10:00:00Z",
    setFollowUpDats: 5,
    phone: 9876543210,
    city: "Los Angeles",
    province: "CA",
    timeToCall: "Afternoon",
    followUpD: 2,
    bestContact: "Email",
    visited: "No",
    deposit: "No",
    sold: "No",
    finance: "No",
    followUp: "No",
    comepleteCall: 'yes',
    managerHandOff: "Yes",
    refferall: "Yes",
    delivered: "No"
  },
  {
    id: '3',
    amount: 1500,
    status: "Active",
    email: "example3@example.com",
    name: "Alice Johnson",
    lastContact: "2023-07-17T16:00:00Z",
    result: "Reached",
    model: "Hatchback",
    year: 2023,
    notes: "Some additional notes.",
    touches: "Few touches",
    nextAppt: "2023-07-22T15:00:00Z",
    setFollowUpDats: 3,
    phone: 5555555555,
    city: "Chicago",
    followUpD: 2,
    province: "IL",
    timeToCall: "Evening",
    bestContact: "Phone",
    visited: "Yes",
    deposit: "No",
    sold: "Yes",
    finance: "No",
    followUp: "Yes",
    managerHandOff: "Yes",
    comepleteCall: 'yes',
    refferall: "No",
    delivered: "Yes"
  },
  {
    id: '4',
    amount: 1200,
    status: "Active",
    email: "example4@example.com",
    name: "Bob Brown",
    lastContact: "2023-07-16T11:00:00Z",
    result: "Attempted",
    model: "Convertible",
    year: 2020,
    notes: "A note about this.",
    touches: "Some more touches",
    nextAppt: "2023-07-23T11:30:00Z",
    setFollowUpDats: 2,
    phone: 3333333333,
    city: "Miami",
    province: "FL",
    timeToCall: "Morning",
    bestContact: "Email",
    visited: "Yes",
    deposit: "Yes",
    sold: "Yes",
    finance: "No",
    followUp: "No",
    followUpD: 2,
    managerHandOff: "No",
    refferall: "No",
    delivered: "Yes",
    comepleteCall: 'yes',
  },
  {
    id: '5',
    amount: 1800,
    status: "Active",
    email: "example5@example.com",
    name: "Eve Evans",
    lastContact: "2023-07-15T09:00:00Z",
    result: "Pending",
    model: "Truck",
    year: 2019,
    notes: "Some more notes here.",
    touches: "Many touches",
    nextAppt: "2023-07-24T09:45:00Z",
    setFollowUpDats: 10,
    phone: 6666666666,
    city: "Dallas",
    province: "TX",
    timeToCall: "Morning",
    bestContact: "Phone",
    followUpD: 2,
    visited: "Yes",
    deposit: "No",
    sold: "No",
    finance: "Yes",
    followUp: "No",
    managerHandOff: "Yes",
    refferall: "Yes",
    delivered: "No",
    comepleteCall: 'yes',
  }
]

export type Payment = {
  id: string
  amount: number
  status: "All" | "Active" | "Duplicate" | "Invalid" | "Lost"
  email: string
  name: string
  lastContact: string
  result: "All" | 'Attempted' | 'Pending' | 'Reached'
  model: string
  year: number
  notes: string
  touches: string
  nextAppt: string
  setFollowUpDats: number
  followUpD: number

  phone: number
  city: string
  province: string
  timeToCall: string
  bestContact: string
  visited: string
  deposit: string
  sold: string
  finance: string
  followUp: string
  managerHandOff: string
  refferall: string
  delivered: string
  comepleteCall: string
}
const handleCloseEdit = () => {
  setEditingClient(null);
};
const handleCloseContact = () => {
  setEditingContact(null);
};
const handleCloseResult = () => {
  setEditingResult(null);
};


export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize" style={{ width: '150px' }}>
        <Sheet side="left">
          <SheetTrigger>
            {row.getValue("name")}</SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>
                <h3 className="text-2xl font-thin">
                  EDIT CLIENT
                </h3>
                <Separator />
              </SheetTitle>
              <SheetDescription>
                <div className=' my-2'>
                  <Input className='mt-2 ' placeholder='Name' name='client' value={row.getValue("name")} />
                  <Input className='mt-2 ' placeholder='Phone' name='phone' defaultValue={row.getValue("phone")} />
                  <Input className='mt-2 ' placeholder='Email' name='email' defaultValue={row.getValue("email")} />
                  <Input className='mt-2 ' placeholder='Address' name='address' defaultValue={row.getValue("address")} />
                  <Input className='mt-2 ' placeholder='Postal Code' name='postalCode' defaultValue={row.getValue("postal code")} />
                  <Input className='mt-2 ' placeholder='City' name='city' defaultValue={row.getValue("city")} />
                  <Input className='mt-2 ' placeholder='Province' name='province' defaultValue={row.getValue("province")} />
                  <Input className='mt-2 ' placeholder='Best way to get in reach?' name='province' defaultValue={row.getValue("bestContact")} />
                  <Input className='mt-2 ' placeholder='Best time of day to talk?' name='province' defaultValue={row.getValue("timeToCall")} />
                </div>
                <div >
                  <Button name="intent" type="submit" onClick={handleCloseEdit} className='mt-3' value='saveClient'>
                    Save
                  </Button>
                </div>
                <div className='grid grid-cols-1' >
                  <Popover >
                    <PopoverTrigger>
                      <Button name="intent" type="submit" className='mt-3 w-full '>
                        SALES PROCESS
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[750px]">
                      <Progress value={33} />
                      <Separator />
                      <div className='grid grid-cols-3'>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Appt.
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Visit
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Test Drive
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Deposit
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Follow-up
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Manager Turn Over/Try to close
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Test Drive
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Sold
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Referral
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Finance
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox id="terms" />
                          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                            Delivered
                          </label>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Sheet>
                    <SheetTrigger>
                      <Button name="intent" type="submit" className='mt-3 w-full'>
                        CLIENT VEHICLE
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="w-full h-1/2">
                      <SheetHeader>
                        <SheetTitle>
                          <h3 className="text-2xl font-thin">
                            CLIENT VEHICLE CARD
                          </h3>
                          <Separator />
                        </SheetTitle>
                        <SheetDescription>
                          <div className='flex'>
                            <div className='mr-3'>
                              <p className=" text-sm">
                                WANTED VEHICLE
                              </p>
                              <Input className='mt-2 mr-3' placeholder='Make' name='Make' defaultValue={row.getValue("make")} />
                              <Input className='mt-2 pr-5' placeholder='Model' name='Model' defaultValue={row.getValue("model")} />
                              <Input className='mt-2 ' placeholder='Year' name='Year' defaultValue={row.getValue("year")} />
                              <Input className='mt-2 ' placeholder='Trim' name='Trim' defaultValue={row.getValue("trim")} />
                              <Input className='mt-2 ' placeholder='Color' name='Color' defaultValue={row.getValue("color")} />
                              <Button name="intent" type="submit" onClick={handleCloseEdit} className='mt-3 ml-3' value='saveClient'>
                                Update
                              </Button>
                            </div>

                            <div className='mx-3'>
                              <p className=" text-sm ml-3">
                                SECOND CHOICE
                              </p>
                              <Input className='mt-2 ml-3' placeholder='Make' name='Make' defaultValue={row.getValue("make")} />
                              <Input className='mt-2 ml-3 ' placeholder='Model' name='Model' defaultValue={row.getValue("model")} />
                              <Input className='mt-2 ml-3 ' placeholder='Year' name='Year' defaultValue={row.getValue("year")} />
                              <Input className='mt-2 ml-3 ' placeholder='Trim' name='Trim' defaultValue={row.getValue("trim")} />
                              <Input className='mt-2 ml-3 ' placeholder='Color' name='Color' defaultValue={row.getValue("color")} />

                            </div>
                            <div className='mx-3'>
                              <p className=" text-sm ml-3">
                                TRADE
                              </p>
                              <Input className='mt-2 ml-3 ' placeholder='Make' name='Make' defaultValue={row.getValue("make")} />
                              <Input className='mt-2 ml-3 ' placeholder='Model' name='Model' defaultValue={row.getValue("model")} />
                              <Input className='mt-2 ml-3 ' placeholder='Year' name='Year' defaultValue={row.getValue("year")} />
                              <Input className='mt-2 ml-3 ' placeholder='Trim' name='Trim' defaultValue={row.getValue("trim")} />
                              <Input className='mt-2 ml-3 ' placeholder='Color' name='Color' defaultValue={row.getValue("color")} />
                              <div>

                              </div>
                            </div>
                          </div>
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>

                  <Popover>
                    <PopoverTrigger className=' w-full content-end'>
                      <Button name="intent" type="submit" className='mt-3 w-full'>
                        CONTACT CLIENT
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <h3 className="text-2xl font-thin">
                        CONTACT CLIENT
                      </h3>
                      <Separator />
                      <p className=" text-sm">
                        Last contacted: {row.getValue("lastContact")}
                      </p>
                      <Separator />
                      <p className=" text-sm">
                        Best form of contact: {row.getValue("bestContact")}
                      </p>

                      <p className=" text-sm">
                        Best time to be contacted: {row.getValue("timeToCall")}
                      </p>
                      <div className='gap-3 my-2 grid grid-cols-3'>
                        <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='callClient'>
                          <PhoneOutcome />
                        </Button>
                        <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='emailClient' >
                          <MailOut />
                        </Button>
                        <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='textClient'  >
                          <MessageText />
                        </Button>
                      </div>
                      <p className=" text-sm">
                        {row.getValue("phone")}
                      </p>
                      <p className=" text-sm">
                        {row.getValue("email")}
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    ),
  },
  {
    accessorKey: "lastContact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Contact
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize flex mx-auto">
        <Popover>
          <PopoverTrigger className=' w-full content-end'>
            <p className=" font-thin">
              Contact
            </p>
          </PopoverTrigger>
          <PopoverContent>
            <h3 className="text-2xl font-thin">
              Contact
            </h3>
            <Separator />
            <p className=" text-sm">
              Last contacted: {row.getValue("lastContact")}
            </p>
            <Separator />
            <p className=" text-sm">
              Best form of contact: {row.getValue("bestContact")}
            </p>

            <p className=" text-sm">
              Best time to be contacted: {row.getValue("timeToCall")}
            </p>
            <div className='gap-3 my-2 grid grid-cols-3'>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='callClient'>
                <PhoneOutcome />
              </Button>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='emailClient' >
                <MailOut />
              </Button>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='textClient'  >
                <MessageText />
              </Button>
            </div>
            <p className=" text-sm">
              {row.getValue("phone")}
            </p>
            <p className=" text-sm">
              {row.getValue("email")}
            </p>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        <Popover>
          <PopoverTrigger>
            {row.getValue("status")}
          </PopoverTrigger>
          <PopoverContent>
            <h3 className="text-2xl font-thin">
              CLIENT STATUS
            </h3>
            <Separator />
            <div className='gap-3 my-2 grid grid-cols-1 justify-center justify-items-center'>
              <div className="flex items-center space-x-2 my-3">
                <Checkbox id="terms" className='peer h-4 w-4 shrink-0 border  shadow  disabled:cursor-not-allowed disabled:opacity-50 ' />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                  All
                </label>
              </div>
              <Separator />
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                  Duplicate
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                  Invalid
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"  >
                  Lost
                </label>
              </div>
            </div>
            <Separator />
            <Button name="intent" type="submit" className='mt-3' value='saveResult' >
              Save
            </Button>
          </PopoverContent>
        </Popover></div>
    ),
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <div className="capitalize">
        <Popover>
          <PopoverTrigger>

            {row.getValue("result")}
          </PopoverTrigger>
          <PopoverContent>

            <h3 className="text-2xl font-thin">
              CLIENT RESULT
            </h3>
            <Separator />
            <div className='gap-3 my-2 grid grid-cols-1'>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" className='peer h-4 w-4 shrink-0  border  shadow  disabled:cursor-not-allowed disabled:opacity-50 ' />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                  All
                </label>
              </div>
              <Separator />
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                  Attempted
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                  Pending
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                  Reached
                </label>
              </div>
            </div>
            <Separator />
            <Button name="intent" type="submit" onClick={handleCloseResult} className='mt-3' value='saveResult' >
              Save
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <Sheet>
          <SheetTrigger>
            {row.getValue("model")}
          </SheetTrigger>
          <SheetContent side="right" className="w-[50%] h-screen">
            <SheetHeader>
              <SheetTitle>
                <h3 className="text-2xl font-thin">
                  DEAL INFORMATION
                </h3>
                <Separator />
              </SheetTitle>
              <SheetDescription>

                <div className='grid grid-cols-1 p-5 mr-5 w-1/2 '>
                  <p className=" text-sm">
                    UNIT
                  </p>
                  <Separator />

                  <Input className='mt-2 ' placeholder='Make' name='Make' defaultValue={row.getValue("make")} />
                  <Input className='mt-2 ' placeholder='Model' name='Model' defaultValue={row.getValue("model")} />
                  <Input className='mt-2 ' placeholder='Year' name='Year' defaultValue={row.getValue("year")} />
                  <Input className='mt-2 ' placeholder='Trim' name='Trim' defaultValue={row.getValue("trim")} />
                  <Input className='mt-2 ' placeholder='Color' name='Color' defaultValue={row.getValue("color")} />
                  <div>
                    <Button name="intent" type="submit" onClick={handleCloseEdit} className='mt-3' value='saveClient'>
                      Save
                    </Button>
                  </div>
                </div>
                <div className='grid grid-cols-1 p-5 mt-5'>
                  <p className=" text-sm ml-5 pl-5">
                    FINANCIALS
                  </p>
                  <Separator />

                  <div className="flex flex-wrap justify-between  ">

                    <p className="basis-2/4 font-thin mt-2 ">MSRP</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
                      10,000
                    </p>
                    <p className="basis-2/4 font-thin mt-3">Freight</p>
                    <Input
                      className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                      defaultValue={750}
                      placeholder="freight"
                      type="text"
                      name="freight"
                    />
                    <p className="basis-2/4 font-thin mt-2">PDI</p>
                    <Input
                      className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                      defaultValue={289}
                      placeholder="pdi"
                      type="text"
                      name="pdi"
                    />
                    <p className="basis-2/4 font-extralight mt-2">Admin</p>
                    <Input
                      className="w-20 h-8 items-end justify-end text-right  mt-2 font-extralight "
                      defaultValue={350}
                      placeholder="admin"
                      type="text"
                      name="admin"
                    />
                    <p className="basis-2/4 font-thin mt-2">Commodity</p>
                    <Input
                      className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                      defaultValue={699}
                      placeholder="commodity"
                      type="text"
                      name="commodity"
                    />
                    <p className="basis-2/4 font-thin mt-2">Accessories</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin mt-1">
                      ${500}
                    </p>
                    <p className="basis-2/4 font-thin mt-2">Labour</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
                      ${265}
                    </p>
                    <p className="basis-2/4 font-thin mt-2">Licensing</p>
                    <Input
                      className="w-20 h-8 items-end justify-end text-right font-thin mt-2 "
                      defaultValue={65}
                      placeholder="licensing"
                      type="text"
                      name="licensing"

                    />


                  </div>
                  <div>
                    <Button name="intent" type="submit" onClick={handleCloseEdit} className='mt-3 flex items-end justify-end' value='saveClient'>
                      Save
                    </Button>
                  </div>
                </div>

              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    ),
  },

  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("year")}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="capitalize" style={{ width: '200px' }}>
        <Sheet >
          <SheetTrigger>{row.getValue("notes")}
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>
                <h3 className="text-2xl font-thin">+
                  NOTES
                </h3>
                <Separator />
              </SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet></div>
    ),
  },
  {
    accessorKey: "touches",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Touches
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <Popover>
          <PopoverTrigger>{row.getValue("touches")}

          </PopoverTrigger>
          <PopoverContent>
            <h3 className="text-2xl font-thin">
              Comms
            </h3>
            <Separator />
            <div className='gap-3 my-2 grid grid-cols-3'>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='callClient'>
                <PhoneOutcome />
              </Button>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='emailClient' >
                <MailOut />
              </Button>
              <Button name="intent" type="submit" onClick={handleCloseContact} className='mt-3 mr-3' value='textClient'  >
                <MessageText />
              </Button>
            </div>
            <div className='grid grid-cols-3 justify-center mt-2'>
              <p className=" text-sm mx-auto">
                1
              </p>
              <p className=" text-sm mx-auto">
                3
              </p>
              <p className=" text-sm mx-auto">
                2
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    accessorKey: "nextAppt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Next App
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nextAppt")}</div>
    ),
  },
  {
    accessorKey: "comepleteCall",
    header: "Complete Call",
    cell: ({ row }) => (
      <div className="capitalize" style={{ width: '150px' }}>
        <Button name="intent" type="submit" onClick={handleCloseEdit} className=' flex text-xs text-center' value='saveClient'>
          Complete Call
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "setFollowUpDats",
    header: "F-Up/day",
    cell: ({ row }) => (
      <Input
        className="w-10 items-end justify-end font-thin mt-2 "
        defaultValue={2}
        placeholder="licensing"
        type="text"
        name="licensing"

      />
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MenuScale className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("city")}</div>
    ),
  },
  {
    accessorKey: "postal code",
    header: "Postal code",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("postal code")}</div>
    ),
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("province")}</div>
    ),
  },
  {
    accessorKey: "bestContact",
    header: "Best Contact",
    cell: ({ row }) => (
      <div className="bestContact">
        {row.getValue("color")}</div>
    ),
  },
  {
    accessorKey: "timeToCall",
    header: "Best Time To Call",
    cell: ({ row }) => (
      <div className="timeToCall">
        {row.getValue("color")}</div>
    ),
  },
  {
    accessorKey: "make",
    header: "Make",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("make")}</div>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("model")}</div>
    ),
  },
  {
    accessorKey: "trim",
    header: "Trim",
    cell: ({ row }) => (
      <div className="trim">
        {row.getValue("model")}</div>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="trim">
        {row.getValue("color")}</div>
    ),
  },
]
