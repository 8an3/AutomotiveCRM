"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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

import { Button } from "~/components/ui/button"
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
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

  DialogTrigger,
} from "~/components/ui/dialog"
import { IoMail } from "react-icons/io5";
import { Badge, TextArea } from "~/components"
import { LoaderFunction } from "@remix-run/node"
import { RocketIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import { Label } from "~/components/ui/label"


import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert"
import { useState } from "react"
export async function dashboardLoader({ request, params }: LoaderFunction) {
  return null
}

export default function DemoDash() {

  const oneHourFromNow = new Date()
  oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
  const oneDayFromNow = new Date()
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
  console.log(oneHourFromNow, oneDayFromNow);
  const [first, setFirst] = useState(true)
  const [second, setsecond] = useState(false)
  const FirstFalse = () => {
    setFirst(false)
  }
  const SecondFalse = () => {
    setsecond(true)
  }
  const data: Payment[] = [
    {
      id: "m5gr84i9",
      phone: "6136136134",
      name: 'Justin Trecky',
      model: 'Dodge Caravan',
      nextAppt: oneHourFromNow,
      email: "ken99@yahoo.com",
    },
    {
      id: "derv1ws0",
      phone: "6136136135",
      name: 'Tyler Brown',
      model: 'Dodge Caravan',
      nextAppt: oneDayFromNow,
      email: "Tyler66@yahoo.com",
    },
    {
      id: "3u1reuv4",
      phone: "61361361365",
      name: 'Donna Stevens',
      model: 'Dodge Caravan',
      nextAppt: oneDayFromNow,
      email: "Donna44@yahoo.com",
    },

  ]

  type Payment = {
    id: string
    phone: string
    name: string
    model: string
    nextAppt: any
    amount: number
    email: string
  }
  function Profile(data) {
    const minusOneDay = new Date();
    minusOneDay.setDate(minusOneDay.getDate() - 1);

    const minusTwoDay = new Date();
    minusTwoDay.setDate(minusTwoDay.getDate() - 2);

    const minusThreeDay = new Date();
    minusThreeDay.setDate(minusThreeDay.getDate() - 3);
    return (
      <>
        <Dialog>
          <DialogTrigger>
            <Button className={second === true ? 'bg-[#c72323] ' : ''}>
              Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="w-screen h-screen bg-[#09090b] text-[#f9f9f9]">
            <div className='grid grid-cols-2' >

              <div className='profile info mx-3 my-3 ' >
                <Card>
                  <CardHeader>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>
                      Profile Information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue={data.name}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Email</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue={data.email}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Phone</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue={data.phone}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Model</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue={data.model}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='appointments mx-3 my-3'>
                <Card>
                  <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-8">
                    <div className="flex items-center gap-4">

                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Send Email</p>
                        <p className="text-sm text-muted-foreground">
                          {data.date}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge>Not Completed</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Call on cell</p>
                        <p className="text-sm text-muted-foreground">
                          {minusOneDay}
                        </p>
                      </div>
                      <div className="ml-auto font-medium"><Badge className='bg-[#4ebb7d] text-[#f9f9f9]'>Completed</Badge></div>
                    </div>
                    <div className="flex items-center gap-4">

                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Email follow-up</p>
                        <p className="text-sm text-muted-foreground">
                          {minusTwoDay}
                        </p>
                      </div>
                      <div className="ml-auto font-medium"><Badge className='bg-[#4ebb7d] text-[#f9f9f9]'>Completed</Badge></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Came in for in person appointment</p>
                        {minusThreeDay}
                      </div>
                      <div className="ml-auto font-medium"><Badge className='bg-[#4ebb7d] text-[#f9f9f9]'>Completed</Badge></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/05.png" alt="Avatar" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Sofia Davis</p>
                        <p className="text-sm text-muted-foreground">
                          sofia.davis@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium"><Badge className='bg-[#4ebb7d] text-[#f9f9f9]'>Completed</Badge></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }
  function Email(data) {
    return (
      <>
        <Dialog>
          <DialogTrigger>
            <Button onClick={FirstFalse} className='bg-[#c72323]'>
              <IoMail />
            </Button>
          </DialogTrigger>
          <DialogContent className=" bg-[#18181a] text-[#f9f9f9]">
            <DialogHeader>
              <DialogTitle>Sending an email to {data.name}...</DialogTitle>
              <DialogDescription>
              </DialogDescription>
              <TextArea />
              <Button
                className='bg-[#c72323] '
                onClick={() => {
                  toast.success("Email has been sent!");
                  SecondFalse
                }}
              >
                Send
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )
  }


  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "nextAppt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Next Appointment
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("nextAppt")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className=" ">
          <Email data={data} />
        </div>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
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
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("model")}</div>,
    },
    {
      accessorKey: "profile",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Profile
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className=" ">
          <Profile data={data} />
        </div>
      },
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
                <DotsHorizontalIcon className="h-4 w-4" />
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
  ]

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
    <div className="w-full">
      {first === true && (
        <Alert className='bg-[#18181a] text-[#f9f9f9] absolute b-[50px] l-[50%]'>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            <div className='grid grid-cols-2 justify-between'>
              <p>  As you can see you have one more customer to contact for today. You can contact him by email, whenever your ready just click on the read button with the customers email.</p>
              <Button onClick={FirstFalse} >
                Close
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {second === true && (
        <Alert className='bg-[#18181a] text-[#f9f9f9] absolute b-[50px] l-[50%]'>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            <div className='grid grid-cols-2 justify-between'>
              <p>Now that you send the email you have to update the appointment you just completed, click that lines profile button to navigate to it.</p>
              <Button onClick={FirstFalse} >
                Close
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

