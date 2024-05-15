import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import React, { HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, TextArea, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label } from "~/components/ui/index";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"

import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { type LinksFunction, type DataFunctionArgs } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

export function SearchCustomerModal() {
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              className='text-black'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              First Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center  lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              className='text-black'

              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Last Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center  lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              className='text-black'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              className='text-black'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              phone #
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              className='text-black'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Address
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
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
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              className='text-black'
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Province
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        <a target="_blank" href={`/customer/${row.getValue("id")}`} rel="noreferrer">
          {row.getValue("prov")}
        </a></div>,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className=' px-4 mt-3 mx-auto text-[#fafafa] cursor-pointer hover:text-[#02a9ff] justify-center items-center   border-[#fff] hover:border-[#02a9ff] bg-transparent hover:bg-transparent w-[240px]'>
          <>
            <Search size={20} strokeWidth={1.5} />
            <p className='ml-2'>
              Search Customer
            </p>
          </>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] bg-white">
        <DialogHeader>
          <DialogTitle>Search Clients</DialogTitle>
        </DialogHeader>
        <div className="mx-auto my-auto w-[95%] ">
          <div className="flex items-center py-4">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter([value])} className="font-lg border-block w-[400px] border border-black bg-white p-2 text-black shadow"
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
              className="ml-2 max-w-sm border-black bg-white text-black "
            />


            <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-[#09090b] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
            >
              Clear
            </Button>
          </div>
          <div className="rounded-md border border-black ">
            <Table2 className='w-full overflow-x-auto border-black text-[#fafafa]'>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className=' border-black'>
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
                            <div className="mx-auto cursor-pointer items-center justify-center border-black text-center">
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
                      className='cursor-pointer border-black bg-white p-4 capitalize text-black hover:text-[#02a9ff]'
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
                      className="h-24 cursor-pointer bg-[#09090b] text-center capitalize text-[#fafafa] hover:text-[#02a9ff]"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table2>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">

            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-slate1 text-[#fafafa]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                className="border-slate1 text-[#fafafa]"

                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
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
          className="w-24 rounded border shadow"
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
          className="w-24 rounded border shadow"
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
        className="w-36 rounded border shadow"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
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
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
