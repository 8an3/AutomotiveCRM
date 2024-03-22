import React, { HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, TextArea, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label } from "../components/ui/index";
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"

import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import type {
    Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import EditWishList from '../components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../components/ui/table"
import { type LinksFunction, type DataFunctionArgs } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

// dashboard
import { DataTable } from "../components/data-table"
import { type dashBoardType } from "../components/dashboard/schema";
import { DataTableColumnHeader } from "../components/dashboard/calls/header"
import ClientCard from '../components/dashboard/calls/clientCard';
import ClientVehicleCard from '../components/dashboard/calls/clientVehicleCard';
import EmailClient from '../components/dashboard/calls/emailClient';
import ClientStatusCard from '../components/dashboard/calls/ClientStatusCard';
import CompleteCall from '../components/dashboard/calls/completeCall';
import TwoDaysFromNow from '../components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "../components/actions/dashboardCalls";
import { DocumentInputs } from '../routes/dashboard.customer.$custId'
import IndeterminateCheckbox from "../components/dashboard/calls/InderterminateCheckbox"
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { ListSelection2 } from '../routes/quoteUtils/listSelection'

import AttemptedOrReached from "../components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "../components/dashboard/calls/ContactTimesByType";
import LogCall from "../components/dashboard/calls/logCall";
import Logtext from "../components/dashboard/calls/logText";
import { Badge } from "../ui/badge";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { ArrowDownCircle, ArrowDownUp, ArrowRightCircle } from 'lucide-react';
import DnDResource from './calendar.sales';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />




export let loader = dashboardLoader

export let action = dashboardAction

export const links: LinksFunction = () => [
    { rel: "icon", type: "image/svg", href: '/dashboard.svg' },
]

export default function Mainboard() {
    const [selectedTab, setSelectedTab] = useState("dashboard");
    //<TabsTrigger onClick={() => setSelectedTab("calendar")} value="calendar">Calendar</TabsTrigger>

    return (
        <>
            <Sidebar />
            <Tabs defaultValue="dashboard" >
                <TabsList className="ml-[19px] grid w-[600px] grid-cols-4">
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("dashboard")
                    }}
                        value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("newLeads")
                    }}
                        value="newLeads">New Leads</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("search")} value="search">Search Leads</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("wishList")} value="wishList">Wish List</TabsTrigger>

                </TabsList>
                {selectedTab === "dashboard" && (
                    <TabsContent className="w-[98%] mx-auto mt-5" value="dashboard">
                        <MainDashbaord />
                    </TabsContent>
                )}
                {selectedTab === "newLeads" && (
                    <TabsContent className="w-[98%]" value="newLeads">
                        <WebleadsTable />
                    </TabsContent>
                )}
                {selectedTab === "search" && (
                    <TabsContent className="w-[98%]" value="search">
                        <SearchTable />
                    </TabsContent>
                )}
                {selectedTab === "wishList" && (
                    <TabsContent className="w-[98%]" value="wishList">
                        <WishList />
                    </TabsContent>
                )}
            </Tabs>
        </>
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
export function invariant(
    condition: any,
    message: string | (() => string),
): asserts condition {
    if (!condition) {
        throw new Error(typeof message === 'function' ? message() : message)
    }
}
// search table
export function SearchTable() {
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
        <div className="mx-auto w-[95%] ">
            <div className="flex items-center py-4">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter([value])} className="font-lg border-block w-[400px] border border-[#878787] bg-[#363a3f] p-2 text-[#fff] shadow"
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
                    className="ml-2 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                />


                <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                >
                    Clear
                </Button>
            </div>
            <div className="rounded-md border border-[#3b3b3b] ">
                <Table2 className='w-full overflow-x-auto border-[#3b3b3b] text-slate1'>
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
                                                <div className="mx-auto cursor-pointer items-center justify-center border-[#3b3b3b] text-center">
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
                                    className='cursor-pointer border-[#3b3b3b] bg-slate12 p-4 capitalize text-slate1 hover:text-[#02a9ff]'
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
                                    className="h-24 cursor-pointer bg-slate12 text-center capitalize text-slate1 hover:text-[#02a9ff]"
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
                        className="border-slate1 text-slate1"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        className="border-slate1 text-slate1"

                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
// web leads table
export function WebleadsTable() {
    const { webLeadData } = useLoaderData();
    const { user } = useRootLoaderData();

    const data = webLeadData
    const [sorting, setSorting] = React.useState<SortingState>([])

    type newLead = {
        contact: string
        brand: string
        model: string
        year: string
        tradeDesc: string
        tradeYear: string
        tradeMake: string
        tradeMileage: string
        financeId: string
        clientfileId: string
        clientfile: string
        financeNote: string
        customContent: string
        author: string
        customerId: string
    }

    type Payment = {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: number
        address: string
        prov: string
        subRows?: newLead[]
    }

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({ id: false, })
    const [rowSelection, setRowSelection] = React.useState({})
    const [showFilter, setShowFilter] = useState(false);
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const columns: ColumnDef<Payment>[] = [



        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "firstName",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            className='mx-auto justify-center text-center'
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            First Name
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )

            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center lowercase">
                {row.getValue("firstName")}

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
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Last Name
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("lastName")}
            </div>
        },
        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Email
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("email")}
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
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            phone #
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )

            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("phone")}
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
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Address
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("address")}
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
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Province
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("prov")}
            </div>,
        },
        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "leadNote",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Lead Note's
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("leadNote")}
            </div>,
        },
        {
            accessorKey: "id",
            header: "Id",
            cell: ({ row }) => <div className="mx-auto justify-center text-center lowercase">
                {row.getValue("id")}
            </div>

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
        onExpandedChange: setExpanded,
        getSubRows: row => row.subRows,
        getExpandedRowModel: getExpandedRowModel(),

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            expanded,
        },
    })

    const [isRowSelected, setIsRowSelected] = useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState('');
    const [clientId, setClientId] = React.useState('');
    const [clientEmail, setClientEmail] = React.useState('');
    const [clientFirstName, setClientFirstName] = React.useState('');
    const [clientLastName, setClientLastName] = React.useState('');
    const [selectedRowData, setSelectedRowData] = React.useState([]);
    const [clientPhone, setClientPhone] = React.useState([]);
    const [clientAddress, setClientAddress] = React.useState([]);
    const [clientLeadNote, setClientLeadNote] = React.useState([]);
    const [clientFinanceId, setClientFinanceId] = React.useState([]);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const contactMethod = data.contactMethod
    const [isComplete, setIsComplete] = useState(false)
    const errors = useActionData() as Record<string, string | null>;

    const handleRowClick = (row) => {
        setIsRowSelected(true);
        setSelectedRowId(row.original.id);
        setSelectedRowData(row.original)
        setClientId(row.original.id)
        setClientEmail(row.original.email)
        setClientFirstName(row.original.firstName)
        setClientLastName(row.original.lastName)
        setClientPhone(row.original.phone)
        setClientAddress(row.original.address)
        setClientLeadNote(row.original.leadNote)
        setClientFinanceId(row.original.id)
        console.log(selectedRowData, selectedRowId, row, 'row')
    };
    const userEmail = user?.email;
    const [brandId, setBrandId] = useState('');

    const handleBrand = (e) => {
        setBrandId(e.target.value);
    };
    return (
        <div className="mx-auto mt-[75px] w-[95%] justify-center ">
            {!isRowSelected ? (
                <>
                    <div className="rounded-md border border-[#3b3b3b] ">
                        <Table2 className='w-full overflow-x-auto border-[#3b3b3b] text-slate1 '>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className=' border-[#3b3b3b]'>
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
                                                        <div className="mx-auto cursor-pointer items-center justify-center text-center ">
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
                                            className='cursor-pointer border-[#3b3b3b] bg-slate12 p-4 capitalize text-slate1 hover:text-[#02a9ff]'
                                            data-state={row.getIsSelected() && "selected"}
                                            onClick={() => {
                                                handleRowClick(row);
                                                ;
                                            }}
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
                                            className="h-24 cursor-pointer bg-slate12 text-center capitalize text-slate1 hover:text-[#02a9ff]"
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
                                className="border-slate1 text-slate1"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                className="border-slate1 text-slate1"

                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <div className='grid grid-cols-1 mx-auto  mt-3 max-w-sm mb-3'>
                    <Form method="post" >
                        <h1 className=' text-[#fff]' >
                            Customer Info
                        </h1>
                        <hr className=' max-w-sm  text-[#fff]' />
                        <div className='flex' >
                            <Input
                                className="mt-3 max-w-[186px] border-[#878787] bg-[#363a3f] text-[#fff]"
                                placeholder="First Name"
                                type="text"
                                defaultValue={clientFirstName}
                                name="firstName"
                            />
                            {errors?.firstName ? (
                                <em className="text-[#ff0202]">{errors.firstName}</em>
                            ) : null}
                            <Input
                                className="mt-3 ml-3 max-w-[186px] border-[#878787] bg-[#363a3f] text-[#fff]"
                                placeholder="Last Name"
                                type="text"
                                defaultValue={clientLastName}
                                name="lastName"
                            />
                            {errors?.lastName ? (
                                <em className="text-[#ff0202] text-right">{errors.lastName}</em>
                            ) : null}
                        </div>
                        <div className='flex' >
                            <Input
                                className="mt-3 max-w-[186px] border-[#878787] bg-[#363a3f] text-[#fff]"
                                placeholder="Email"
                                type="email"
                                defaultValue={clientEmail}
                                name="email"
                            />
                            {errors?.email ? (
                                <em className="text-[#ff0202] text-right">{errors.email}</em>
                            ) : null}
                            <Input
                                className="mt-3 ml-3 max-w-[186px] border-[#878787] bg-[#363a3f] text-[#fff]"
                                placeholder="phone"
                                type="text"
                                defaultValue={clientPhone}
                                name="phone"
                            />
                        </div>
                        <Input
                            className="mt-3 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                            placeholder="Address"
                            type="text"
                            defaultValue={clientAddress}
                            name="address"
                        />
                        <TextArea
                            defaultValue={clientLeadNote}
                            name="leadNote"
                            className="mt-3 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                            placeholder="Type your message here."
                        />
                        <Input
                            className="mt-3 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
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
                        <Input
                            className=" mt-3 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff] "
                            placeholder="Model"
                            type="text"
                            list="ListOptions"
                            name="model"
                        />
                        {errors?.model ? (
                            <em className="text-[#ff0202]">{errors.model}</em>
                        ) : null}
                        <ListSelection2 brandId={brandId} />
                        <Input
                            className="mt-3  max-w-sm  border-[#878787] bg-[#363a3f] text-[#fff]"
                            placeholder="User Email"
                            type="hidden"
                            defaultValue={user?.email}
                            name="userEmail"
                        />
                        <h1 className=' text-[#fff] mt-3' >
                            Contact Customer
                        </h1>
                        <hr className=' max-w-sm  text-[#fff]' />
                        <div className='gap-3 my-2 grid grid-cols-3 max-w-sm '>
                            <LogCall data={data} />
                            <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                            <Logtext data={data} />
                        </div>
                        <h1 className=' text-[#fff] mt-3' >
                            Quick Follow-up
                        </h1>
                        <hr className=' max-w-sm  text-[#fff]' />
                        <div className='mr-auto mt-3'>
                            <TwoDaysFromNow data={data} isSubmitting={isSubmitting} />
                        </div>
                        <h1 className=' text-[#fff] mt-3' >
                            In-depth Follow-up
                        </h1>
                        <hr className=' max-w-sm  text-[#fff]' />
                        <div className='mr-auto mt-3'>
                            <CompleteCall data={data} contactMethod={contactMethod} />
                        </div>

                        <input type='hidden' value={clientFinanceId} name='financeId' />
                        <input type='hidden' value={clientFirstName} name='firstName' />
                        <input type='hidden' value={clientLastName} name='lastName' />
                        <input type="hidden" defaultValue={clientEmail} name="email" />
                        <input type="hidden" defaultValue={clientId} name="clientId" />
                        <Input type="hidden" name="iRate" defaultValue={10.99} />
                        <Input type="hidden" name="tradeValue" defaultValue={0} />
                        <Input type="hidden" name="discount" defaultValue={0} />
                        <Input type="hidden" name="deposit" defaultValue={0} />
                        <Input type="hidden" name="months" defaultValue={60} />
                        <Input type="hidden" name="userEmail" defaultValue={userEmail} />
                        <div className="mt-[25px] flex ">
                            <Button
                                onClick={() => {
                                    toast.success(`Quote updated for ${data.firstName}`)
                                    setIsComplete(true);
                                }}
                                name='intent' value='newLead' type='submit'
                                className={` cursor-pointer mr-2 p-3 hover:text-[#02a9ff] hover:border-[#02a9ff] text-slate1 border border-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                            >
                                Complete
                            </Button>
                            <Button
                                disabled={isComplete === false}
                                className={` cursor-pointer ml-auto p-3 hover:text-[#02a9ff] hover:border-[#02a9ff] text-slate1 border border-slate1 font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
                            >
                                <Link to={`/overview/${brandId}/${clientFinanceId}`}>

                                    Overview
                                </Link>

                            </Button>
                        </div>

                    </Form>

                </div>

            )}
        </div >
    )
}
// leads dashboard
async function getData(): Promise<dashBoardType[]> {
    //turn into dynamic route and have them call the right loader like q  uote qand overview
    const res = await fetch('/dashboard/calls/loader')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
// wish list
export function WishList() {
    const { user } = useRootLoaderData();
    const { getWishList } = useLoaderData();
    const data = getWishList
    type Payment = {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string
        model: number
        model2: string
        notes: string
        userId: string
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            First Name
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )

            },
            cell: ({ row }) => <div className="text-center  lowercase">
                {row.getValue("firstName")}
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
                {row.getValue("lastName")}
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
                {row.getValue("email")}
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
                {row.getValue("phone")}
            </div>,
        },
        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "model",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Model
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">
                {row.getValue("model")}
            </div>,
        },
        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "model2",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Model 2
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">
                {row.getValue("model2")}
            </div>,
        },
        {
            filterFn: 'fuzzy',
            sortingFn: fuzzySort,
            accessorKey: "wishListNotes",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Notes
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">
                {row.getValue("wishListNotes")}
            </div>,
        },
        {
            accessorKey: "editWishlist",
            header: ({ column }) => (<p>Edit</p>),
            cell: ({ row }) => {
                const data = row.original
                return <>
                    <div className=''>
                        <EditWishList data={data} />

                    </div>
                </>
            },
        },
        {
            accessorKey: "deletewishlist",
            header: ({ column }) => (<p>Delete</p>),
            cell: ({ row }) => {
                const data = row.original
                return <>
                    <div className='mx-auto my-auto'>
                        <Form method='post'>
                            <input type='hidden' name='rowId' value={data.id} />

                            <Button variant='outline' name='intent' value='deleteWishList' className="active:bg-black mx-auto my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                            >
                                Delete
                            </Button>
                        </Form>
                    </div>
                </>
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

    const [models, setModels] = useState([]);

    const [filterBy, setFilterBy] = useState('');

    const handleInputChange = (name) => {
        setFilterBy(name);
    };
    // clears filters
    const setAllFilters = () => {
        setColumnFilters([]);
        setSorting([])
        setFilterBy('')
        setGlobalFilter('')
    };

    // toggle column filters
    const [showFilter, setShowFilter] = useState(false);

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    useEffect(() => {
        async function fetchModels() {
            const uniqueModels = [
                ...new Set(getWishList.map(wishList => wishList.model)),
                ...new Set(getWishList.map(wishList => wishList.model2)) // Add this line
            ];
            setModels(uniqueModels);
        }

        fetchModels();
    }, []);

    const handleDropdownChange = (event) => {
        setGlobalFilter(event.target.value);
    };
    return (
        <div className="mx-auto w-[95%] ">
            <div className="flex items-center py-4">
                <Input
                    value={globalFilter ?? ''}
                    onChange={event => setGlobalFilter(event.target.value)} className="font-lg border-block w-[400px] border border-[#878787] bg-[#363a3f] p-2 text-[#fff] shadow"
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
                    className="ml-2 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                />



                <select value={filterBy} onChange={handleDropdownChange}
                    className={`border-white text-[#fff] placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#363a3f] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                >
                    <option value='' >Search By Model</option>
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                >
                    Clear
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                        >
                            Add
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-[#fff]">
                        <DialogHeader>
                            <DialogTitle>Wish List</DialogTitle>
                            <DialogDescription>
                                Add customer to wish list. Once sold, you can transfer to clients.
                            </DialogDescription>
                        </DialogHeader>
                        <Form method='post' className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <input type='hidden' name='userId' value={user.id} />
                                <Label htmlFor="name" className="text-right">
                                    First Name
                                </Label>
                                <Input
                                    name="firstName"
                                    placeholder="Pedro "
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Last Name
                                </Label>
                                <Input
                                    name="lastName"
                                    placeholder="Duarte"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    name="email"
                                    placeholder="pedroduarte@gmail.com"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    name="phone"
                                    placeholder="613-613-6134"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Model
                                </Label>
                                <Input
                                    name="model"
                                    placeholder="2021 Road Glide"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Model 2
                                </Label>
                                <Input
                                    name="model2"
                                    placeholder="2021 Road King"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Notes
                                </Label>
                                <Input
                                    name="wishListNotes"
                                    placeholder="wants less than 50k kms"
                                    className="col-span-3"
                                />
                            </div>
                            <Button onClick={() => toast.success(`Added to wish list!`)}
                                type='submit' name='intent' value='addWishList' variant='outline' className="active:bg-black w-[75px] mt-10 mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                            >
                                Save
                            </Button>
                        </Form>

                    </DialogContent>
                </Dialog>

            </div>
            <div className="rounded-md border border-[#3b3b3b] ">
                <Table2 className='w-full overflow-x-auto border-[#3b3b3b] text-slate1'>
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
                                                <div className="mx-auto cursor-pointer items-center justify-center border-[#3b3b3b] text-center">
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
                                    className='cursor-pointer border-[#3b3b3b] bg-slate12 p-4 capitalize text-slate1 hover:text-[#02a9ff]'
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
                                    className="h-24 cursor-pointer bg-slate12 text-center capitalize text-slate1 hover:text-[#02a9ff]"
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
                        className="border-slate1 text-slate1"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        className="border-slate1 text-slate1"

                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
export function MainDashbaord() {
    const [data, setPaymentData,] = useState<dashBoardType[]>([]);
    useEffect(() => {
        const data = async () => {
            const result = await getData();
            setPaymentData(result);
        };
        data()
    }, []);

    return (
        <>
            <div className="bg-transparent text-gray-300 uppercase">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    )
}
export type Payment = {
    id: string
    fiannceId: string
    userEmail: string
    isSubmitting: any
    firstName: string
    lastName: string
    phone: number
    email: string
    address: string
    postal: string
    city: string
    province: string
    contactMethod: string
    brand: string
    model: string
    year: number
    color: string
    note: string
    lastContact: string
    status: 'Active' | 'Duplicate' | 'Invalid' | 'Lost'
    customerState: string
    result: string
    timesContacted: number
    nextAppointment: string
    completeCall: string
    followUpDay: number
    state: string
    typeOfContact: string | null;
    timeToContact: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime' | 'Do Not Call'
    notes: string
    visits: number
    progress: number
    visited: string
    metManager: string
    metSalesperson: string
    metFinance: string
    metService: string
    metParts: string
    financeApplication: string
    approved: string
    docsSigned: string
    delivered: string
    pickUpSet: string
    demoed: string
    seenTrade: string
    tradeRepairs: string
    dashData: string
    twoDaysFromNow: string
    referral: string
    dl: string
    timeOfDay: string
    discount: string
    total: string
    onTax: string
    deliveryCharge: string
    userLoanProt: string
    userTireandRim: string
    userGap: string
    userExtWarr: string
    userServicespkg: string
    vinE: string
    lifeDisability: string
    rustProofing: string
    userOther: string
    deposit: string
    paintPrem: string
    discountPer: string
    weeklyOthWOptions: string
    qcTax: string
    otherTax: string
    totalWithOptions: string
    otherTaxWithOptions: string
    stockNum: string
    model1: string
    modelCode: string
    tradeValue: string
    undefined: string
    pickUpDate: string
    pickUpTime: string
    lastNote: string
    singleFinNote: string
    documentUpload: string
    depositMade: string
    financeApp: string
    signed: string
    deliveredDate: string
    contactTimesByType: string
    InPerson: string
    Phone: string
    SMS: string
    Email: string

}
export type TableMeta = {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
}
export const defaultColumn: Partial<ColumnDef<Payment>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue()
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            ; (table.options.meta as TableMeta).updateData(index, id, value)
        }

        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
            <input
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
            />
        )
    },
}
const columns: ColumnDef<Payment>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        ),
    },

    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="First Name" />

            </>

        },
        cell: ({ row }) => {
            const data = row.original
            //
            return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none">
                <ClientCard data={data} />
            </div>
        },


    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="LastName" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent flex w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px]  uppercase leading-none text-[#EEEEEE] outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff] ">
                <a target="_blank" href={`/customer/${data.id}`} rel="noreferrer">
                    {(row.getValue("lastName"))}
                </a>
            </div>
        },

    },
    {

        accessorKey: "status",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="Status" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                <ClientStatusCard data={data} />
            </div>
        },
    },
    {
        accessorKey: "nextAppointment",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Next Appt" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
                const day = String(date.getDate()).padStart(2, '0');
                const hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            const formattedDate = data.nextAppointment && data.nextAppointment !== '1969-12-31 19:00' ? formatDate(data.nextAppointment) : 'TBD';

            return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff]  ">
                {data.nextAppointment === 'TBD' ? <p>TBD</p> : formattedDate}
            </div>
        },
    },
    {

        accessorKey: "customerState",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="State" />
        ), cell: ({ row }) => {
            const data = row.original
            //  const id = data.id ? data.id.toString() : '';


            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center px-5  text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff] ">
                {data.customerState === 'Pending' ? (<Badge className="bg-slate3">Pending</Badge>
                ) : data.customerState === 'Attempted' ? (<Badge className="bg-slate3">Attempted</Badge>
                ) : data.customerState === 'Reached' ? (<Badge className="bg-jade9">Reached</Badge>
                ) : data.customerState === 'sold' ? (<Badge className="bg-jade9">Sold</Badge>
                ) : data.customerState === 'depositMade' ? (<Badge className="bg-jade9">Deposit</Badge>
                ) : data.customerState === 'turnOver' ? (<Badge className="bg-blue-9">Turn Over</Badge>
                ) : data.customerState === 'financeApp' ? (<Badge className="bg-blue-9">Application Done</Badge>
                ) : data.customerState === 'approved' ? (<Badge className="bg-jade9">Approved</Badge>
                ) : data.customerState === 'signed' ? (<Badge className="bg-jade9">Signed</Badge>
                ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-jade9">Pick Up Set</Badge>
                ) : data.customerState === 'delivered' ? (<Badge className="bg-jade9">Delivered</Badge>
                ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
                ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
                ) : (
                    ''
                )}
                {data.customerState === 'Pending' && (
                    <AttemptedOrReached data={data} />
                )}
                {data.customerState === 'Attempted' && (
                    <AttemptedOrReached data={data} />
                )}

            </div>
        },
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
            const data = row.original
            // <CallClient />
            //<SmsClient data={data} />


            const [isButtonPressed, setIsButtonPressed] = useState(false);

            return <>
                <div className='my-2 grid grid-cols-3 gap-3'>
                    <LogCall data={data} />
                    <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                    <Logtext data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "model",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Model" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                <ClientVehicleCard data={data} />
            </div>
        },
    },
    {
        accessorKey: "tradeDesc",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trade" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("tradeDesc"))}</div>
        },

    },
    {
        accessorKey: "lastNote",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Note" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("lastNote"))}</div>
        },

    },
    {
        accessorKey: "singleFinNote",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Notes" />
        ),
        cell: ({ row }) => {
            const data = row.original;
            const single = data.singleFinNote;
            const last = data.lastNote
            if (single) {
                return (
                    { single }
                )
            }
            else if (last) {
                return (
                    { last }
                )
            }
            else
                return null;
        },
    },
    {
        accessorKey: "followUpDay",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Preset F/U Day" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <>

                <div className='w-[150px]'>
                    <PresetFollowUpDay data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "twoDaysFromNow",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Set New Apt." />
        ),
        cell: ({ row }) => {
            const navigation = useNavigation();
            const isSubmitting = navigation.state === "submitting";
            const data = row.original
            return <>

                <div className='w-[200px]'>
                    <TwoDaysFromNow data={data} isSubmitting={isSubmitting} />
                </div>
            </>
        },
    },
    {
        accessorKey: "completeCall",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Complete Call" />
        ),
        cell: ({ row }) => {
            const data = row.original
            const contactMethod = data.contactMethod
            return <>

                <div className='w-[125px] cursor-pointer'>

                    <CompleteCall data={data} contactMethod={contactMethod} />
                </div>
            </>
        },
    },
    {
        accessorKey: "contactTimesByType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact Times By Type" />
        ),
        cell: ({ row }) => {
            const data = row.original
            //
            return <>
                <div className='w-[175px] cursor-pointer'>
                    <ContactTimesByType data={data} />
                </div>
            </>
        },
    },
    {
        accessorKey: "pickUpDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff] " />
        ),
        cell: ({ row }) => {
            const data = row.original
            if (data.pickUpDate) {
                const pickupDate = data.pickUpDate
                return (
                    <div className="bg-transparent :text-[#02a9ff] text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">
                        {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
                    </div>
                );
            } else
                return null;
        },
    },
    {
        accessorKey: "lastContact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]" />
        ),
        cell: ({ row }) => {
            const data = row.original
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
                const day = String(date.getDate()).padStart(2, '0');
                const hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            // usage
            const formattedDate = formatDate(data.lastContact);
            if (formattedDate) {
                const lastContact1 = data.lastContact
                return (
                    <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">
                        {formattedDate === '1969-12-31 19:00' || formattedDate === null ? 'TBD' : formattedDate}
                    </div>
                );
            }
            return null;
        },

    },


    {
        accessorKey: "id",

        cell: ({ row }) => {
            const data = row.original
            return (
                <>
                    {/* <DocuUploadDashboard data={data} />*/}
                </>
            );
        },

    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <p className="text-center">email</p>
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("email"))}</div>
        },

    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <p className="text-center">phone</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("phone"))}</div>
        },

    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <p className="text-center">address</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("address"))}</div>
        },

    },
    {
        accessorKey: "postal",
        header: ({ column }) => (
            <p className="text-center">postal</p>
        ), cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff]
              hover:shadow-md


              focus:text-[#02a9ff]
               focus:outline-none active:bg-[#02a9ff]">{(row.getValue("postal"))}</div>
        },

    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="city" />
        ), cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff]
              hover:shadow-md


              focus:text-[#02a9ff]
               focus:outline-none active:bg-[#02a9ff]">{(row.getValue("city"))}</div>
        },

    },
    {
        accessorKey: "province",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="province" />
        ), cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff]
              hover:shadow-md


              focus:text-[#02a9ff]
               focus:outline-none active:bg-[#02a9ff]">{(row.getValue("province"))}</div>
        },

    },
    {
        accessorKey: "financeId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="financeId" />
        ), cell: ({ row }) => {
            return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
        },

    },
    {
        accessorKey: "userEmail",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="userEmail" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff]
              hover:shadow-md


              focus:text-[#02a9ff]
               focus:outline-none active:bg-[#02a9ff]">{(row.getValue("userEmail"))}</div>
        },

    },
    {
        accessorKey: "pickUpTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pick Up Time" />
        ),
        cell: ({ row }) => {
            return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none active:bg-[#02a9ff] ">
                {(row.getValue("pickUpTime"))}
            </div>
        },

    },

    {
        accessorKey: "timeToContact",
        header: "model1",
    },
    {
        accessorKey: "deliveredDate",
        header: "deliveredDate",
    },
    {
        accessorKey: "timeOfDay",
        header: "timeOfDay",
    },
    {
        accessorKey: "msrp",
        header: "msrp",
    },
    {
        accessorKey: "freight",
        header: "freight",
    },
    {
        accessorKey: "pdi",
        header: "pdi",
    },
    {
        accessorKey: "admin",
        header: "admin",
    },
    {
        accessorKey: "commodity",
        header: "commodity",
    },
    {
        accessorKey: "accessories",
        header: "accessories",
    },
    {
        accessorKey: "labour",
        header: "labour",
    },
    {
        accessorKey: "painPrem",
        header: "painPrem",
    },
    {
        accessorKey: "licensing",
        header: "licensing",
    },
    {
        accessorKey: "trailer",
        header: "trailer",
    },
    {
        accessorKey: "depositMade",
        header: "depositMade",
    },
    {
        accessorKey: "months",
        header: "months",
    },
    {
        accessorKey: "iRate",
        header: "iRate",
    },
    {
        accessorKey: "on60",
        header: "on60",
    },
    {
        accessorKey: "biweekly",
        header: "biweekly",
    },
    {
        accessorKey: "weekly",
        header: "weekly",
    },
    {
        accessorKey: "qc60",
        header: "qc60",
    },
    {
        accessorKey: "biweeklyqc",
        header: "biweeklyqc",
    },
    {
        accessorKey: "weeklyqc",
        header: "weeklyqc",
    },
    {
        accessorKey: "nat60",
        header: "nat60",
    },
    {
        accessorKey: "biweeklNat",
        header: "biweeklNat",
    },
    {
        accessorKey: "weeklylNat",
        header: "weeklylNat",
    },
    {
        accessorKey: "oth60",
        header: "oth60",
    },
    {
        accessorKey: "biweekOth",
        header: "biweekOth",
    },
    {
        accessorKey: "weeklyOth",
        header: "weeklyOth",
    },
    {
        accessorKey: "nat60WOptions",
        header: "nat60WOptions",
    },
    {
        accessorKey: "desiredPayments",
        header: "desiredPayments",
    },
    {
        accessorKey: "biweeklNatWOptions",
        header: "biweeklNatWOptions",
    },
    {
        accessorKey: "weeklylNatWOptions",
        header: "weeklylNatWOptions",
    },
    {
        accessorKey: "oth60WOptions",
        header: "oth60WOptions",
    },
    {
        accessorKey: "biweekOthWOptions",
        header: "biweekOthWOptions",
    },
    {
        accessorKey: "visited",
        header: "visited",
    },
    {
        accessorKey: "aptShowed",
        header: "aptShowed",
    },
    {
        accessorKey: "bookedApt",
        header: "bookedApt",
    },
    {
        accessorKey: "aptNoShowed",
        header: "aptNoShowed",
    },
    {
        accessorKey: "testDrive",
        header: "testDrive",
    },
    {
        accessorKey: "metParts",
        header: "metParts",
    },
    {
        accessorKey: "sold",
        header: "sold",
    },

    {
        accessorKey: "refund",
        header: "refund",
    },
    {
        accessorKey: "turnOver",
        header: "turnOver",
    },
    {
        accessorKey: "financeApp",
        header: "financeApp",
    },
    {
        accessorKey: "approved",
        header: "approved",
    },
    {
        accessorKey: "signed",
        header: "signed",
    },

    {
        accessorKey: "pickUpSet",
        header: "pickUpSet",
    },
    {
        accessorKey: "demoed",
        header: "demoed",
    },

    {
        accessorKey: "tradeMake",
        header: "tradeMake",
    },
    {
        accessorKey: "tradeYear",
        header: "tradeYear",
    },
    {
        accessorKey: "tradeTrim",
        header: "tradeTrim",
    },
    {
        accessorKey: "tradeColor",
        header: "tradeColor",
    },
    {
        accessorKey: "tradeVin",
        header: "tradeVin",
    },
    {
        accessorKey: "delivered",
        header: "delivered",
    },
    {
        accessorKey: "desiredPayments",
        header: "desiredPayments",
    },
    {
        accessorKey: "result",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Result" />
        ), cell: ({ row }) => {

            return <div className="w-[250px] text-center font-medium">
                Result
            </div>
        },

    },
    {
        accessorKey: "referral",
        header: "referral",
    },
    {
        accessorKey: "metService",
        header: "metService",
    },

    {
        accessorKey: "metManager",
        header: "metManager",
    },
    {
        accessorKey: "metParts",
        header: "metParts",
    },
    {
        accessorKey: "timesContacted",
        header: "timesContacted",
    },

    {
        accessorKey: "visits",
        header: "visits",
    },
    {
        accessorKey: "financeApplication",
        header: "financeApplication",
    },
    {
        accessorKey: "progress",
        header: "progress",
    },

    {
        accessorKey: "metFinance",
        header: "metFinance",
    },
    {
        accessorKey: "metSalesperson",
        header: "metSalesperson",
    },
    {
        accessorKey: "seenTrade",
        header: "seenTrade",
    },
    {
        accessorKey: "docsSigned",
        header: "docsSigned",
    },
    {
        accessorKey: "tradeRepairs",
        header: "tradeRepairs",
    },
    {
        accessorKey: "tradeValue",
        header: "tradeValue",
    },
    {
        accessorKey: "modelCode",
        header: "modelCode",
    },
    {
        accessorKey: "color",
        header: "color",
    },
    {
        accessorKey: "model1",
        header: "model1",
    },
    {
        accessorKey: "stockNum",
        header: "stockNum",
    },
    {
        accessorKey: "otherTaxWithOptions",
        header: "otherTaxWithOptions",
    },
    {
        accessorKey: "totalWithOptions",
        header: "totalWithOptions",
    },
    {
        accessorKey: "otherTax",
        header: "otherTax",
    },
    {
        accessorKey: "qcTax",
        header: "lastContact",
    },
    {
        accessorKey: "deposit",
        header: "tradeValue",
    },
    {
        accessorKey: "rustProofing",
        header: "modelCode",
    },
    {
        accessorKey: "lifeDisability",
        header: "color",
    },
    {
        accessorKey: "userServicespkg",
        header: "model1",
    },
    {
        accessorKey: "userExtWarr",
        header: "userExtWarr",
    },
    {
        accessorKey: "userGap",
        header: "userGap",
    },
    {
        accessorKey: "userTireandRim",
        header: "userTireandRim",
    },
    {
        accessorKey: "userLoanProt",
        header: "userLoanProt",
    },
    {
        accessorKey: "deliveryCharge",
        header: "lastContact",
    },
    {
        accessorKey: "onTax",
        header: "tradeValue",
    },
    {
        accessorKey: "total",
        header: "modelCode",
    },
    {
        accessorKey: "typeOfContact",
        header: "typeOfContact",
    },
    {
        accessorKey: "contactMethod",
        header: "contactMethod",
    },
    {
        accessorKey: "note",
        header: "note",
    },



]
