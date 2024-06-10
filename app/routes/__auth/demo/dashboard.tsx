

"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
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
import { toast } from "sonner"
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
import { type DataFunctionArgs } from '@remix-run/node'
import { TextArea } from "~/components/ui/textarea"
import { Form, useFetcher, useNavigate } from "@remix-run/react"
import { RocketIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert"
import React, { useEffect, useRef, useState } from "react"
import { Label } from "~/components"
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
  const [email, setEmail] = useState(false)
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length
  const fetcher = useFetcher()

  let plusOneDay = new Date();
  plusOneDay.setDate(plusOneDay.getDate() + 1);
  let plusOneHour = new Date();
  plusOneHour.setHours(plusOneHour.getHours() + 1);

  const data: Payment[] = [
    {
      id: "m5gr84i9",
      name: 'Ken Tucker',
      phone: '6136136134',
      model: "Ram 1500",
      brand: "Dodge",
      nextAppt: String(plusOneHour),
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
      nextAppt: String(plusOneDay),
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
      nextAppt: String(plusOneDay),
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
      nextAppt: String(plusOneDay),
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
      nextAppt: String(plusOneDay),
      amount: 721,
      status: "failed",
      email: "carmella@hotmail.com",
    },
  ]
  const newDate = new Date()
  const [start, setStart] = useState();
  const [end, setEnd] = useState('');

  function handleSubmit() {
    setPage(page + 1);
    console.log(start, 'start')
    if (page === 0) {
      setStart(String(newDate))
    }
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
        story: 'As you can see you have one more customer to contact for today. You can contact him by email, whenever your ready just click on the red button with the customers email.',
        heading: 'Heads up!',
      }));
    }
    else if (page === 2) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        story: 'Now that you sent the email, you have to update the appointment we just completed. Click that customers profile button to navigate to it.',
        count: '2',
        heading: 'Up next...',

      }));
    }
  }, [page]);

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return <Dashboard data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} setEmail={setEmail} page={page} start={start} />;
      case 1:
        return <Dashboard data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} setEmail={setEmail} page={page} start={start} />;
      case 2:
        return <Dashboard data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} setEmail={setEmail} page={page} start={start} />;
      default:
        return <Dashboard data={data} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} setEmail={setEmail} page={page} start={start} />;
    }
  };

  return (
    <>
      <Dialog open={email} onOpenChange={setEmail} >
        <DialogContent className="gap-0 p-0 outline-none bg-muted-background text-[#f9f9f9] ">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Sending an email to {data[0].name}...</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
            <TextArea
              placeholder='Write message here...'
              className="text-black"
              value={input}
              onChange={(event) => setInput(event.target.value)} />

          </DialogHeader>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {inputLength > 5 ? (
              <Button
                className='bg-[#c72323] '
                onClick={handleSubmit}
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
          </DialogFooter>
        </DialogContent>
      </Dialog >
      {conditionalComponent()}
      < fieldset className="mt-auto mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-[600px] text-[#f9f9f9]   border-border b-[75px]" >

        <legend className="-ml-1 px-1 text-sm font-medium flex">
          <RocketIcon className="h-4 w-4 mr-2" />
          Demo {start}:{end} {page}
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="role" className='text-2xl'>{formData.heading}</Label>
          <p></p>
          <p className='text-[#949494] text-xl'>{formData.story}</p>
        </div>
        <div className="grid gap-3">

          <Button
            onClick={handleSubmit}
            disabled={page === 1}
            className='bg-[#c72323] '
          >
            {page === 0 || page === 1 || page === 2 || page === 3 ? "Next" : "Submit"}
          </Button>

        </div>
      </fieldset >
    </>
  )
}

export function Dashboard({ data, formData, setFormData, handleSubmit, setEmail, page, start }) {


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
          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
          </p>
        )
      },
      cell: ({ row }) => <div className="flex justify-center ">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            Phone
          </p>
        )
      },
      cell: ({ row }) => <div className=" flex justify-center">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
          </p>
        )
      },
      cell: ({ row }) => {
        const data = row.original
        return <>
          <div className=' flex justify-center '>

            {data.name === 'Ken Tucker' && formData.count === '0' ? (
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}

                className="mx-auto rounded-md bg-[#c72323]"
                onClick={() => setEmail(true)}
              >
                <p className=" ">{data.email}</p>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}

                className="mx-auto rounded-md"
              >
                <p className="">{data.email}</p>
              </Button>
            )}

          </div >
        </>
      },

    },
    {
      accessorKey: "brand",
      header: ({ column }) => {
        return (
          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            Brand
          </p>
        )
      },
      cell: ({ row }) => <div className="flex justify-center">{row.getValue("brand")}</div>,
    },
    {
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            Model
          </p>
        )
      },
      cell: ({ row }) => <div className=" flex justify-center">{row.getValue("model")}</div>,
    },
    {
      accessorKey: "nextAppt",
      header: ({ column }) => {
        return (


          <p className='text-center' onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Next Appt.
          </p>
        )
      },
      cell: ({ row }) => {
        const data = row.original
        const dateString = String(data.nextAppt)
        const parts = dateString.split(' ');
        const trimmedString = parts.slice(0, 5).join(' ');
        return <>
          <div className=' flex justify-center'>
            <p>{trimmedString}</p>
          </div>
        </>
      },
    },
    {
      accessorKey: "profile",
      header: () => <div className="text-center"><p>Profile</p></div>,
      cell: ({ row }) => {
        const data = row.original
        const navigate = useNavigate()

        return <>

          <div className=' flex justify-center'>
            {data.name === 'Ken Tucker' && formData.count === '2' ? (
              <Button
                size="sm"
                variant="outline"
                className="mx-auto rounded-md bg-[#c72323]"
                onClick={() => {

                  navigate(`/demo/profile/${start}`)
                }}
              >
                <p className="">Profile</p>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mx-auto rounded-md"
              // onClick={() => setOpen(true)}
              >
                <p className="">Profile</p>
              </Button>
            )}
          </div>
        </>
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
    <div className="w-[80%] mx-auto  ">
      <div className="flex items-center py-4 mt-10">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-[#f9f9f9] border-border bg-background"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-[#f9f9f9]  border-border">
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
      <div className="">
        <Table className="rounded-md border bg-background text-foreground border-border">
          <TableHeader className="  border bg-background text-foreground border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="  border bg-background text-foreground border-border" key={headerGroup.id}>
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
          <TableBody className=" border bg-background text-foreground border-border ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className=" border bg-background text-foreground border-border "
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
        <div className="flex-1 text-sm  text-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className='border-border text-[#f9f9f9]'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className='border-border text-[#f9f9f9]'
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




/**<Dialog  >
              <DialogTrigger asChild>
              </DialogTrigger>
              <DialogContent className="gap-0 p-0 outline-none bg-muted-background text-[#f9f9f9] ">
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
