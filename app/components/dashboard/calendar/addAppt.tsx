import * as Dialog from '@radix-ui/react-dialog';
import { Input, Button, Separator, Checkbox, TextArea, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, ScrollArea } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import { Cross2Icon, CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";

import React, { useState } from "react";
import MesasageContent from "../calls/messageContent";
import styled from 'styled-components';
import Calendar from 'react-calendar';
import DateTimeComponent from "./DateTime";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import * as Toast from '@radix-ui/react-toast';
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { UserPlus } from "lucide-react";
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues,
  getFacetedMinMaxValues, sortingFns, FilterFn, SortingFn, FilterFns,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { DataFunctionArgs } from '@remix-run/node';
import { prisma } from '~/libs/prisma.server';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { ListSelection2 } from '~/routes/quoteUtils/listSelection'



type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export async function loader({ request }: DataFunctionArgs) {
  const data = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
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

      {row.getValue("firstName")}

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

      {row.getValue("lastName")}

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

      {row.getValue("email")}

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

      {row.getValue("phone")}

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

      {row.getValue("address")}

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

      {row.getValue("prov")}
    </div>,
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

export const AddAppt = ({ open, handleClose, onDeleteEvent, currentEvent, onCompleteEvent }) => {

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
  const onClose = () => { handleClose(false) }
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const timerRef = React.useRef(0);
  const [date, setDate] = React.useState<Date>()
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const [value, onChange] = useState<Value>(new Date());
  /**    <input type="hidden" defaultValue={currentEvent.brand} name="brand" />
              <input type='hidden' name='email' value={currentEvent.email} />
              <Input type="hidden" defaultValue={currentEvent.brand} name="brand" />
              <input type="hidden" defaultValue={currentEvent.appStatus} name="apptStatus" />
   */
  ///////// react table \\\\\\\

  type Payment = {
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
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "financeId",
      header: "financeId",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("financeId")}</div>
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

        {row.getValue("firstName")}

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

        {row.getValue("lastName")}

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

        {row.getValue("email")}

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

        {row.getValue("phone")}

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

        {row.getValue("address")}

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

        {row.getValue("prov")}
      </div>,
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
  const { data } = useLoaderData();

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false, financeId: false, })
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

  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [clientEmail, setClientEmail] = React.useState('');
  const [clientFirstName, setClientFirstName] = React.useState('');
  const [clientLastName, setClientLastName] = React.useState('');
  const [selectedRowData, setSelectedRowData] = React.useState([]);

  const handleRowClick = (row) => {
    setIsRowSelected(true);
    setSelectedRowId(row.original.id);
    setSelectedRowData(row.original)
    setClientId(row.original.id)
    setClientEmail(row.original.email)
    setClientFirstName(row.original.firstName)
    setClientLastName(row.original.lastName)

    console.log(selectedRowData, selectedRowId, row, 'row')
  };
  const [brandId, setBrandId] = useState('');

  const handleBrand = (e) => {
    setBrandId(e.target.value);
  };
  console.log(selectedRowData, selectedRowId, 'row')
  return (
    <>
      <Dialog.Root open={open}  >

        <Dialog.Trigger>

        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto overflow-y-
             md:w-[50%] w-[100%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-black">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Add Appointment for Current Client
            </Dialog.Title>

            {!isRowSelected ? (
              <div className="w-[90%] justify-center mx-auto ">
                <div className="flex items-center py-4">
                  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => { setGlobalFilter([value]) }} className="p-2 font-lg shadow bg-white border border-black text-black"
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
                    className="p-2 font-lg ml-2 shadow bg-white border border-black text-black h-[44px]"
                  />

                  <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="bg-white h-[44px]  cursor-pointer  mx-1 text-black border border-black  font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2"
                  >
                    Clear
                  </Button>




                </div>
                <div className="rounded-md border">
                  <Table className='w-full text-black border-slate1 overflow-x-auto'>
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
                            onClick={() => {
                              handleRowClick(row);
                              ;
                            }}
                            className='p-4 text-black bg-white  capitalize cursor-pointer hover:text-[#02a9ff]'
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
                            className="h-24 text-center text-black bg-white  capitalize cursor-pointer hover:text-[#02a9ff]"
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
            ) : (

              <Form method="post" >
                <Input type="hidden" name="iRate" defaultValue={10.99} />
                <Input type="hidden" name="tradeValue" defaultValue={0} />
                <Input type="hidden" name="discount" defaultValue={0} />
                <Input type="hidden" name="deposit" defaultValue={0} />
                <Input type="hidden" name="months" defaultValue={60} />
                <Input type="hidden" name="userEmail" defaultValue={userEmail} />
                <div className='grid grid-cols-1 mx-auto w-[90%] mt-3'>
                  <input type='hidden' name='intent' value='addNewApt' />

                  <div className='mt-3'></div>
                  <Input
                    className=" mt-1 bg-white text-black border border-black"
                    placeholder="Brand (required)"
                    type="text"
                    list="ListOptions1"
                    name="brand"
                    onChange={handleBrand}
                  />
                  <datalist id="ListOptions1">
                    <option value="BMW-Motorrad" />
                    <option value="Can-Am" />
                    <option value="Can-Am-SXS" />
                    <option value="Harley-Davidson" />
                    <option value="Indian" />
                    <option value="Kawasaki" />
                    <option value="KTM" />
                    <option value="Manitou" />
                    <option value="Sea-Doo" />
                    <option value="Switch" />
                    <option value="Ski-Doo" />
                    <option value="Suzuki" />
                    <option value="Triumph" />
                    <option value="Spyder" />
                    <option value="Yamaha" />
                  </datalist>
                  <Input className=" mt-3 bg-white text-black border border-black " placeholder="Model" type="text" list="ListOptions" name="model" />
                  <ListSelection2 brandId={brandId} />
                  <Input
                    type="text"
                    name="title"
                    defaultValue={`F/U on the ${selectedRowData.unit}`}
                    className='focus:border-[#60b9fd] bg-white text-black mt-3'
                  />
                  <Select name='note' defaultValue="none">
                    <SelectTrigger className="w-auto  focus:border-[#60b9fd] mt-3">
                      <SelectValue placeholder="Time of day" />

                    </SelectTrigger>
                    <SelectContent className='bg-white text-black'>
                      <SelectItem value="">-- Moving Forward --</SelectItem>
                      <SelectItem value="wants to move forward, got deposit">Wants to move forward, got deposit</SelectItem>
                      <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
                      <SelectItem value="Wants to get fiannce approval before moving forward">Wants to get approval before moving forward</SelectItem>
                      <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on</SelectItem>
                      <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

                      <SelectItem value="">-- Stand Still --</SelectItem>
                      <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>
                      <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
                      <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
                      <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>

                      <SelectItem value="">-- Not Moving Forward --</SelectItem>
                      <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
                      <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
                      <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
                      <SelectItem value=""></SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-black'> - OR - </p>
                  <Input
                    name="note"
                    placeholder="or write a custom note"
                    className='focus:border-[#60b9fd] mt-3 bg-white text-black'
                  />
                  <Select name='contactMethod'>
                    <SelectTrigger className="w-auto focus:border-[#60b9fd] mt-3">
                      <SelectValue placeholder="Contact Method" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="InPerson">In-Person</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='mt-3'></div>

                  <CalendarContainer>
                    <Calendar onChange={onChange} value={value} calendarType="gregory" />
                  </CalendarContainer>
                  <div className='mt-3'></div>

                  <Select name='timeOfDayModal'>
                    <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                      <SelectValue placeholder="Time of day" />
                    </SelectTrigger>
                    <SelectContent className='bg-slate1'>
                      <SelectItem value="09:00">9:00</SelectItem>
                      <SelectItem value="09:30">9:30</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="10:30">10:30</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="11:30">11:30</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="12:30">12:30</SelectItem>
                      <SelectItem value="13:00">1:00</SelectItem>
                      <SelectItem value="13:30">1:30</SelectItem>
                      <SelectItem value="14:00">2:00</SelectItem>
                      <SelectItem value="14:30">2:30</SelectItem>
                      <SelectItem value="15:00">3:00</SelectItem>
                      <SelectItem value="15:30">3:30</SelectItem>
                      <SelectItem value="16:00">4:00</SelectItem>
                      <SelectItem value="16:30">4:30</SelectItem>
                      <SelectItem value="17:00">5:00</SelectItem>
                      <SelectItem value="17:30">5:30</SelectItem>
                      <SelectItem value="18:00">6:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='mt-3'></div>

                  <Select name='resourceId'>
                    <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                      <SelectValue placeholder="Type of Appointment" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="1">Sales Calls</SelectItem>
                      <SelectItem value="2">Sales Appointments</SelectItem>
                      <SelectItem value="3">Deliveries</SelectItem>
                      <SelectItem value="4">F & I Appointments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <Input type='hidden' defaultValue={value} name='dateModal' />
                <Input type='hidden' defaultValue={value} name='followUpDay' />

                <Input type="hidden" defaultValue='future' name="apptStatus" />
                <Input type="hidden" defaultValue='no' name="completed" />
                <Input type="hidden" defaultValue='Sales' name="apptType" />
                <input type='hidden' value={clientFirstName} name='firstName' />
                <input type='hidden' value={clientLastName} name='lastName' />
                <input type="hidden" defaultValue={clientEmail} name="email" />
                <input type="hidden" defaultValue={clientId} name="clientId" />


                <div className="mt-[25px] flex justify-end">
                  <Dialog.Close >
                    <Button
                      onClick={() => {
                        onCompleteEvent(false);
                      }}
                      name='intent' value='addNewApt' type='submit'
                      className={` cursor-pointer ml-2 mr-2 p-3 hover:text-[#02a9ff] text-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 ${isButtonPressed ? ' bg-green-500 ' : 'bg-[#02a9ff]'}`}
                    >
                      Complete
                    </Button>
                  </Dialog.Close>
                </div>

              </Form>
            )}

            <Input
              type="hidden"
              name="name"
              defaultValue={`${firstName}` + " " + `${lastName}`}
            />

            <Dialog.Close asChild>
              <button className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                aria-label="Close"
                onClick={() => onClose()}
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>

        </Dialog.Portal>
      </Dialog.Root >
    </>

  )
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

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

// A debounced input react component
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
/**               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button name='intent' variant='outline' value='2DaysFromNow' type='submit'
                      className="bg-white   cursor-pointer  mx-1 text-black active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 px-3 py-2 h-7"
                    >
                      Global Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white   capitalize cursor-pointer  text-black hover:underline hover:text-[#02a9ff]">
                    <ScrollArea className="h-[300px] w-[200px] rounded-md  p-4">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              name="filterBy"
                              className="bg-white  capitalize cursor-pointer  text-black hover:underline hover:text-[#02a9ff]"
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
                   <Button variant='outline'
                  className="bg-white   cursor-pointer  mx-1 text-black active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"

                  onClick={toggleFilter}>
                  Toggle Col
                </Button>



                */
