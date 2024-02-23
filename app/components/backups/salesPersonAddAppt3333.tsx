import React, { HTMLAttributes, HTMLProps, useState } from 'react'
import { useLoaderData, Form, Link } from '@remix-run/react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import Calendar from 'react-calendar';
import MesasageContent from "../dashboard/calls/messageContent";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label, ScrollArea } from '~/components/ui/index'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"

import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type FilterFn, type SortingFn, sortingFns, } from "@tanstack/react-table"
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { DataFunctionArgs } from '@remix-run/node';
import { prisma } from '~/libs/prisma.server';
import Filter from "~/components/dashboard/calls/Filter";
import styled from 'styled-components';

import * as Dialog from '@radix-ui/react-dialog';

export async function loader({ request }: DataFunctionArgs) {
  const data = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return { data };
}
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


export type Payment = {
  id: string
  firstName: string
  lastName: string
  email: string
  address: string
  prov: string
}

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("firstName")}
      </a>
    </div>,

  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("lastName")}
      </a>
    </div>,
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
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("email")}
      </a>
    </div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          phone #
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("phone")}
      </a>
    </div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("address")}
      </a>
    </div>,
  },
  {
    accessorKey: "prov",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Province
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">
      <a target="_blank" href={`/customer/${row.getValue("id")}`}>
        {row.getValue("prov")}
      </a></div>,
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

export default function DataTableDemo(user, open, handleClose, currentEvent, onDeleteEvent, onCompleteEvent) {
  const { data } = useLoaderData();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false, })
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  })

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
    setFilterBy(name);
  };
  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([])
    setFilterBy('')
  };

  // toggle column filters
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleAddAppointment = () => {
    // 'rowSelection' is an object where the keys are the row IDs and the values are the row data
    // Get the IDs of the selected rows
    const selectedRowIds = Object.keys(rowSelection);

    // If no row is selected, show an error message
    if (selectedRowIds.length === 0) {
      alert('Please select a customer.');
      return;
    }

    // If more than one row is selected, show an error message
    if (selectedRowIds.length > 1) {
      alert('Please select only one customer.');
      return;
    }

    // Get the data of the selected row
    const selectedRowData = rowSelection[selectedRowIds[0]];

    // Use the selected row data to populate your appointment form
    setAppointmentForm(selectedRowData);
  };
  const [value, onChange] = useState<Value>(new Date());
  const id = data.id ? data.id.toString() : '';

  return (

    <div className="w-[90%] justify-center mx-auto ">
      <div className="flex items-center py-4">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="font-lg border-block border p-2 shadow"
          placeholder="Search all columns..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button name='intent' variant='outline' value='2DaysFromNow' type='submit'
              className="bg-slate12  cursor-pointer  mx-1 text-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 px-3 py-2 h-7"
            >
              Global Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate12  capitalize cursor-pointer  text-slate1 hover:underline hover:text-[#02a9ff]">
            <ScrollArea className="h-[300px] w-[200px] rounded-md  p-4">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      name="filterBy"
                      className="bg-slate12 capitalize cursor-pointer  text-slate1 hover:underline hover:text-[#02a9ff]"
                      checked={column.id === filterBy}
                      onCheckedChange={(value) =>
                        handleInputChange(column.id)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        {filterBy && (
          <Input
            placeholder={`Filter ${filterBy} ...`}
            value={
              (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="ml-2 max-w-sm "
          />
        )}

        <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="bg-slate12  cursor-pointer  mx-1 text-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"
        >
          Clear
        </Button>

        <Button variant='outline'
          className="bg-slate12  cursor-pointer  mx-1 text-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"

          onClick={toggleFilter}>
          Toggle Col
        </Button>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-7 w-4  px-3 py-2" />
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
        <Table className='w-full text-slate1 border-slate1 overflow-x-auto'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className='items-center' key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {header.column.getCanFilter() && showFilter && (
                        <div className="mx-auto items-center justify-center text-center cursor-pointer ">
                          <Filter column={header.column} table={table} />
                        </div>
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
                  className='p-4 text-slate1 bg-slate12 capitalize cursor-pointer hover:text-[#02a9ff]'
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='justify-center' key={cell.id}>
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
                  className="h-24 text-center text-slate1 bg-slate12 capitalize cursor-pointer hover:text-[#02a9ff]"
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
      <div>
        <Form method="post" >
          <div className='grid grid-cols-1 mx-auto w-[90%] '>


            <Select name='resultOfcall' >
              <SelectTrigger className=" mt-5  mx-auto  text-[#c2e6ff] bg-[#0d2847]" >
                <SelectValue placeholder="Result of call" />
              </SelectTrigger>
              <SelectContent className="text-[#c2e6ff] bg-[#0d2847] mx-auto ">
                <SelectItem value="Reached">Reached</SelectItem>
                <SelectItem value="Attempted">N/A</SelectItem>
                <SelectItem value="Attempted">Left Message</SelectItem>
              </SelectContent>
            </Select>


            <Label className='mt-2 mx-auto text-[#333638]' htmlFor="area">Title</Label>
            <Input
              type="text"
              name="title"
              defaultValue={`F/U on the ${data.model}`}
              className="w-[90%] mx-auto  rounded border bg-[#0d2847] border-slate12 h-8 mx-auto  text-sm mx-auto shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#131414]"
            />
            <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Note</Label>
            <MesasageContent />
            <Input
              name="note"
              placeholder="or write a custom note"
              className="w-[90%] mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#0d2847] text-[#c2e6ff]   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            />

            <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Contact Method</Label>

            <select
              name='contactMethod'
              className='w-[90%]  mx-auto  text-xs h-8 mb-2 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
              <option value="">Contact Method</option>
              <option value="Phone">Phone</option>
              <option value="InPerson">In-Person</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>

            <CalendarContainer>
              <Calendar onChange={onChange} value={value} calendarType="gregory" />
            </CalendarContainer>

            <select
              name="timeOfDayModal"
              className={`mx-auto w-[90%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}>
              <option value="Time of day">Time of day</option>
              <option value="09:00">9:00</option>
              <option value="09:30">9:30</option>
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">1:00</option>
              <option value="13:30">1:30</option>
              <option value="14:00">2:00</option>
              <option value="14:30">2:30</option>
              <option value="15:00">3:00</option>
              <option value="15:30">3:30</option>
              <option value="16:00">4:00</option>
              <option value="16:30">4:30</option>
              <option value="17:00">5:00</option>
              <option value="17:30">5:30</option>
              <option value="18:00">6:00</option>
            </select>
          </div>


          <Input type='hidden' value={value} name='dateModal' />

          <Input type='hidden' value={value} name='followUpDay' />
          <input type='hidden' value={data.firstName} name='firstName' />
          <input type='hidden' value={data.lastName} name='lastName' />
          <input type='hidden' value={data.phone} name='phone' />

          <input type='hidden' value={data.email} name='email' />
          <input type='hidden' value='scheduleFUp' name='intent' />
          <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
          <Input type="hidden" defaultValue={data.id} name="financeId" />
          <Input type="hidden" defaultValue={id} name="id" />
          <Input type="hidden" defaultValue={data.brand} name="brand" />
          <Input type="hidden" defaultValue='future' name="apptStatus" />
          <Input type="hidden" defaultValue={data.model} name="unit" />
          <Input type="hidden" defaultValue='no' name="completed" />
          <Input type="hidden" defaultValue='Sales' name="apptType" />
        </Form>
      </div>

      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto w-[50%] md:w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                <Link to={`/customer/${currentEvent?.getClientFileById}/${currentEvent?.financeId}`} className='cursor-pointer hover:underline text-slate12'>
                  {currentEvent?.completed === 'yes' && (
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                      className="w-4"
                      alt="Logo"
                    />)}  {currentEvent?.firstName} {currentEvent?.lastName}
                </Link>
              </Dialog.Title>
              <Dialog.Description className="text-slate12 mt-[10px] mb-5 text-[15px] leading-normal">
                {currentEvent?.title}
              </Dialog.Description>
              <Tabs defaultValue="appt" className="w-[95%] mx-auto " >
                <TabsList className="grid w-full grid-cols-2 rounded-md">

                  <TabsTrigger className='rounded-md' value="Quick Follow-up">Quick Follow-up</TabsTrigger>
                  <TabsTrigger className='rounded-md' value="completeAppt">Complete Appt</TabsTrigger>
                </TabsList>


                <TabsContent value="followup" className='rounded-md'>

                  <Text>To complete the appt and set a follow up at the same time, the following tab just compeletes the appoiontment.</Text>
                  <Form method="post" >
                    <div className='grid grid-cols-1 mx-auto w-[90%] '>
                      <input type='hidden' name='intent' value='completeApt' />


                      <Select name='resultOfcall' >
                        <SelectTrigger className=" mt-5  mx-auto  text-[#c2e6ff] bg-[#0d2847]" >
                          <SelectValue placeholder="Result of call" />
                        </SelectTrigger>
                        <SelectContent className="text-[#c2e6ff] bg-[#0d2847] mx-auto ">
                          <SelectItem value="Reached">Reached</SelectItem>
                          <SelectItem value="Attempted">N/A</SelectItem>
                          <SelectItem value="Attempted">Left Message</SelectItem>
                        </SelectContent>
                      </Select>


                      <Label className='mt-2 mx-auto text-[#333638]' htmlFor="area">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        defaultValue={`F/U on the ${currentEvent?.model}`}
                        className="w-[90%] mx-auto  rounded border bg-[#0d2847] border-slate12 h-8 mx-auto  text-sm mx-auto shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#131414]"
                      />
                      <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Note</Label>
                      <MesasageContent />
                      <Input
                        name="note"
                        placeholder="or write a custom note"
                        className="w-[90%] mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#0d2847] text-[#c2e6ff]   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      />

                      <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Contact Method</Label>

                      <select
                        name='contactMethod'
                        className='w-[90%]  mx-auto  text-xs h-8 mb-2 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
                        <option value="">Contact Method</option>
                        <option value="Phone">Phone</option>
                        <option value="InPerson">In-Person</option>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                      </select>

                      <CalendarContainer>
                        <Calendar onChange={onChange} value={value} calendarType="gregory" />
                      </CalendarContainer>

                      <select
                        name="timeOfDayModal"
                        className={`mx-auto w-[90%] mb-2 text-xs mt-3 h-10 cursor-pointer rounded border-1 border-[#60b9fd] bg-[#0d2847] text-[#c2e6ff]  shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}>
                        <option value="Time of day">Time of day</option>
                        <option value="09:00">9:00</option>
                        <option value="09:30">9:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">1:00</option>
                        <option value="13:30">1:30</option>
                        <option value="14:00">2:00</option>
                        <option value="14:30">2:30</option>
                        <option value="15:00">3:00</option>
                        <option value="15:30">3:30</option>
                        <option value="16:00">4:00</option>
                        <option value="16:30">4:30</option>
                        <option value="17:00">5:00</option>
                        <option value="17:30">5:30</option>
                        <option value="18:00">6:00</option>
                      </select>
                    </div>


                    <Input type='hidden' value={value} name='dateModal' />

                    <Input type='hidden' value={value} name='followUpDay' />
                    <input type='hidden' value={currentEvent.firstName} name='firstName' />
                    <input type='hidden' value={currentEvent.lastName} name='lastName' />
                    <input type='hidden' value={currentEvent.phone} name='phone' />

                    <input type='hidden' value={currentEvent.email} name='email' />
                    <input type='hidden' value='scheduleFUp' name='intent' />
                    <Input type="hidden" defaultValue={currentEvent.userEmail} name="userEmail" />
                    <Input type="hidden" defaultValue={currentEvent.id} name="financeId" />
                    <Input type="hidden" defaultValue={id} name="id" />
                    <Input type="hidden" defaultValue={currentEvent.brand} name="brand" />
                    <Input type="hidden" defaultValue='future' name="apptStatus" />
                    <Input type="hidden" defaultValue={currentEvent.model} name="unit" />
                    <Input type="hidden" defaultValue='no' name="completed" />
                    <Input type="hidden" defaultValue='Sales' name="apptType" />



                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close >
                        <Button
                          onClick={() => {
                            setIsButtonPressed(true);
                          }}
                          name='intent' value='scheduleFUp' type='submit'
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                        >
                          Complete
                        </Button>
                      </Dialog.Close>
                    </div>

                  </Form>

                </TabsContent>

                <TabsContent value="Quick Follow-up" className='rounded-md'>
                  <Form method='post'>
                    <div className="flex justify-center items-center">


                      <select defaultValue={fUpDays} name='followUpDay1' className="mx-auto  rounded border-1  mz-1 px-2 border border-slate1 bg-slate12 h-9 text-bold uppercase text-slate1 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                        onChange={handleDropdownChange}>
                        <option value="">Days</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="4">4 Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="7">7 Days</option>
                      </select>
                      <input type='hidden' value='2DaysFromNow' name='intent' />
                      <input type="hidden" defaultValue={currentEvent.userEmail} name="userEmail" />
                      <input type="hidden" defaultValue={currentEvent.brand} name="brand" />
                      <input type='hidden' name='financeId' value={currentEvent.id} />
                      <input type='hidden' name='email' value={currentEvent.email} />
                      <input type="hidden" defaultValue='No' name="completed" />
                      <input type="hidden" defaultValue='Outgoing' name="direction" />
                      <input type="hidden" defaultValue='Sales' name="apptType" />
                      <input type="hidden" defaultValue='Attempted' name="resultOfcall" />
                      <input type="hidden" defaultValue={currentEvent.model} name="unit" />
                      <input type="hidden" defaultValue={currentEvent.id} name="id" />
                      <input type="hidden" defaultValue={currentEvent.customerState} name="customerState" />

                      <input type="hidden" defaultValue={currentEvent.firstName} name="firstName" />
                      <input type="hidden" defaultValue={currentEvent.lastName} name="lastName" />
                      <input type="hidden" defaultValue={currentEvent.email} name="email" />
                      <input type="hidden" defaultValue={currentEvent.phone} name="phone" />
                      <input type="hidden" defaultValue={currentEvent.address} name="address" />
                      <input type="hidden" defaultValue={currentEvent.id} name="financeId" />

                      <input type="hidden" defaultValue={currentEvent.apptStatus} name="apptStatus" />
                      <input type="hidden" defaultValue='Other' name="contactMethod" />
                      <input type="hidden" name="title" defaultValue={`F/U on the ${currentEvent.model}`} />


                      <Button
                        name='intent' value='2DaysFromNow' type='submit'
                        className={`p-3 cursor-pointer ml-2 mr-2 text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                      >
                        {buttonText}
                      </Button>



                    </div>
                  </Form >
                </TabsContent>
                <TabsContent value="completeAppt" className='rounded-md'>
                  <Form method='post'>
                    <Text>This is to just complete the app.</Text>
                    <input type='hidden' name='intent' value='compeleteApptOnly' />
                    <Select name='resultOfcall' >
                      <SelectTrigger className=" mt-5  mx-auto  text-[#c2e6ff] bg-[#0d2847]" >
                        <SelectValue placeholder="Result of call" />
                      </SelectTrigger>
                      <SelectContent className="text-[#c2e6ff] bg-[#0d2847] mx-auto ">
                        <SelectItem value="Reached">Reached</SelectItem>
                        <SelectItem value="Attempted">N/A</SelectItem>
                        <SelectItem value="Attempted">Left Message</SelectItem>
                      </SelectContent>
                    </Select>


                    <Label className='mt-2 mx-auto text-[#333638]' htmlFor="area">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      defaultValue={`F/U on the ${currentEvent?.unit}`}
                      className="w-[90%] mx-auto  rounded border bg-[#0d2847] border-slate12 h-8 mx-auto  text-sm mx-auto shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#131414]"
                    />
                    <Label className='mt-2 text-[#c2e6ff] text-center' htmlFor="area">Note</Label>
                    <MesasageContent />
                    <Input
                      name="note"
                      placeholder="or write a custom note"
                      className="w-[90%] mx-auto mt-3 rounded border-1 border-[#60b9fd] h-8 bg-[#0d2847] text-[#c2e6ff]   shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                    />

                    <div className="mt-[25px] flex justify-end">
                      <Dialog.Close >
                        <Button
                          onClick={() => {
                            setIsButtonPressed(true);
                          }}
                          name='intent' value='compeleteAppt' type='submit'
                          className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                        >
                          Complete
                        </Button>
                      </Dialog.Close>
                    </div>
                  </Form>
                </TabsContent>
              </Tabs >
            </Dialog.Content>
          </Form>
        </Dialog.Portal>
      </Dialog.Root>
    </div >
  )
}



function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

export const fuzzyFilter: FilterFn<Payment> = (
  row,
  columnId,
  value,
  addMeta
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}


const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
const CalendarContainer = styled.div`
                /* ~~~ container styles ~~~ */
                width: 90%;
                margin: auto;
                margin-top: 20px;
                background-color: #004074;
                padding: px;
                border-radius: 3px;

                /* ~~~ navigation styles ~~~ */
                .react-calendar__navigation {
                  display: flex;

                .react-calendar__navigation__label {
                  font - weight: bold;
    }

                .react-calendar__navigation__arrow {
                  flex - grow: 0.333;
    }
  }
                /* ~~~ label styles ~~~ */
                .react-calendar__month-view__weekdays {
                  text - align: center;
  }
                /* ~~~ button styles ~~~ */
                button {
                  margin: 3px;
                background-color: #0077FF3A;
                border: 0;
                border-radius: 3px;
                color: #C2E6FF;
                padding: 5px 0;

                &:hover {
                  background - color:#2870BD;
    }

                &:active {
                  background - color: #3B9EFF;
                color: #1c2024;
    }
  }
                /* ~~~ day grid styles ~~~ */
                .react-calendar__month-view__days {
                  display: grid !important;
                grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

                .react-calendar__tile {
                  max - width: initial !important;
    }
  }
                /* ~~~ neighboring month & weekend styles ~~~ */
                .react-calendar__month-view__days__day--neighboringMonth {
                  opacity: 0.7;
  }
                .react-calendar__month-view__days__day--weekend {
                  color: #3B9EFF;
  }#
                /* ~~~ active day styles ~~~ */
                .react-calendar__tile--range {
                  box - shadow: 0 0 6px 2px black;
  }
                `;
