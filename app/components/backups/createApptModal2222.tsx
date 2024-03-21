import React, { type SetStateAction, type MouseEvent, type Dispatch, useState, useRef, useEffect } from "react"
import * as Dialog from '@radix-ui/react-dialog';

//import { type IEventInfo } from "~/routes/calendar.sales"
import { Link, Form, useLoaderData, useSubmit, useFetcher } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea } from "~/components/ui/index";
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
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { SearchBar } from "~/components/shared/searchbar";
import { prisma } from "~/libs";
import { z } from "zod";
import { cn } from "~/utils";
import { useDelayedIsPending } from "~/utils/misc";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface IUser {
  id: number;
  name: string;
  // Add other properties as needed
}

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo | null
  user: IUser
}

/**export async function loader({ request }: DataFunctionArgs) {
  const data = await prisma.clientfile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  console.log(data)
  return { data };
} */

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

const CreateApptModal = ({ user, open, handleClose, currentEvent, onCompleteEvent, onDeleteEvent }: IProps) => {
  const onClose = () => {
    handleClose()
  }
  // const { data } = useLoaderData();

  const data = [
    {
      id: 'clqhtlz9k0002uozs0xtvvwc3',
      financeId: 'clqhtlz9k0002uozs0xtvvwc3',
      clientfileId: 'clqhtlz3a0001uozs1klu90ov',
      userEmail: 'skylerzanth@gmail.com',
      referral: 'off',
      visited: 'off',
      bookedApt: 'off',
      aptShowed: 'off',
      aptNoShowed: 'off',
      testDrive: 'off',
      metService: 'off',
      metManager: 'off',
      metParts: 'off',
      sold: 'off',
      depositMade: 'off',
      refund: 'off',
      turnOver: 'off',
      financeApp: 'off',
      approved: 'off',
      signed: 'off',
      pickUpSet: 'off',
      demoed: 'off',
      delivered: 'off',
      lastContact: '2023-12-23T09:56:35.978Z',
      status: 'Active',
      customerState: 'Reached',
      result: null,
      timesContacted: null,
      nextAppointment: '2023-12-23T12:30:00.000',
      followUpDay: '2023-12-23T12:30:00.000',
      deliveredDate: 'TBD',
      notes: 'off',
      visits: null,
      progress: null,
      metSalesperson: 'off',
      metFinance: 'off',
      financeApplication: 'off',
      pickUpDate: '',
      pickUpTime: 'off',
      depositTakenDate: 'off',
      docsSigned: 'off',
      tradeRepairs: 'off',
      seenTrade: 'off',
      lastNote: 'off',
      dLCopy: 'off',
      insCopy: 'off',
      testDrForm: 'off',
      voidChq: 'off',
      loanOther: 'off',
      signBill: 'off',
      ucda: 'off',
      tradeInsp: 'off',
      customerWS: 'off',
      otherDocs: 'off',
      urgentFinanceNote: 'off',
      funded: 'off',
      leadSource: null,
      createdAt: new Date(2023, 11, 23, 9, 0),
      updatedAt: new Date(2023, 11, 23, 9, 30),
      dashboardId: 'clqhtlzgh0003uozsbw0l0lm4',
      email: 'nmichinski@gmail.com',
      firstName: 'natashia',
      lastName: 'michinski',
      phone: null,
      name: 'natashia michinski',
      address: '15490 ashburn rd',
      city: null,
      postal: null,
      province: null,
      dl: null,
      typeOfContact: null,
      timeToContact: null,
      iRate: '10.99',
      months: '60',
      discount: '0',
      total: '24609',
      onTax: '27868.17',
      on60: '594.91',
      biweekly: '274.57',
      weekly: '137.29',
      weeklyOth: '137.29',
      biweekOth: '274.57',
      oth60: '594.91',
      weeklyqc: '137.29',
      biweeklyqc: '274.57',
      qc60: '594.91',
      deposit: '500',
      biweeklNatWOptions: '241.88',
      weeklylNatWOptions: '120.94',
      nat60WOptions: '524.07',
      weeklyOthWOptions: '137.29',
      biweekOthWOptions: '274.57',
      oth60WOptions: '594.91',
      biweeklNat: '242.48',
      weeklylNat: '121.24',
      nat60: '525.37',
      qcTax: '27868.17',
      otherTax: '27868.17',
      totalWithOptions: '24609',
      otherTaxWithOptions: '27868.17',
      desiredPayments: 'Standard Payment',
      freight: '100',
      admin: '100',
      commodity: '100',
      pdi: '0',
      discountPer: null,
      userLoanProt: 0,
      userTireandRim: '0',
      userGap: 0,
      userExtWarr: '0',
      userServicespkg: 0,
      deliveryCharge: null,
      vinE: 0,
      lifeDisability: 0,
      rustProofing: 0,
      userOther: 0,
      paintPrem: null,
      licensing: '60',
      stockNum: null,
      options: null,
      accessories: 0,
      labour: '0',
      year: null,
      brand: 'Harley-Davidson',
      model: 'Low Rider S - Vivid Black - FXLRS',
      model1: null,
      color: 'Vivid Black',
      modelCode: null,
      msrp: '24249',
      tradeValue: '0',
      tradeDesc: null,
      tradeColor: null,
      tradeYear: null,
      tradeMake: null,
      tradeVin: null,
      tradeTrim: null,
      tradeMileage: null,
      trim: null,
      vin: null
    }
  ]


  // quick fu
  const [addFU, setAddFU] = useState('no');
  const handleInputChange = (e) => {
    const isChecked = e.target.checked;
    const newValue = isChecked ? 'yes' : 'no';
    setAddFU(newValue);
  };

  // detailed f u
  const [addDetailedFU, setAddDetailedFU] = useState('no');
  const handleInputChangeDetailed = (e) => {
    const isChecked = e.target.checked;
    const newValue = isChecked ? 'yes' : 'no';
    setAddDetailedFU(newValue);
  };

  const [value, onChange] = useState<Value>(new Date());
  const timerRef = useRef(0);
  const [date, setDate] = useState<Date>()
  const handleDateSelect = (selectedDate) => { setDate(selectedDate) };
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
  const id = currentEvent?.id ? currentEvent?.id.toString() : '';
  //table

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

  const handleInputChangeFilter = (name) => {
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


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Form method='post'>
          <Dialog.Overlay className="z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="z-50  data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[50%] w-[80%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate1 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none text-slate12">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              <Link to={`/customer/${currentEvent?.getClientFileById}/${currentEvent?.financeId}`} className='cursor-pointer hover:underline text-slate12'>
                {currentEvent?.firstName} {currentEvent?.lastName}
              </Link>
            </Dialog.Title>
            <Dialog.Description className="text-slate12 mt-[10px] mb-5 text-[15px] leading-normal">
              {currentEvent?.title}
            </Dialog.Description>
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
                      className="text-slate12  cursor-pointer  mx-1 text-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150 px-3 py-2 h-7"
                    >
                      Global Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-slate12  capitalize cursor-pointer  bg-slate1 hover:underline hover:text-[#02a9ff]">
                    <ScrollArea className="h-[300px] w-[200px] rounded-md  p-4">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              name="filterBy"
                              className="text-slate12 capitalize cursor-pointer  bg-slate1 hover:underline hover:text-[#02a9ff]"
                              checked={column.id === filterBy}
                              onCheckedChange={(value) =>
                                handleInputChangeFilter(column.id)
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

                <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="text-slate12  cursor-pointer  mx-1 bg-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"
                >
                  Clear
                </Button>

                <Button variant='outline'
                  className="text-slate12  cursor-pointer  mx-1 bg-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"

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
                <Table className='w-full bg-slate1 text-slate12 border-slate1 overflow-x-auto'>
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
                          className='p-4 bg-slate1 text-slate12 capitalize cursor-pointer hover:text-[#02a9ff]'
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
                          className="h-24 text-center bg-slate1 text-slate12 capitalize cursor-pointer hover:text-[#02a9ff]"
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
            <Dialog.Close asChild onClick={onClose}>
              <button className="w-auto cursor-pointer items-start ml-auto mt-5 hover:text-[#02a9ff] px-2 py-1 border-2 border-slate12 mr-3 hover:border-[#02a9ff]"
              >
                Cancel
              </button>
            </Dialog.Close>

            <Input type='hidden' value={value} name='dateModal' />
            <Input type='hidden' value={currentEvent?.firstName} name='firstName' />
            <Input type='hidden' value={currentEvent?.lastName} name='lastName' />
            <Input type='hidden' value={currentEvent?.email} name='email' />
            <Input type='hidden' value={currentEvent?.phone} name='phone' />
            <Input type="hidden" defaultValue={user?.email} name="userEmail" />
            <Input type="hidden" defaultValue={currentEvent?.unit} name="unit" />
            <Input type="hidden" defaultValue={currentEvent?.brand} name="brand" />
            <Input type="hidden" defaultValue={currentEvent?.title} name="title" />
            <Input type="hidden" defaultValue={currentEvent?.phone} name="phone" />


            <Input type="hidden" name='completed' defaultValue='yes' />
            <Input type="hidden" name='financeId' defaultValue={currentEvent?.financeId} />
            <Input type="hidden" name='id' defaultValue={currentEvent?.id} />
            <button name='intent' type='submit' value='completeAppt' className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff] px-2 py-1 border border-slate12 mr-3 hover:border-[#02a9ff]" onClick={onCompleteEvent} >
              Save
            </button>

          </Dialog.Content>
        </Form>
      </Dialog.Portal>
    </Dialog.Root>
  )
}





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
export default CreateApptModal
/**import {
  type Column,
  type Table,
  useReactTable,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  type FilterFn,
  type SortingFn,
  type ColumnDef,
  flexRender,
  FilterFns,
} from '@tanstack/react-table'
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import stylesheet from '~/styles/tailwind.css'

import React, { type Dispatch, type SetStateAction, type MouseEvent, useState, type HTMLProps, useRef } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box } from "@mui/material";
import { Input, Label } from "~/components/ui/index";
import type { DatePickerEventFormData, ITodo } from "../../../routes/DashCalendar";
import Calendar from "react-calendar";




export const links = () => [{ rel: "stylesheet", href: stylesheet },]

interface IProps {
  open: boolean;
  handleClose: Dispatch<SetStateAction<void>>;
  datePickerEventFormData: DatePickerEventFormData;
  setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventFormData>>;
  onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void;
  todos: ITodo[];
  uniqueQuotes: any;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const AddDatePickerEventModal = ({
  open,
  handleClose,
  datePickerEventFormData,
  setDatePickerEventFormData,
  onAddEvent,
  uniqueQuotes,
}: IProps) => {

  const onClose = () => {
    handleClose();
  };

  const [value, onChange] = useState<Value>(new Date());



  const timerRef = useRef(0);
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);


  // search cust
  const [onOpen, setOnOpen] = useState(false);
  const [getRow, setGetRow] = useState('');
  const id = getRow && getRow.id ? getRow.id.toString() : '';

  const handleClickOpen = () => {
    setOnOpen(true);
  };

  const handleCloseSearchCustomer = () => {
    setOnOpen(false);
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <Form method='post'>
        <DialogTitle>Add Appt</DialogTitle>
        <DialogContent>

          <Box>

            <div className="flex ">
              <div className="mx-auto">
                <Button variant="outlined" onClick={handleClickOpen}>
                  Search Customer
                </Button>
                <SearchCustomer uniqueQuotes={uniqueQuotes}
                  onOpen={onOpen} handleClose={handleCloseSearchCustomer} setGetRow={setGetRow} selectedValue={''} />

                {getRow && (
                  <>
                    <Calendar onChange={onChange} value={value} calendarType="gregory" />

                    <div className="mx-auto grid gap-2">
                      <Label className="mt-2" htmlFor="area">
                        Time
                      </Label>
                      <select
                        name="timeOfDay"
                        className={` border-1 h-8  w-[80%] cursor-pointer rounded border-[#60b9fd] bg-white text-xs text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd] `}
                      >
                        <option value="">Time of day</option>
                        <option value="09:00">9:00</option>
                        <option value="09:30">9:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="01:00">1:00</option>
                        <option value="01:30">1:30</option>
                        <option value="02:00">2:00</option>
                        <option value="02:30">2:30</option>
                        <option value="03:00">3:00</option>
                        <option value="03:30">3:30</option>
                        <option value="04:00">4:00</option>
                        <option value="04:30">4:30</option>
                        <option value="05:00">5:00</option>
                        <option value="05:30">5:30</option>
                        <option value="06:00">6:00</option>
                      </select>
                    </div>
                    <div className="mx-auto grid gap-2">
                      <Label className="mt-2" htmlFor="area">
                        Title
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        className="border-1 h-8 w-[80%] rounded border-[#60b9fd] bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      />
                    </div>

                    <div className="mx-auto grid gap-2">
                      <Label className="mt-2" htmlFor="area">
                        Note
                      </Label>
                      <Input
                        type="text"
                        name="note"
                        className="border-1 h-8 w-[80%] rounded border-[#60b9fd] bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      />
                    </div>
                    <div className="mx-auto grid gap-2">
                      <Label className="mt-2" htmlFor="area">
                        Contact Method
                      </Label>

                      <select
                        name="contactMethod"
                        className="border-1 h-8 w-[80%] cursor-pointer rounded border-[#60b9fd] bg-white text-xs text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      >
                        <option value="">Contact Method</option>
                        <option value="Phone">Phone</option>
                        <option value="InPerson">In-Person</option>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Input type='hidden' value={value ?? ''} name='date' />

            <Input type="hidden" defaultValue="no" name="completed" />
            <Input type="hidden" defaultValue="Sales" name="apptType" />
            <Input type='hidden' defaultValue={getRow?.firstName} name='firstName' />
            <Input type='hidden' defaultValue={getRow?.lastName} name='lastName' />
            <Input type='hidden' defaultValue={getRow?.email} name='email' />
            <Input type="hidden" defaultValue={getRow?.userEmail} name="userEmail" />
            <Input type="hidden" defaultValue={getRow?.id} name="financeId" />
            <Input type="hidden" defaultValue={getRow?.brand} name="brand" />
            <Input type="hidden" defaultValue={getRow?.unit} name="unit" />
            <Input type="hidden" defaultValue='TBD' name="apptStatus" />
            <Input type="hidden" defaultValue={id} name="id" />
          </Box>

        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            name="intent"
            value="addApptFromCal"
            type="submit"
            color="success"
          >
            Add
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default AddDatePickerEventModal;


interface SearchCustomerProps {
  selectedValue: string;
  onOpen: boolean;
  handleClose: () => void;
  uniqueQuotes: any;
  setGetRow: any;
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}



function SearchCustomer(props: SearchCustomerProps) {
  const { onOpen, handleClose, uniqueQuotes, setGetRow, } = props;
  const [maxWidth, setMaxWidth] = useState('lg');

  const [rowSelection, setRowSelection] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
      if (typeof indeterminate === 'boolean') {
        ref.current.indeterminate = !rest.checked && indeterminate
      }
    }, [ref, indeterminate, rest.checked])

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + ' cursor-pointer'}
        {...rest}
      />
    )
  }

  const columns = React.useMemo<ColumnDef<Person, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',

        cell: ({ row }) => {
          const data = row.original
          return <div className="text-center w-[150px] ">
            <Link to='/' className='cursor-pointer text-slate12 hover:underline'>
              {data.firstName}
            </Link>
          </div>
        },
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: ({ row }) => {
          const data = row.original
          return <div className="text-center text-slate12 w-[150px] ">
            {data.lastName}
          </div>
        },
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.email,
        id: 'email',
        header: 'Email',
        cell: ({ row }) => {
          const data = row.original
          return <div className="text-center text-slate12 w-[250px] ">
            {data.email}
          </div>
        },
        footer: props => props.column.id,
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      },
      {
        accessorFn: row => row.phone,
        id: 'phone',
        accessorKey: 'phone',
        cell: ({ row }) => {
          const data = row.original
          return <div className="text-center text-slate12 w-[150px] ">
            {data.phone}
          </div>
        },
        header: () => <span>Phone</span>,
        footer: props => props.column.id,
      },


    ],
    []
  )
  const [data, setData] = React.useState<Person[]>(() => uniqueQuotes);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })


  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table])



  return (
    <Dialog onClose={handleClose} open={onOpen} maxWidth={maxWidth}>
      <DialogTitle>Search Customer</DialogTitle>

      <div className="p-2">
        <div>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="font-lg border-block border p-2 shadow"
            placeholder="Search all columns..."
          />
        </div>
        <div className="h-2" />
        <table >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>

                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>

          <Button onClick={() => {

            const selectedRowModel = table.getSelectedRowModel();
            if (selectedRowModel && selectedRowModel.flatRows.length > 0) {
              const originalData = selectedRowModel.flatRows[0].original;
              setGetRow(originalData)
              console.log(selectedRowModel.flatRows[0].original)

            }
            handleClose();
          }}
            className="bg-[#02a9ff] cursor-pointer  w-[75px] ml-2  mr-2 text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
            Select
          </Button>

        </div>

      </div>



    </Dialog>
  );
}


export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  id: string
  financeId: string
  phone: number
  email: string
  address: string
  postal: string
  city: string
  province: string
  original: string

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

export const fuzzyFilter: FilterFn<Person> = (
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
 */
