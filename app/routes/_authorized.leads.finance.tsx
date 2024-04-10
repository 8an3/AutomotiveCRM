import React, { useEffect, useState } from 'react'
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
import EditWishList from '../components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../components/ui/table"
import { type LinksFunction } from '@remix-run/node';
import { compareItems, type RankingInfo, rankItem, } from '@tanstack/match-sorter-utils'
import { type dashBoardType } from "../components/dashboard/schema";
import { DataTableColumnHeader } from "../components/dashboard/calls/header"
import ClientCard from '../components/dashboard/calls/clientCard';
import ClientVehicleCard from '../components/dashboard/calls/clientVehicleCard';
import EmailClient from '../components/dashboard/calls/emailClient';
import ClientStatusCard from '../components/dashboard/calls/ClientStatusCard';
import CompleteCall from '../components/dashboard/calls/completeCall';
import TwoDaysFromNow from '../components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "../components/actions/dashboardCalls";
import { CalendarCheck } from "lucide-react";
import AttemptedOrReached from "../components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "../components/dashboard/calls/ContactTimesByType";
import LogCall from "../components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "../ui/badge";
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
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ButtonLoading } from "~/components/ui/button-loading";
import useSWR from 'swr';
import LastNote from '~/components/dashboard/calls/lastNote';
import WishList from '~/components/dashboard/shared/wishList'

export let loader = dashboardLoader

export let action = dashboardAction

export const links: LinksFunction = () => [
    { rel: "icon", type: "image/svg", href: '/dashboard.svg' },
]

let url = '/api/finance'

export default function Mainboard() {
    const submit = useSubmit();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("dashboard");
    const { data: lockData, mutate, error } = useSWR(url, (url) => fetch(url).then((res) => res.json()), { refreshInterval: 60000 });
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState(0);
    const [financeData, setFinanceData] = useState({});

    useEffect(() => {
        try {
            console.log(lockData, 'Before SetValues'); // Log before SetValues is called

            function SetValues() {
                console.log(lockData, 'Inside SetValues'); // Log inside SetValues
                if (lockData.lockedData !== undefined) {
                    setOpen(lockData.lockedData); // Assuming 'locked' is the property you want to use
                    setKey((prevKey) => prevKey + 1);
                    setFinanceData(lockData)
                }
            }

            console.log(open, 'Before SetValues'); // Log before SetValues is called
            console.log(lockData, 'Before SetValues'); // Log before SetValues is called

            SetValues();

            console.log(open, 'After SetValues'); // Log after SetValues is called
            console.log(lockData, 'After SetValues'); // Log after SetValues is called
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }, [error, lockData]);


    const updateDatabaseState = async () => {
        try {
            console.log('formData.financeId:', lockData);
            const formData = new FormData();
            formData.append("intent", "claimTurnover");
            submit(formData, { method: "post" });


            console.log('Updated lock:', update);
            await mutate();
            return update;

        } catch (error) {
            console.error('Database update error:', error);
        }
    };

    const lockedValue = false;

    const HandleButtonClick = async () => {
        await updateDatabaseState();

        const newOpen = await fetch(url).then(response => response.json()).then(data => console.log(data)).catch(error => console.error('Error fetching data:', error));
        setOpen(newOpen)
        await mutate();
        //   revalidator.revalidate();
    };

    const HandleButtonClickAndNavigate = async () => {
        await updateDatabaseState();

        const newOpen = await fetch(url).then(response => response.json()).then(data => console.log(data)).catch(error => console.error('Error fetching data:', error));
        setOpen(newOpen)
        await mutate();
        return navigate(`/customer/${financeData.clientfileId}/${financeData.id}`)
    };

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <>
            <Tabs defaultValue="dashboard">
                <TabsList className="ml-[19px] grid w-[600px] grid-cols-4">
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
                    <TabsTrigger onClick={() => setSelectedTab("search")} value="search">Search Leads</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("wishList")} value="wishList">Wish List</TabsTrigger>

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


            <AlertDialog.Root key={key} open={open} onOpenChange={() => setOpen(false)}>


                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <AlertDialog.Content
                        className=" z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                        <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                            {financeData.firstName} {financeData?.lastName} is waiting to apply for financing...

                        </AlertDialog.Title>
                        <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                            {financeData.year !== undefined && financeData.year && (
                                <p>Year: {financeData.year}</p>
                            )}
                            {financeData.model1 !== undefined && financeData.model && (
                                <p>Unit: {financeData.model1 ? financeData.model1 : financeData.model}</p>
                            )}

                            {financeData.userEmail !== undefined && financeData.userEmail && (
                                <p>Sales person: {financeData.userEmail}</p>
                            )}

                            {financeData.options !== undefined && financeData.options && (
                                <p>Notes:</p>
                            )}

                        </AlertDialog.Description>
                        <div className="flex justify-end gap-[25px]">
                            <ButtonLoading
                                size="lg"
                                className="w-auto cursor-pointer mr-auto mt-5 hover:text-[#02a9ff]  "
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
                                size="lg"
                                className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff]"
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
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
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
                    className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-3 py-2  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
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
                                                <div
                                                    className="mx-auto cursor-pointer items-center justify-center border-[#3b3b3b] text-center">
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
    const { financeNewLead, user } = useLoaderData();
    const filteredDashboards = financeNewLead
        .map((dashboard) => {
            if (dashboard.customerState === 'turnOver') {
                return dashboard
            }
        })
        .filter(Boolean)
    const data = filteredDashboards
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

// leads dashboard
async function getData(): Promise<dashBoardType[]> {
    //turn into dynamic route and have them call the right loader like q  uote qand overview
    const res = await fetch('/dashboard/calls/loader/finance')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
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
    const { deFees, manOptions, bmwMoto, bmwMoto2, user, records } = useLoaderData()

    const [data, setPaymentData,] = useState<dashBoardType[]>([]);
    useEffect(() => {
        const data = async () => {
            const result = await getData();
            //const filteredData = result.filter(item => item.financeManager === user.email);
            setPaymentData(result);
        };
        data()
    }, []);
    //console.log(data, 'data')
    const [sorting, setSorting] = React.useState<SortingState>([])

    type newLead = {
        contact: string

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
        sold: string
        deposit: string
        signed: string
        docsSigned: string
        approved: string
        deliveredDate: string
        financeApplication: string
        delivered: string
        tradeInsp: string
        pickUpSet: string
        licensingSent: string
        liceningDone: string
        lost: string
        make: string
        year: string
        modelName: string
        model2: string
        submodel: string
        price: string
        brand: string
        model: string
        year: string
        tradeDesc: string
        tradeYear: string
        tradeMake: string
        tradeMileage: string
    }

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            id: false,
            tradeDesc: false,
            lastNote: false,
            contactTimesByType: false,
            pickUpDate: false,
            lastContact: false,
            email: false,
            phone: false,
            address: false,
            postal: false,
            city: false,
            province: false,
            financeId: false,
            userEmail: false,
            pickUpTime: false,
            timeToContact: false,
            timeOfDay: false,
            msrp: false,
            freight: false,
            pdi: false,
            admin: false,
            commodity: false,
            accessories: false,
            labour: false,
            painPrem: false,
            licensing: false,
            trailer: false,
            depositMade: false,
            months: false,
            iRate: false,
            on60: false,
            biweekly: false,
            weekly: false,
            qc60: false,
            biweeklyqc: false,
            weeklyqc: false,
            nat60: false,
            biweeklNat: false,
            weeklylNat: false,
            oth60: false,
            biweekOth: false,
            weeklyOth: false,
            nat60WOptions: false,
            desiredPayments: false,
            biweeklNatWOptions: false,
            weeklylNatWOptions: false,
            oth60WOptions: false,
            biweekOthWOptions: false,
            visited: false,
            aptShowed: false,
            bookedApt: false,
            aptNoShowed: false,
            testDrive: false,
            metParts: false,
            refund: false,
            turnOver: false,
            financeApp: false,
            pickUpSet: false,
            demoed: false,
            tradeMake: false,
            tradeYear: false,
            tradeTrim: false,
            tradeColor: false,
            tradeVin: false,
            result: false,
            referral: false,
            metService: false,
            metManager: false,
            timesContacted: false,
            visits: false,
            progress: false,
            metFinance: false,
            metSalesperson: false,
            seenTrade: false,
            tradeRepairs: false,
            tradeValue: false,
            modelCode: false,
            color: false,
            model1: false,
            stockNum: false,
            otherTaxWithOptions: false,
            totalWithOptions: false,
            otherTax: false,
            qcTax: false,
            deposit: false,
            rustProofing: false,
            lifeDisability: false,
            userServicespkg: false,
            userExtWarr: false,
            userGap: false,
            userTireandRim: false,
            userLoanProt: false,
            deliveryCharge: false,
            onTax: false,
            total: false,
            typeOfContact: false,
            contactMethod: false,
            note: false,
        });
    const [rowSelection, setRowSelection] = React.useState({})
    const [showFilter, setShowFilter] = useState(false);
    const [expanded, setExpanded] = React.useState<ExpandedState>({})
    const handleInputChange = (name, checked) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked ? 'on' : 'off',
        }));
    };
    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "firstName",
            header: ({ column }) => {
                //
                return <>
                    <DataTableColumnHeader column={column} title="Finance" />

                </>

            },
            cell: ({ row }) => {
                const data = row.original
                return <div
                    className="bg-transparent flex h-[45px] w-[50px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none">

                    <FinanceModal
                        data={data}
                        selectedRowData={selectedRowData}
                    />

                </div>
            },


        },

        {
            accessorKey: "firstName",
            header: ({ column }) => {
                // <Button  onClick={() => {  handleRowClick(row);  ;   }}> <Landmark /> </Button>
                return <>
                    <DataTableColumnHeader column={column} title="First Name" />

                </>

            },
            cell: ({ row }) => {
                const data = row.original
                //
                return <div
                    className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none">
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
                return <div
                    className="bg-transparent flex w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px]  uppercase leading-none text-[#EEEEEE] outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff] ">
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
                return <div
                    className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
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

                return <div
                    className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff]  ">
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


                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 items-center justify-center px-5  text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff] ">
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
            accessorKey: "lastNote",
            header: ({ column }) => (<DataTableColumnHeader column={column} title="Last Note" />),
            cell: ({ row }) => {
                const data = row.original

                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">
                    <LastNote data={data} />
                </div>
            },
        },
        {
            accessorKey: "sold",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Sold" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[50px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='sold'
                                checked={data.sold === 'on'}
                                onChange={(e) => handleInputChange(data.sold, e.target.checked)}
                            />


                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "deposit",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Deposit" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[50px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='deposit'
                                checked={data.deposit === 'on'}
                                onChange={(e) => handleInputChange(data.deposit, e.target.checked)}
                            />

                        </Flex>
                    </Text>
                </div>
            },
        },

        {
            accessorKey: "approved",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="approved" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[75px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='approved' checked={data.approved === 'on'}
                                onChange={(e) => handleInputChange(data.approved, e.target.checked)} />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "tradeInsp",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="tradeInsp" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='tradeInsp'
                                checked={data.tradeInsp === 'on'}
                                onChange={(e) => handleInputChange(data.tradeInsp, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "signed",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="signed" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[75px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='signed'
                                checked={data.signed === 'on'}
                                onChange={(e) => handleInputChange(data.signed, e.target.checked)} />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "financeApplication",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="financeApplication" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='financeApplication'
                                checked={data.financeApplication === 'on'}
                                onChange={(e) => handleInputChange(data.financeApplication, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "docsSigned",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="docsSigned" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='docsSigned'
                                checked={data.docsSigned === 'on'}
                                onChange={(e) => handleInputChange(data.docsSigned, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "pickUpSet",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="pickUpSet" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='pickUpSet'
                                checked={data.pickUpSet === 'on'}
                                onChange={(e) => handleInputChange(data.pickUpSet, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "licensingSent",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="licensingSent" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='licensingSent'
                                checked={data.licensingSent === 'on'}
                                onChange={(e) => handleInputChange(data.licensingSent, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "liceningDone",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="liceningDone" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='liceningDone'
                                checked={data.liceningDone === 'on'}
                                onChange={(e) => handleInputChange(data.liceningDone, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "lost",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="lost" />
            ),
            cell: ({ row }) => {
                const data = row.original
                return <div className="w-[100px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <Checkbox
                                name='lost'
                                checked={data.lost === 'on'}
                                onChange={(e) => handleInputChange(data.lost, e.target.checked)}
                            />
                        </Flex>
                    </Text>
                </div>
            },
        },
        {
            accessorKey: "deliveredDate",
            cell: ({ row }) => {
                const data = row.original
                //
                return <>
                    <div className='w-[125px] cursor-pointer'>
                        <Text as="label" size="2">
                            <Flex gap="2">
                                <Checkbox
                                    name='deliveredDate'
                                    checked={data.deliveredDate === 'on'}
                                    onChange={(e) => handleInputChange(data.deliveredDate, e.target.checked)}
                                />
                            </Flex>
                        </Text>
                    </div>
                </>
            },
        },
        {
            accessorKey: "delivered",
            cell: ({ row }) => {
                const data = row.original
                //
                return <>
                    <div className='w-[75px] cursor-pointer'>
                        <Text as="label" size="2">
                            <Flex gap="2">
                                <Checkbox
                                    name='delivered'
                                    checked={data.delivered === 'on'}
                                    onChange={(e) => handleInputChange(data.delivered, e.target.checked)}
                                />
                            </Flex>
                        </Text>
                    </div>
                </>
            },
        },
        {
            accessorKey: "tradeDesc",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Trade" />
            ),
            cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("tradeDesc"))}</div>
            },
        },

        {
            accessorKey: "contactTimesByType",
            header: ({ column }) => (<DataTableColumnHeader column={column} title="Contact Times By Type" />),
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
                <DataTableColumnHeader column={column} title="Pick Up Date"
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff] " />
            ),
            cell: ({ row }) => {
                const data = row.original
                if (data.pickUpDate) {
                    const pickupDate = data.pickUpDate
                    return (
                        <div
                            className="bg-transparent :text-[#02a9ff] text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">
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
                <DataTableColumnHeader column={column} title="Last Contacted"
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]" />
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
                        <div
                            className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">
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
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("email"))}</div>
            },

        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <p className="text-center">phone</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("phone"))}</div>
            },

        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <p className="text-center">address</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("address"))}</div>
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
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none active:bg-[#02a9ff] ">
                    {(row.getValue("pickUpTime"))}
                </div>
            },

        },

        {
            accessorKey: "timeToContact",
            header: "model1",
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
        {
            accessorKey: "make",
            header: "make",
        },

        {
            accessorKey: "year",
            header: ({ column }) => (
                <p className="text-center">year</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("year"))}</div>
            },

        },
        {
            accessorKey: "modelName",
            header: ({ column }) => (
                <p className="text-center">modelName</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("modelName"))}</div>
            },

        },
        {
            accessorKey: "model2",
            header: ({ column }) => (
                <p className="text-center">model2</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("model2"))}</div>
            },

        },
        {
            accessorKey: "submodel",
            header: ({ column }) => (
                <p className="text-center">submodel</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("submodel"))}</div>
            },

        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <p className="text-center">price</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("price"))}</div>
            },

        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <p className="text-center">price</p>
            ), cell: ({ row }) => {
                return <div
                    className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff]  focus:outline-none active:bg-[#02a9ff]">{(row.getValue("price"))}</div>
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
    const [filterBy, setFilterBy] = useState('');

    const handleInputChange2 = (name) => {
        setFilterBy(name);
    };

    function MassEmail() {

        return (
            <>

            </>
        )
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const formatMonth = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}`;
    };
    const now = new Date(); // Current date and time
    const formattedDate = formatDate(now);

    //console.log(formattedDate); // Output: "Wed, Nov 02, 2023, 09:05 AM"

    function getToday() {
        const today = new Date();
        today.setDate(today.getDate());
        console.log(formatDate(today), 'today')
        return formatDate(today);
    }

    function getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return formatDate(tomorrow);
    }

    function getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return formatDate(yesterday);
    }

    function getLastDayOfPreviousMonth() {
        const date = new Date();
        date.setDate(1); // sets the day to the last day of the previous month
        return formatMonth(date);
    }

    function getFirstDayOfCurrentMonth() {
        const date = new Date();
        date.setDate(1); // sets the day to the first day of the current month
        return formatDate(date);
    }

    function getFirstDayOfTwoMonthsAgo() {
        const date = new Date();
        date.setMonth(date.getMonth() - 2);
        date.setDate(1); // sets the day to the first day of the month two months ago
        return formatMonth(date);
    }

    function getYear() {
        const today = new Date();
        return today.getFullYear().toString();
    }

    const getThisYear = getYear();


    const [todayfilterBy, setTodayfilterBy] = useState(null);

    const DeliveriesList = [
        {
            key: "todaysDeliveries",
            name: "Deliveries - Today",
        },
        {
            key: "tomorowsDeliveries",
            name: "Deliveries - Tomorrow",
        },
        {
            key: "yestDeliveries",
            name: "Deliveries - Yesterday",
        },
        {
            key: "deliveredThisMonth",
            name: "Delivered - Current Month",
        },
        {
            key: "deliveredLastMonth",
            name: "Delivered - Last Month",
        },
        {
            key: "deliveredThisYear",
            name: "Delivered - Year",
        },
    ];
    const DepositsTakenList = [
        {
            key: "depositsToday",
            name: "Deposit Taken - Need to Finalize Deal",
        },
    ];

    const CallsList = [
        {
            key: "pendingCalls",
            name: "Pending Calls",
        },
        {
            key: "todaysCalls",
            name: "Today's Calls",
        },
        {
            key: "tomorowsCalls",
            name: "Tomorrow's Calls",
        },
        {
            key: "yestCalls",
            name: "Yesterday's if missed",
        },
        {
            key: "missedCalls",
            name: "Missed Calls - Current Month",
        },
        {
            key: "missedCallsLastMonth",
            name: "Missed Calls - Last Month",
        },
        {
            key: "missedCallsTwoMonths",
            name: "Missed Calls - 2 Months Ago",
        },
        {
            key: "missedCallsYear",
            name: "Missed Calls - Year",
        },
    ];


    const handleFilterChange = (selectedFilter) => {
        setAllFilters()
        const customerStateColumn = table.getColumn('customerState');
        const nextAppointmentColumn = table.getColumn('nextAppointment');
        const deliveredDate = table.getColumn('deliveredDate');
        const pickUpDate = table.getColumn('pickUpDate');
        const status = table.getColumn('status');
        const depositMade = table.getColumn('depositMade');
        const sold = table.getColumn('sold')
        const delivered = table.getColumn('delivered')
        const signed = table.getColumn('signed')
        const financeApp = table.getColumn('financeApp')

        if (selectedFilter === "deliveredThisMonth") {
            customerStateColumn?.setFilterValue('delivered');
            deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
            status?.setFilterValue('active');

        }

        if (selectedFilter === "deliveredLastMonth") {
            customerStateColumn?.setFilterValue('delivered');
            deliveredDate?.setFilterValue(getLastDayOfPreviousMonth);
            status?.setFilterValue('active');
        }

        if (selectedFilter === "deliveredThisYear") {
            customerStateColumn?.setFilterValue('delivered');
            deliveredDate?.setFilterValue(getThisYear);
            status?.setFilterValue('active');
        }

        if (selectedFilter === "pendingCalls") {
            customerStateColumn?.setFilterValue('Pending');
            status?.setFilterValue('active');
        }

        if (selectedFilter === "todaysCalls") {
            nextAppointmentColumn?.setFilterValue(getToday);
            console.log(nextAppointmentColumn, 'nextAppointmentColumn')
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "tomorowsCalls") {
            nextAppointmentColumn?.setFilterValue(getTomorrow);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "yestCalls") {
            nextAppointmentColumn?.setFilterValue(getYesterday);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "missedCalls") {
            nextAppointmentColumn?.setFilterValue(getFirstDayOfCurrentMonth);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "missedCallsLastMonth") {
            nextAppointmentColumn?.setFilterValue(getLastDayOfPreviousMonth);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "missedCallsTwoMonths") {
            nextAppointmentColumn?.setFilterValue(getFirstDayOfTwoMonthsAgo);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "missedCallsYear") {
            nextAppointmentColumn?.setFilterValue(getThisYear);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('off');
            sold?.setFilterValue('off');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "todaysDeliveries") {
            pickUpDate?.setFilterValue(getToday);
            status?.setFilterValue('active');
            sold?.setFilterValue('on');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "tomorowsDeliveries") {
            pickUpDate?.setFilterValue(getTomorrow);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('on');
            sold?.setFilterValue('on');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "yestDeliveries") {
            pickUpDate?.setFilterValue(getYesterday);
            status?.setFilterValue('active');
            depositMade?.setFilterValue('on');
            sold?.setFilterValue('on');
            delivered?.setFilterValue('off')
        }

        if (selectedFilter === "depositsToday") {
            status?.setFilterValue('active');
            depositMade?.setFilterValue('on');
            sold?.setFilterValue('on');
            delivered?.setFilterValue('off')
            signed?.setFilterValue('off')
            financeApp?.setFilterValue('off')
        }
    };

    // clears filters
    const setAllFilters = () => {
        setColumnFilters([]);
        setSorting([])
        setFilterBy('')
    };

    // toggle column filters

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };


    const [edit, setEdit] = useState(false);
    const toggleColumns = () => {
        setEdit((prev) => !prev);
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedText(text);
                setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    };
    const [copiedText, setCopiedText] = useState('');

    return (
        <div className="mx-auto w-[95%] justify-center ">

            <>
                <div className='flex '>

                    <Input
                        placeholder={`Search phone # ...`}
                        value={
                            (table.getColumn('phone')?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn('phone')?.setFilterValue(event.target.value)
                        }
                        className=" max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                    />
                    <Select onValueChange={(value) => {
                        const item = CallsList.find(i => i.key === value) || DeliveriesList.find(i => i.key === value) || DepositsTakenList.find(i => i.key === value);
                        if (item) {
                            handleFilterChange(item.key);
                            setTodayfilterBy(item.name);
                        }
                    }}>
                        <SelectTrigger className="w-auto text-[#02a9ff] border-[#02a9ff]  mr-2 ml-2">
                            <SelectValue>{todayfilterBy || "Default Filters"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className='bg-slate1 text-slate12'>
                            {CallsList.map((item) => (
                                <SelectItem value={item.key}>{item.name}</SelectItem>
                            ))}
                            {DeliveriesList.map((item) => (
                                <SelectItem value={item.key}>{item.name}</SelectItem>
                            ))}
                            {DepositsTakenList.map((item) => (
                                <SelectItem value={item.key}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => handleInputChange2(value)}>
                        <SelectTrigger className='text-[#02a9ff] border-[#02a9ff] w-auto  mr-3'>
                            Global Filter
                        </SelectTrigger>
                        <SelectContent align="end" className='bg-slate1 text-slate12 '>
                            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                                <SelectItem key={column.id} value={column.id}
                                    className="bg-[#fff] text-[#000] capitalize cursor-pointer  hover:underline hover:text-[#02a9ff]">
                                    {column.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


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

                    <Button onClick={() => setAllFilters([])} className='bg-[#02a9ff] text-slate1 hover:text-slate1 mr-3'>
                        Clear
                    </Button>
                    <div className="flex" >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <p className="cursor-pointer my-auto mr-5 hover:text-[#02a9ff] ">
                                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="#02a9ff" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </p>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate1">
                                <ScrollArea className="h-[500px] w-[200px] rounded-md  p-4">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="bg-slate1 capitalize  cursor-pointer"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </ScrollArea>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AddCustomer />
                        <Link to='/calendar/sales'>
                            <button className=' p-2 cursor-pointer hover:text-blue-8 justify-center items-center mr-3 border-[#fff]' >
                                <CalendarCheck color="#02a9ff" size={20} strokeWidth={1.5} />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-md border border-[#3b3b3b] mt-2">
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
                                        onClick={() => handleRowClick(row)}
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

        </div >
    )
}

