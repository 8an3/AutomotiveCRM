import React, { useEffect, useRef, useState } from 'react'
import { Form, Link, useActionData, useLoaderData, useNavigation, useNavigate, useSubmit } from '@remix-run/react'
import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Input,
    Label,
    ScrollArea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "~/components";
import { CaretSortIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import { Checkbox, Flex, Text } from '@radix-ui/themes';
import type {
    Column,
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    FilterFn,
    SortingFn,
    SortingState,
    Table,
    VisibilityState,
} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable
} from "@tanstack/react-table";
import { toast } from "sonner"
import EditWishList from '~/components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { json, type LinksFunction } from '@remix-run/node';
import { compareItems, type RankingInfo, rankItem, } from '@tanstack/match-sorter-utils'
import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "~/components/actions/financeCalls";
import { CalendarCheck, Landmark } from "lucide-react";
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import * as Dialog from '@radix-ui/react-dialog';
import {
    Dialog as RootDialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import AddCustomer from '~/components/dashboard/calls/addCustomer';
import { DataTablePagination } from '~/components/dashboard/calls/pagination';
import { FinanceModal } from '~/components/dashboard/calls/financeModal';
import { ButtonLoading } from "~/components/ui/button-loading";
import useSWR from 'swr';
import LastNote from '~/components/dashboard/calls/lastNote';
import WishList from '~/components/dashboard/wishlist/wishList'
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import { SmDataTable } from '~/components/smData-table';
import { DataTable } from "~/components/data-table"
import SmClientCard from '~/components/dashboard/calls/smClientCard';
import { Mail, MessageSquare } from 'lucide-react';
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { FinanceDialog } from '~/components/dashboard/calls/finance';
import { prisma } from '~/libs';
import axios from 'axios'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

export let loader = dashboardLoader

export let action = dashboardAction

export const links: LinksFunction = () => [
    { rel: "icon", type: "image/svg", href: '/dashboard.svg' },
]

let url = '/dealer/api/finance'

export default function Mainboard() {
    const { user } = useLoaderData()
    const submit = useSubmit();
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [selectedTab, setSelectedTab] = useState("dashboard");




    return (
        <>
            <Tabs className='mt-[50px] ' defaultValue="dashboard">
                <TabsList className="ml-[5px]">
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("dashboard")
                    }}
                        value="dashboard">Finance Dashboard</TabsTrigger>
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("newLeads")
                    }}
                        value="newLeads">New Leads</TabsTrigger>

                </TabsList>
                {selectedTab === "dashboard" && (
                    <TabsContent className="w-[98%] mx-auto mt-5" value="dashboard">
                        <FinanceBoard />
                    </TabsContent>
                )}
                {selectedTab === "newLeads" && (
                    <TabsContent className="w-[98%]" value="newLeads">
                        <WebleadsTable />
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
                    onChange={value => setGlobalFilter([value])}
                    className="font-lg border-block w-[400px] border border-[#878787] bg-[#363a3f] p-2 text-[#fff] shadow"
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


                <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline'
                    className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-background px-3 py-2  text-center text-xs  font-bold uppercase text-foreground shadow outline-none  transition-all duration-150 ease-linear hover:border-primary  hover:text-primary hover:shadow-md focus:outline-none"
                >
                    Clear
                </Button>
            </div>
            <div className="rounded-md border border-border ">
                <Table2 className='w-full overflow-x-auto border-border text-foreground'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className=' border-border'>
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
                                                <div
                                                    className="mx-auto cursor-pointer items-center justify-center border-border text-center">
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
                                    className='cursor-pointer border-border bg-background p-4 capitalize text-foreground hover:text-primary'
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
                                    className="h-24 cursor-pointer bg-background text-center capitalize text-foreground hover:text-primary"
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
                        className="border-slate1 text-foreground"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        className="border-slate1 text-foreground"

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
    const { financeNewLead, user } = useLoaderData();
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await prisma.finance.findMany({
                where: { customerState: 'turnOver' }
            })
            setData(data)
        };
        fetchData();
        // Set interval to call fetchData every 120 seconds (120000 milliseconds)
        const intervalId = setInterval(fetchData, 120000);

        // Clean up the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);
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
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({ id: false, });
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
            accessorKey: "customerState",
            header: ({ column }) => {
                return (
                    <div className="mx-auto justify-center text-center lowercase">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            customerState
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                )
            },
            cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
                {row.getValue("customerState")}
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
        globalFilterFn: fuzzyFilter,

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
    const [globalFilter, setGlobalFilter] = React.useState('')

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
        setSelectedRowData(row);
        setIsModalOpen(true);
        setOpen(true)
        console.log(selectedRowData, selectedRowId, row, 'row')
    };

    const userEmail = user?.email;
    const [brandId, setBrandId] = useState('');

    const handleBrand = (e) => {
        setBrandId(e.target.value);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = React.useState(false);

    return (
        <div className="mx-auto mt-[75px] w-[95%] justify-center ">

            <>
                <div className="rounded-md border border-border ">
                    <Table2 className='w-full overflow-x-auto border-border text-foreground '>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className=' border-border'>
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
                                        className='cursor-pointer border-border bg-background p-4 capitalize text-foreground hover:text-primary'
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
                                        className="h-24 cursor-pointer bg-background text-center capitalize text-foreground hover:text-primary"
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
                            className="border-slate1 text-foreground"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            className="border-slate1 text-foreground"

                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </>

            {isModalOpen && (
                <RootDialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <Form
                        // onSubmit={(event) => {
                        //     wait().then(() => setOpen(false));
                        //</DialogContent>    event.preventDefault();
                        // }}
                        >
                            <div className=" gap-4 py-4">
                                <p>Claim and start the finance process...</p>
                                <Button variant="outline" name="intent" value='claimCustomer' className='text-black border-black'>
                                    Claim
                                </Button>
                            </div>
                            <input type='hidden' name='financeId' defaultValue={clientFinanceId} />
                            <input type='hidden' name='email' defaultValue={user.email} />
                        </Form>
                    </DialogContent>
                </RootDialog>
            )}


        </div>
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
export const meta: MetaFunction = () => {
    return [
        { title: 'Finance Leads - Dealer Sales Assistant' },
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
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    dashData: TData[];
}
export function FinanceBoard() {
    let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
    let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
    //const username = user?.username.toLowerCase().replace(/\s/g, '');//'skylerzanth'//localStorage.getItem("username") ?? "";
    //const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
    const proxyPhone = '+12176347250'

    const { finance, searchData, user, getTemplates, callToken, conversationsData, convoList, newToken, deFees, products, emailTemplatesDropdown } = useLoaderData();
    const [data, setPaymentData,] = useState<dashBoardType[]>(finance);
    const [messagesConvo, setMessagesConvo] = useState([]);
    const [selectedChannelSid, setSelectedChannelSid] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState([]);
    const [templates, setTemplates] = useState(getTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [conversationSID, setConversationSID] = useState('')
    const [loggedIn, setLoggedIn] = useState(user.email);
    const [statusString, setStatusString] = useState("Fetching credentials…");

    const [text, setText] = useState('');

    let multipliedConvoList = [];
    for (let i = 0; i < 30; i++) {
        multipliedConvoList = multipliedConvoList.concat(convoList);
    }
    const [channels, setChannels] = useState(multipliedConvoList);
    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState(text);
    const [message, setMessage] = useState(messages || null);
    const [chatReady, setChatReady] = useState(false);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [isTyping, setIsTyping] = useState(true);

    const [newClient, setClient] = useState();
    const [newMessage, setNewMessage] = useState("");

    const [token, setToken] = useState(newToken);

    const [name, setName] = useState(username);
    const [to, setTo] = useState('');
    const [channelName, setChannelName] = useState('');
    const [from, setFrom] = useState('');
    const [conversation_sid, setConversation_sid] = useState('');
    const [smsMenu, setSmsMenu] = useState('true');
    const [sms, setSms] = useState(true);
    const [size, setSize] = useState(751);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [conversation, SetConversation] = useState('list');
    const [conversationsList, setConversationsList] = useState([])
    const [customer, setCustomer] = useState()

    const [convos, setConvos] = useState([])
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";


    useEffect(() => {
        const data = async () => {
            const result = await getData();
            setPaymentData(result);
        };
        data()
    }, []);

    const dataFetcher = (url) => fetch(url).then(res => res.json());
    const { data: swrData } = useSWR(isSubmitting ? 'http://localhost:3000/dealer/dashboard/calls/loader' : null, dataFetcher, {})

    useEffect(() => {
        if (swrData) {
            setPaymentData(swrData);
            console.log('hitswr!! ')
        }
    }, [swrData]);
    const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

    const defaultColumn: Partial<ColumnDef<Payment>> = {
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

    const [open, setOpen] = useState(false);
    const [openSMS, setOpenSMS] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerfinanceId, setCustomerfinanceId] = useState('')
    const handleButtonClick = (rowData) => {
        setOpen(true);
        setCustomerEmail(rowData.email);
        setCustomerName(rowData.name);
        setCustomerfinanceId(rowData.financeId);
    };
    const getObjectById = (id) => { return searchData.find(item => item.id === id); };

    const [smsDetails, setSmsDetails] = useState([])

    const handleButtonClickSMS = async (data) => {
        const theFile = await getObjectById(data.clientfileId)
        const clientfileId = data.clientfileId
        const conversationId = theFile?.conversationId
        const messageDetails = {
            conversationId: conversationId,
            clientfileId: clientfileId,
            name: data.name,
            email: data.email,
            financeId: data.id,
            phone: data.phone,
            identity: `+1${user.phone}`,
        }
        setSmsDetails(messageDetails)
        setChannelName(data.author || conversationId)
        setSelectedChannelSid(conversationId);
        setOpenSMS(true);
    }
    const selectedChannel = Array.isArray(channels) ? channels.find((it) => it.sid === selectedChannelSid) : null;

    useEffect(() => {
        const initConversations = async () => {
            const token = callToken

            setTimeout(() => {
                const client = new Client(token);
                setClient(client);
                setStatusString("Connecting to Twilio…")

                client.on("connectionStateChanged", (state) => {
                    if (state === "connecting") {
                        setStatusString("Connecting to Twilio…")
                        setStatus("default")
                    }
                    if (state === "connected") {
                        setStatusString("You are connected.")
                        setStatus("success")
                        setLoading(false)
                        setLoggedIn(user.email)
                    }
                    if (state === "disconnecting") {
                        setStatusString("Disconnecting from Twilio…")
                        setChatReady(false)
                        setStatus("default")
                    }
                    if (state === "disconnected") {
                        setStatusString("Disconnected.",)
                        setChatReady(false)
                        setStatus("warning")
                    }
                    if (state === "denied") {
                        setStatusString("Failed to connect.",)
                        setChatReady(false)
                        setStatus("error")
                    }
                });

                client.on('tokenAboutToExpire', () => {
                    console.log('About to expire');
                    const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
                    const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
                    setName(username)
                    if (username.length > 0 && password.length > 0) {
                        getToken(username, password)
                            .then((token) => {
                                // login(token);
                                setToken(token)
                            })
                            .catch(() => {
                                localStorage.setItem("username", username);
                                localStorage.setItem("password", password);
                            })
                            .finally(() => {
                                setLoading(false);
                                setStatusString("Fetching credentials…");
                            });
                    }
                });
                client.on('tokenExpired', () => {
                    console.log('Token expired');
                    client.removeAllListeners();
                    const client2 = new Client(token);
                    setClient(client2);
                    setStatusString("Connecting to Twilio…")
                });
                client.on("conversationJoined", (conversation) => {
                    setChannels((prevChannels) => [...prevChannels, conversation]);
                });
                client.on("conversationLeft", (thisConversation) => {
                    setChannels((prevChannels) =>
                        prevChannels.filter((it) => it !== thisConversation)
                    );
                });
                client.on('typingStarted', (user) => {
                    console.log('typing..', user);
                    if (user.conversation.sid === currentConversation.sid) setIsTyping(true);
                });
                client.on('typingEnded', (user) => {
                    console.log('typing end..', user);
                    if (user.conversation.sid === currentConversation.sid) setIsTyping(false);
                });
            }, 10);

        }
        initConversations()
        setChatReady(true);
    }, []);

    let channelContent;
    const [state, setState] = useState({
        newMessage: '',
        channelProxy: selectedChannel,
        messages: [],
        loadingState: 'initializing',
        boundChannels: new Set(),
    });

    const messagesRef = useRef(null);

    const columns: ColumnDef<Payment>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <div className='flex mx-auto my-auto'>
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className='border-[#c72323]'

                    />

                </div>


            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className='border-[#c72323]'

                    />
                </div>
            ),
        },
        {
            accessorKey: "bank",
            header: ({ column }) => {
                return <>
                    <DataTableColumnHeader column={column} title="Finance" />
                </>
            },
            cell: ({ row }) => {
                const data = row.original
                //<FinanceDialog data={data} user={user} deFees={deFees} products={products} emailTemplatesDropdown={emailTemplatesDropdown} />
                return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
                    <a href={`/dealer/leads/finance/${data.id}`} target="_blank">
                        <Button variant="outline"><Landmark color="#fcfcfc" /></Button>
                    </a>


                </div>
            },
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
                return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
                    <ClientCard data={data} row={row} />
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
                return <div className="bg-transparent flex w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px]  uppercase leading-none text-[#EEEEEE] outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-primary hover:text-primary focus:text-primary  focus:outline-none  active:bg-primary ">
                    {(row.getValue("lastName"))}
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
                return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
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
                return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
                    {String(data.nextAppointment)}
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
                return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">
                    {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
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
                let channelContent
                if (selectedChannelSid) {
                    channelContent = selectedChannelSid
                } else if (statusString !== "success") {
                    channelContent = "Loading your chat!";
                } else {
                    channelContent = "";
                }
                return <>
                    <div className=' items-center grid grid-cols-3 gap-3'>
                        <LogCall
                            data={data}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleButtonClick(data)}
                            className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
                            <Mail className="" />
                        </Button>
                        <EmailClient
                            data={data}
                            open={open}
                            setOpen={setOpen}
                            customerfinanceId={customerfinanceId}
                            customerName={customerName}
                            customerEmail={customerEmail}
                        />
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                handleButtonClickSMS(data)
                            }}
                            className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
                            <MessageSquare color="#ffffff" />
                        </Button>
                        <Logtext
                            data={data}
                            searchData={searchData}
                            openSMS={openSMS}
                            setOpenSMS={setOpenSMS}
                            smsDetails={smsDetails}
                            text={text}
                            setText={setText}
                            conversationsData={conversationsData}
                            messagesConvo={messagesConvo}
                        />
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
                return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE] hover:text-primary">
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
            },

        },
        {
            accessorKey: "lastNote",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Note" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
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

                        <CompleteCall data={data} user={user} />
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
                <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
            ),
            cell: ({ row }) => {
                const data = row.original
                if (data.pickUpDate) {
                    const pickupDate = data.pickUpDate
                    return (
                        <div className="bg-transparent :text-primary text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
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
                <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const date = new Date(data.lastContact);
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                if (date) {
                    return (
                        <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
                            {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
                        </div>
                    );
                }
                return null;
            },

        },
        {
            accessorKey: "unitPicker",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Turnover" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const lockedValue = Boolean(true)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigation = useNavigation();
                const isSubmitting = navigation.state === "submitting";
                const PromiseConst = async () => {
                    const promise = await new Promise(resolve => setTimeout(resolve, 3000));
                    return promise
                }
                PromiseConst()


                /**
                 * <FinanceTurnover data={data} lockedValue={lockedValue} />
                    <input type='hidden' name='intent' value='financeTurnover' />
                    <Form method='post' onSubmit={handleSubmit}>
                        <input type='hidden' name='locked' value={lockedValue} />
                        <input type='hidden' name='financeId' value={data.id} />
                    </Form>

                    *
                    */
                return <>
                    <div className='w-[175px] cursor-pointer'>
                        <Form method='post' >
                            <input type='hidden' name='intent' value='financeTurnover' />
                            <input type='hidden' name='locked' value={lockedValue} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="lg"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Updating client info..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>
                    </div>
                </>
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
            },

        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <p className="text-center">phone</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
            },

        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <p className="text-center">address</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
            },

        },
        {
            accessorKey: "postal",
            header: ({ column }) => (
                <p className="text-center">postal</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
            },

        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="city" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
            },

        },
        {
            accessorKey: "province",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="province" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
            },

        },
        {
            accessorKey: "pickUpTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pick Up Time" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
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
    const smColumns: ColumnDef<Payment>[] = [
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
                return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px]   leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
                    <SmClientCard data={data} searchData={searchData} />
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
                return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
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

                const date = new Date(String());
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };

                return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
                    {String(data.nextAppointment)}
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
                return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">

                    {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
                    ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
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
                const [isButtonPressed, setIsButtonPressed] = useState(false);
                const handleLoad = () => {
                    const iFrameData = {
                        user,
                        searchData,
                        data
                    }
                    console.log(iFrameData, 'iFrameData')
                    iFrameRef.current?.contentWindow?.postMessage(iFrameData, '*');
                }
                return <>
                    <div className='my-2 grid grid-cols-3 gap-3'>
                        <LogCall data={data} />
                        <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
                        <Button variant='ghost' onClick={handleLoad} className='my-auto mx-auto'>
                            <Logtext data={data} searchData={searchData} iFrameRef={iFrameRef} />
                        </Button>
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
            },

        },
        {
            accessorKey: "lastNote",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Last Note" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
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
                <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
            ),
            cell: ({ row }) => {
                const data = row.original
                if (data.pickUpDate) {
                    const pickupDate = data.pickUpDate
                    return (
                        <div className="bg-transparent :text-primary text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
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
                <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const date = new Date(data.lastContact);
                const options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                };
                if (date) {
                    return (
                        <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
                            {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
                        </div>
                    );
                }
                return null;
            },

        },
        {
            accessorKey: "unitPicker",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Turnover" />
            ),
            cell: ({ row }) => {
                const data = row.original
                const lockedValue = Boolean(true)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const navigation = useNavigation();
                const isSubmitting = navigation.state === "submitting";
                const PromiseConst = async () => {
                    const promise = await new Promise(resolve => setTimeout(resolve, 3000));
                    return promise
                }
                PromiseConst()


                /**
                 * <FinanceTurnover data={data} lockedValue={lockedValue} />
                    <input type='hidden' name='intent' value='financeTurnover' />
                    <Form method='post' onSubmit={handleSubmit}>
                        <input type='hidden' name='locked' value={lockedValue} />
                        <input type='hidden' name='financeId' value={data.id} />
                    </Form>

                    *
                    */
                return <>
                    <div className='w-[175px] cursor-pointer'>
                        <Form method='post' >
                            <input type='hidden' name='intent' value='financeTurnover' />
                            <input type='hidden' name='locked' value={lockedValue} />
                            <input type='hidden' name='financeId' value={data.id} />
                            <ButtonLoading
                                size="lg"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                type="submit"
                                isSubmitting={isSubmitting}
                                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                                loadingText="Updating client info..."
                            >
                                Finance Turnover
                            </ButtonLoading>
                        </Form>
                    </div>
                </>
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
            },

        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <p className="text-center">phone</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
            },

        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <p className="text-center">address</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
            },

        },
        {
            accessorKey: "postal",
            header: ({ column }) => (
                <p className="text-center">postal</p>
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
            },

        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="city" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
            },

        },
        {
            accessorKey: "province",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="province" />
            ), cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
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
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
            },

        },
        {
            accessorKey: "pickUpTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pick Up Time" />
            ),
            cell: ({ row }) => {
                return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
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

    const submit = useSubmit();
    const navigate = useNavigate();

    const fetcher = async url => await axios.get(url).then(res => res.data)

    const { data: locked, error } = useSWR('/dealer/api/checkLocked', fetcher, {
        refreshInterval: 60000,
        revalidateOnMount: true,
        revalidateOnReconnect: true
    });
    const [lockData, setLockData] = useState();
    const [financeData, setFinanceData] = useState();
    const [openResponse, setOpenResponse] = useState(false);


    useEffect(() => {
        if (locked) {
            setLockData(locked.locked)
            setFinanceData(locked.locked)
            //  setOpen(true);
            console.log(lockData, financeData, 'data')
            console.log(lockData, financeData, 'data')
            setOpenResponse(true);
        }
    }, [locked]);
    if (error) {
        console.log('SWR error:', error);
    }

    const HandleButtonClick = async () => {
        const formData = new FormData();
        formData.append("locked", false);
        formData.append("financeEmail", user.email);
        formData.append("financeId", financeData.financeId);
        formData.append("claimId", financeData.lockedId);
        formData.append("intent", 'claimClientTurnover');
        const update = submit(formData, { method: "post" });
        setOpenResponse(false)
        return json({ update })
    };

    const HandleButtonClickAndNavigate = async () => {
        const formData = new FormData();
        formData.append("locked", false);
        formData.append("financeEmail", user.email);
        formData.append("financeId", financeData.financeId);
        formData.append("claimId", financeData.lockedId);
        formData.append("intent", 'claimClientTurnover');
        submit(formData, { method: "post" });
        setOpenResponse(false)
        return navigate(`/customer/${financeData.clientfileId}/${financeData.id}`)
    };



    return (
        <div>
            <div className="block md:hidden">
                <SmDataTable columns={smColumns} data={data} />
            </div>
            <div className="hidden md:block">
                <DataTable columns={columns} data={data} user={user} />
            </div>
            {lockData && (
                <AlertDialog open={openResponse} onOpenChange={setOpenResponse}>
                    <AlertDialogContent className='border border-border bg-background text-foreground'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Client Turnover</AlertDialogTitle>
                            <AlertDialogDescription className='grid grid-cols-1'>
                                <p>{lockData.customerName}</p>
                                <p>{lockData.unit}</p>
                                <p>{lockData.note}</p>
                                <p>Sales: {lockData.salesEmail}</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex justify-end gap-[25px]">
                                <ButtonLoading
                                    size="sm"
                                    className="w-auto cursor-pointer mr-auto mt-5 hover:text-primary  "
                                    type="submit"
                                    isSubmitting={isSubmitting}
                                    onClick={() => {
                                        HandleButtonClickAndNavigate()
                                        toast.success(`Navigating to customer's file...`)
                                    }}
                                    loadingText="Updating client info..."
                                >
                                    Customer File
                                </ButtonLoading>
                                <ButtonLoading
                                    size="sm"
                                    className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                                    type="submit"
                                    isSubmitting={isSubmitting}
                                    onClick={() => {
                                        HandleButtonClick()
                                        toast.success(`Claimed next customer...`)
                                    }}
                                    loadingText="Updating client info..."
                                >
                                    Claim
                                </ButtonLoading>

                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}


        </div>
    )
}
