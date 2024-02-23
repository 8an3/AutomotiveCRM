import React, { HTMLAttributes, HTMLProps, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { useLoaderData } from '@remix-run/react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";

import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea } from "~/components/ui/index";
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

export default function SearchTable() {
  const { searchData } = useLoaderData();
  const data = searchData
  type Payment = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: number
    address: string
    prov: string
  }
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ id: false, })
  const [rowSelection, setRowSelection] = React.useState({})
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
    <div className="w-[95%] justify-center mx-auto ">
      <div className="flex items-center py-4">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter([value])} className="p-2 font-lg shadow border border-block w-[400px] bg-[#60646c] text-[#fff] border-[#878787]"
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
          className="ml-2 max-w-sm bg-[#60646c] text-[#fff] border-[#878787]"
        />


        <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="bg-slate12  hover:text-[#02a9ff] hover:border-[#02a9ff] cursor-pointer  mx-1 text-slate1 active:bg-black font-bold uppercase  my-auto text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150  px-3 py-2 h-7"
        >
          Clear
        </Button>
      </div>
      <div className="rounded-md border border-[#3b3b3b] ">
        <Table className='w-full text-slate1 border-[#3b3b3b] overflow-x-auto'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-[#3b3b3b]'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className='items-center ' key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {header.column.getCanFilter() && showFilter && (
                        <div className="mx-auto items-center justify-center text-center cursor-pointer border-[#3b3b3b]">
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
                  className='p-4 text-slate1 bg-slate12 capitalize cursor-pointer hover:text-[#02a9ff] border-[#3b3b3b]'
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
        <div className="flex-1 text-sm text-slate1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-slate1 border-slate1"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            className="text-slate1 border-slate1"

            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
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
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
