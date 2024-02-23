import ReactDOM from 'react-dom/client'
import { useLoaderData } from '@remix-run/react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";

import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  sortingFns,
  FilterFn,
  SortingFn,

  FilterFns,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { DataFunctionArgs } from '@remix-run/node';
import { prisma } from '~/libs/prisma.server';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Form, useSubmit, useFetcher } from '@remix-run/react'
import { Flex, Text, Heading, Container, Box, Grid } from '@radix-ui/themes';
import Calendar from 'react-calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "~/other/select"
import { ClipboardCheck, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose } from "iconoir-react";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, Label, ScrollArea, } from '~/components/ui/index'
import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import MesasageContent from "../dashboard/calls/messageContent";
import styled from 'styled-components';
import { type IEventInfo } from "./calendar.sales"
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import DebouncedInput from '../dashboard/calls/DebouncedInput';
import Filter from '../dashboard/calls/Filter';

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo
  user: IUser

}
interface IUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  contactMethod: string;
  start: string;
  completed: string;
  model: string;
  userEmail: string;
  unit: string;
  year: string;
  apptType: string;
  brand: string;
  note: string;
  userId: string;
  apptStatus: string;
  userName: string;
  customerState: string;
  resourceId: string;
  financeId: string;
  end: string;
  description: string;
  messageTitle: string;
  direction: string;
  resultOfcall: string;
  // Add other properties as needed
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AddNewAppt({ open, handleClose }: IProps) {
  const onClose = () => handleClose()
  const { user } = useRootLoaderData();
  const userEmail = user?.email;

  const initial = {
    firstName: "",
    lastName: "",
  };
  const [formData, setFormData] = useState(initial);
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  // <Input type="hidden" name="financeId" defaultValue={user.id} />
  const { data } = useLoaderData();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false, })
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
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
  return (
    <>
      <Dialog.Root open={open}  >
        <Dialog.Portal>
          <Form method='post'>
            <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto overflow-y-
             md:w-[50%] w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                Add Appt to Current Client
              </Dialog.Title>
              <div className="w-[90%] justify-center mx-auto ">
                <div className="flex items-center py-4">
                  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter([value])} className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                  />
                  <Input
                    placeholder={`Search phone # ...`}
                    value={
                      (table.getColumn('phone')?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                      table.getColumn('phone')?.setFilterValue(event.target.value)
                    }
                    className="ml-2 max-w-sm "
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
              </div>
              <Dialog.Close asChild>
                <button className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                  aria-label="Close"
                  onClick={() => onClose()}
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Form>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

export async function loader({ request }: DataFunctionArgs) {
  const data = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  console.log(data)
  return { data };
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type Payment = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: number
  address: string
  prov: string
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

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
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
    </div>

  },

  {
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
    filterFn: 'fuzzy',
    sortingFn: fuzzySort,
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
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }
 /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
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
      background-color:#2870BD;
    }

    &:active {
      background-color: #3B9EFF;
      color: #1c2024;
    }
  }
   /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
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
      box-shadow: 0 0 6px 2px black;
  }
`;
