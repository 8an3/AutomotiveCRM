import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/index";
import * as React from "react"
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { Checkbox } from "~/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { useEffect, useState } from "react";
import {
    type RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'
import { Form, useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { type MetaFunction, redirect, type LoaderFunctionArgs, json } from '@remix-run/node'
import { GetUser } from "~/utils/loader.server";

export const loader = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")


    const user = await GetUser(email)

    /// console.log(user, account, 'wquiote loadert')
    const notifications = await prisma.notificationsUser.findMany({
        where: {
            userId: user.id,
        }
    })
    if (!user) {
        redirect('/login')
    }
    return json({ user, notifications });
}

const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@yahoo.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@gmail.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@gmail.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@gmail.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@hotmail.com",
    },
]
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
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
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
        header: "id",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "stockNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock #
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("stockNumber")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "year",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Year
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("year")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "make",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Make
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("make")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "model",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Model
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("model")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "modelName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Model Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("modelName")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "model2",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Model Name 2
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("model2")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "submodel",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sub Model
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("submodel")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "exteriorColor",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ext Color
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("exteriorColor")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "mileage",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Mileage
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("mileage")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "consignment",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Consignment
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("consignment")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "onOrder",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    On Order
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("onOrder")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "expectedOn",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Expected On
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("expectedOn")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("status")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "orderStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Order Status
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("orderStatus")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "vin",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    VIN
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("vin")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "age",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Age
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("age")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "floorPlanDueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Floor Plan Due Date
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("floorPlanDueDate")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("location")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "isNew",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    New?
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("isNew")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "keyNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Key Number
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("keyNumber")}</div>,
    },
    {
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        accessorKey: "sold",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sold
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("sold")}</div>,
    },



    {
        accessorKey: "packageNumber",
        header: "packageNumber",
    },
    {
        accessorKey: "packagePrice",
        header: "packagePrice",
    },
    {
        accessorKey: "type",
        header: "type",
    },
    {
        accessorKey: "class",
        header: "class",
    },
    {
        accessorKey: "hdcFONumber",
        header: "hdcFONumber",
    },
    {
        accessorKey: "hdmcFONumber",
        header: "hdmcFONumber",
    },
    {
        accessorKey: "stocked",
        header: "stocked",
    },
    {
        accessorKey: "stockedDate",
        header: "stockedDate",
    },
    {
        accessorKey: "isNew",
        header: "isNew",
    },
    {
        accessorKey: "mfgSerialNumber",
        header: "mfgSerialNumber",
    },
    {
        accessorKey: "actualCost",
        header: "actualCost",
    },
    {
        accessorKey: "engineNumber",
        header: "engineNumber",
    },
    {
        accessorKey: "plates",
        header: "plates",
    },

    {
        accessorKey: "width",
        header: "width",
    },
    {
        accessorKey: "engine",
        header: "engine",
    },
    {
        accessorKey: "fuelType",
        header: "fuelType",
    },
    {
        accessorKey: "power",
        header: "power",
    },
    {
        accessorKey: "chassisNumber",
        header: "chassisNumber",
    },
    {
        accessorKey: "chassisYear",
        header: "chassisYear",
    },
    {
        accessorKey: "chassisMake",
        header: "chassisMake",
    },
    {
        accessorKey: "chassisModel",
        header: "chassisModel",
    },
    {
        accessorKey: "fuelType",
        header: "fuelType",
    },
    {
        accessorKey: "chassisType",
        header: "chassisType",
    },
    {
        accessorKey: "registrationState",
        header: "registrationState",
    },
    {
        accessorKey: "registrationExpiry",
        header: "registrationExpiry",
    },
    {
        accessorKey: "netWeight",
        header: "netWeight",
    },
    {
        accessorKey: "grossWeight",
        header: "grossWeight",
    },
    {
        accessorKey: "insuranceCompany",
        header: "insuranceCompany",
    },
    {
        accessorKey: "policyNumber",
        header: "policyNumber",
    },
    {
        accessorKey: "insuranceStartDate",
        header: "insuranceStartDate",
    },
    {
        accessorKey: "insuranceAgent",
        header: "insuranceAgent",
    },
    {
        accessorKey: "insuranceEndDate",
        header: "insuranceEndDate",
    },
]
declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}
export default function Mainboard() {
    const [selectedTab, setSelectedTab] = useState("dashboard");
    /** <TabsList className="ml-[19px] grid w-[600px] grid-cols-4 mt-[70px]">
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("dashboard")
                    }}
                        value="dashboard">Inventory</TabsTrigger>
                    <TabsTrigger onClick={() => {
                        setSelectedTab("null")
                        setSelectedTab("newLeads")
                    }}
                        value="newLeads">Sold</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("search")} value="search">New</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("wishList")} value="wishList">Used</TabsTrigger>

                </TabsList> */

    return (
        <>


            <Tabs defaultValue="dashboard" className='mt-10'>

                <TabsContent className="w-[98%] mx-auto" value="dashboard">
                    <InventoryMoto />
                </TabsContent>
                {selectedTab === "newLeads" && (
                    <TabsContent className="w-[98%]" value="newLeads">
                        <InventoryMoto />
                    </TabsContent>
                )}
                {selectedTab === "search" && (
                    <TabsContent className="w-[98%]" value="search">
                        <InventoryMoto />
                    </TabsContent>
                )}
                {selectedTab === "wishList" && (
                    <TabsContent className="w-[98%]" value="wishList">
                        <InventoryMoto />
                    </TabsContent>
                )}
            </Tabs>
        </>
    )
}
async function getData() {
    const res = await fetch('/dashboard/inventory/moto')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
export function InventoryMoto() {
    const [data, setPaymentData,] = useState([]);
    useEffect(() => {
        const data = async () => {
            const result = await getData();
            setPaymentData(result);
        };
        data()
    }, []);

    //  console.log(data, 'data')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            id: false,
            packageNumber: false,
            packagePrice: false,
            type: false,
            class: false,
            hdcFONumber: false,
            hdmcFONumber: false,
            stocked: false,
            stockedDate: false,
            isNew: false,
            mfgSerialNumber: false,
            actualCost: false,
            engineNumber: false,
            plates: false,
            length: false,
            width: false,
            engine: false,
            fuelType: false,
            power: false,
            chassisNumber: false,
            chassisYear: false,
            chassisMake: false,
            chassisModel: false,
            chassisType: false,
            registrationState: false,
            registrationExpiry: false,
            netWeight: false,
            grossWeight: false,
            insuranceCompany: false,
            policyNumber: false,
            insuranceStartDate: false,
            insuranceAgent: false,
            insuranceEndDate: false,
            model2: false,
            consignment: false,
        })
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [filterBy, setFilterBy] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    // console.log(selectedRowData, 'selectedRowData')
    const handleRowClick = (row) => {
        setSelectedRowData(row);
        setIsModalOpen(true);
        setOpen(true)
    };
    const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        globalFilterFn: fuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,

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
            globalFilter,

        },
    })

    const setAllFilters = () => {
        setColumnFilters([]);
        setSorting([])
        setFilterBy('')
        setGlobalFilter('')
    };

    /**  <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="ml-2 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
                    placeholder="Search all columns..."
                /> */
    function ClientDetailsFunction() {
        // split into groups unit, sold info, other info, and so on
        const ClientDetails = [
            { name: "stockNumber", value: selectedRowData?.original.stockNumber, placeHolder: "stockNumber" },
            { name: "year", value: selectedRowData?.original.year, placeHolder: "year" },
            { name: "make", value: selectedRowData?.original.make, placeHolder: "make" },
            { name: "model", value: selectedRowData?.original.model, placeHolder: "model" },
            { name: "modelName", value: selectedRowData?.original.modelName, placeHolder: "modelName" },
            { name: "model2", value: selectedRowData?.original.model2, placeHolder: "model2" },
            { name: "submodel", value: selectedRowData?.original.submodel, placeHolder: "submodel" },
            { name: "price", value: selectedRowData?.original.price, placeHolder: "price" },
            { name: "exteriorColor", value: selectedRowData?.original.exteriorColor, placeHolder: "exteriorColor" },
            { name: "mileage", value: selectedRowData?.original.mileage, placeHolder: "mileage" },
            { name: "onOrder", value: selectedRowData?.original.onOrder, placeHolder: "onOrder" },
            { name: "expectedOn", value: selectedRowData?.original.expectedOn, placeHolder: "expectedOn" },
            { name: "status", value: selectedRowData?.original.status, placeHolder: "status" },
            { name: "orderStatus", value: selectedRowData?.original.orderStatus, placeHolder: "orderStatus" },
            { name: "vin", value: selectedRowData?.original.vin, placeHolder: "vin" },
            { name: "age", value: selectedRowData?.original.age, placeHolder: "age" },
            { name: "location", value: selectedRowData?.original.location, placeHolder: "location" },
            { name: "isNew", value: selectedRowData?.original.isNew, placeHolder: "isNew" },
            { name: "keyNumber", value: selectedRowData?.original.keyNumber, placeHolder: "keyNumber" },
            { name: "sold", value: selectedRowData?.original.sold, placeHolder: "sold" },
        ];
        return ClientDetails;
    }
    function ClientDetailsFunction2() {
        // split into groups unit, sold info, other info, and so on
        const ClientDetails = [
            { name: "floorPlanDueDate", value: selectedRowData?.original.floorPlanDueDate, placeHolder: "floorPlanDueDate" },
            { name: "packageNumber", value: selectedRowData?.original.packageNumber, placeHolder: "packageNumber" },
            { name: "packagePrice", value: selectedRowData?.original.packagePrice, placeHolder: "packagePrice" },
            { name: "type", value: selectedRowData?.original.type, placeHolder: "type" },
            { name: "class", value: selectedRowData?.original.class, placeHolder: "class" },
            { name: "hdcFONumber", value: selectedRowData?.original.hdcFONumber, placeHolder: "hdcFONumber" },
            { name: "consignment", value: selectedRowData?.original.consignment, placeHolder: "consignment" },
            { name: "hdmcFONumber", value: selectedRowData?.original.hdmcFONumber, placeHolder: "hdmcFONumber" },
            { name: "stocked", value: selectedRowData?.original.stocked, placeHolder: "stocked" },
            { name: "stockedDate", value: selectedRowData?.original.stockedDate, placeHolder: "stockedDate" },
            { name: "mfgSerialNumber", value: selectedRowData?.original.mfgSerialNumber, placeHolder: "mfgSerialNumber" },
            { name: "actualCost", value: selectedRowData?.original.actualCost, placeHolder: "actualCost" },
            { name: "plates", value: selectedRowData?.original.plates, placeHolder: "plates" },
            { name: "width", value: selectedRowData?.original.width, placeHolder: "width" },
            { name: "engine", value: selectedRowData?.original.engine, placeHolder: "engine" },
            { name: "fuelType", value: selectedRowData?.original.fuelType, placeHolder: "fuelType" },
        ];
        return ClientDetails;
    }

    function ClientDetailsFunction3() {
        // split into groups unit, sold info, other info, and so on
        const ClientDetails = [
            { name: "power", value: selectedRowData?.original.power, placeHolder: "power" },
            { name: "chassisNumber", value: selectedRowData?.original.chassisNumber, placeHolder: "chassisNumber" },
            { name: "engineNumber", value: selectedRowData?.original.engineNumber, placeHolder: "engineNumber" },
            { name: "chassisYear", value: selectedRowData?.original.chassisYear, placeHolder: "chassisYear" },
            { name: "chassisMake", value: selectedRowData?.original.chassisMake, placeHolder: "chassisMake" },
            { name: "chassisModel", value: selectedRowData?.original.chassisModel, placeHolder: "chassisModel" },
            { name: "registrationState", value: selectedRowData?.original.registrationState, placeHolder: "registrationState" },
            { name: "chassisType", value: selectedRowData?.original.chassisType, placeHolder: "chassisType" },
            { name: "registrationExpiry", value: selectedRowData?.original.registrationExpiry, placeHolder: "registrationExpiry" },
            { name: "netWeight", value: selectedRowData?.original.netWeight, placeHolder: "netWeight" },
            { name: "grossWeight", value: selectedRowData?.original.grossWeight, placeHolder: "grossWeight" },
            { name: "insuranceCompany", value: selectedRowData?.original.insuranceCompany, placeHolder: "insuranceCompany" },
            { name: "policyNumber", value: selectedRowData?.original.policyNumber, placeHolder: "policyNumber" },
            { name: "insuranceStartDate", value: selectedRowData?.original.insuranceStartDate, placeHolder: "insuranceStartDate" },
            { name: "insuranceAgent", value: selectedRowData?.original.insuranceAgent, placeHolder: "insuranceAgent" },
            { name: "insuranceEndDate", value: selectedRowData?.original.insuranceEndDate, placeHolder: "insuranceEndDate" },
        ];
        return ClientDetails;
    }
    function ClientDetailsFunction4() {
        // split into groups unit, sold info, other info, and so on
        const ClientDetails = [
            { name: "dealNum", value: selectedRowData?.original.dealNum, placeHolder: "dealNum" },
            { name: "customerName", value: selectedRowData?.original.customerName, placeHolder: "customerName" },
            { name: "customerPhone", value: selectedRowData?.original.customerPhone, placeHolder: "customerPhone" },
            { name: "customerAddress", value: selectedRowData?.original.customerAddress, placeHolder: "customerAddress" },
            { name: "deliveredDate", value: selectedRowData?.original.deliveredDate, placeHolder: "deliveredDate" },
        ];
        return ClientDetails;
    }

    const DeliveriesList = [
        {
            key: "allInventory",
            name: "Inventory",
        },
        {
            key: "Sold",
            name: "Sold",
        },
        {
            key: "NewUnits",
            name: "New",
        },
        {
            key: "UsedUnits",
            name: "Used",
        },

    ];
    const handleFilterChange = (selectedFilter) => {
        setAllFilters()
        const newColumn = table.getColumn('isNew');
        const status = table.getColumn('status');

        if (selectedFilter === "Sold") {
            status?.setFilterValue('reserved');
        }
        if (selectedFilter === "NewUnits") {
            newColumn?.setFilterValue(true);
        }
        if (selectedFilter === "UsedUnits") {
            newColumn?.setFilterValue(false);
        }
    }
    const [todayfilterBy, setTodayfilterBy] = useState(null);
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
        <div className="w-full">
            <div className="flex items-center ">


                <Input
                    value={globalFilter ?? ''}
                    onChange={event => setGlobalFilter(event.target.value)}
                    className="font-lg border-block w-[400px] border border-[#878787] bg-[#121212] p-2 text-white shadow"
                    placeholder="Search all columns..."
                />
                <Select
                    className='text-white border-white focus:border-[#02a9ff] ml-2'
                    onValueChange={(value) => {
                        const item = DeliveriesList.find((i) => i.key === value);

                        if (item) {
                            handleFilterChange(item.key);
                            setTodayfilterBy(item.name);
                        }
                    }}
                >
                    <SelectTrigger className="w-auto text-white border-white focus:border-[#02a9ff]  ml-2">
                        <SelectValue>{todayfilterBy || "Default Filters"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-white text-black'>
                        {DeliveriesList.map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>



                <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-slate12 px-4 py-3  text-center text-xs  font-bold uppercase text-slate1 shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
                >
                    Clear
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-2 text-white border-white">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-white text-black'>
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
            <div className="rounded-md border border-[#3b3b3b] mt-5 ">
                <Table className='w-full overflow-x-auto border-[#3b3b3b] text-slate1'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className=' border-[#3b3b3b]'
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className='items-center ' key={header.id}>
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className='cursor-pointer border-[#3b3b3b] bg-slate12 p-4 capitalize text-slate1 hover:text-[#02a9ff]'
                                    onClick={() => handleRowClick(row)}

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
                                    className="h-24 cursor-pointer bg-slate12 text-center capitalize text-slate1 hover:text-[#02a9ff]"

                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {isModalOpen && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[925px] bg-white">
                        <Form
                        //onSubmit={(event) => {
                        //   wait().then(() => setOpen(false));
                        //    event.preventDefault();
                        //  }}
                        >

                            <div className=" gap-4 py-4">
                                <Tabs defaultValue="dashboard" className=''>
                                    <TabsList className="grid w-[600px] grid-cols-4">
                                        <TabsTrigger value="dashboard">Unit2</TabsTrigger>
                                        <TabsTrigger value="newLeads">Other Info</TabsTrigger>
                                        <TabsTrigger value="search">Other Info Con.</TabsTrigger>
                                        <TabsTrigger value="wishList">Customer Info</TabsTrigger>
                                    </TabsList>
                                    <TabsContent className="w-[98%] mx-auto " value="dashboard">
                                        {edit ? (
                                            <>
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[98%]'>

                                                    {ClientDetailsFunction().map((fee, index) => (
                                                        <div key={index} className="w-full max-w-sm items-center gap-1.5">
                                                            <Label htmlFor="email">{fee.placeHolder}</Label>
                                                            <Input
                                                                name={fee.name}
                                                                defaultValue={fee.value}

                                                                className='mt-2 h-8 text-black bg-white border-black focus:border-[#02a9ff]'
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <div className='grid grid-cols-1 md:grid-cols-2 justify-between gap-4 w-[98%]'>

                                                {ClientDetailsFunction().map((fee, index) => (
                                                    <div key={index} className="w-full grid grid-cols-2 justify-between max-w-sm items-center gap-1.5">

                                                        <p>{fee.placeHolder}</p>
                                                        {fee.value ? (
                                                            <p onClick={() => copyText(fee.value)} className='text-right cursor-pointer'>{fee.value}</p>
                                                        ) : (
                                                            <p className='text-right'>N/A</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        )}

                                    </TabsContent>
                                    <TabsContent className="w-[98%]" value="newLeads">
                                        {edit ? (
                                            <>
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[98%]'>

                                                    {ClientDetailsFunction().map((fee, index) => (
                                                        <div key={index} className="w-full max-w-sm items-center gap-1.5">
                                                            <Label htmlFor="email">{fee.placeHolder}</Label>
                                                            <Input
                                                                name={fee.name}
                                                                defaultValue={fee.value}

                                                                className='mt-2 h-8 text-black bg-white border-black focus:border-[#02a9ff]'
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <div className='grid grid-cols-1 md:grid-cols-2 justify-between gap-4 w-[98%]'>

                                                {ClientDetailsFunction().map((fee, index) => (
                                                    <div key={index} className="w-full grid grid-cols-2 justify-between max-w-sm items-center gap-1.5">

                                                        <p>{fee.placeHolder}</p>
                                                        {fee.value ? (
                                                            <p className='text-right'>{fee.value}</p>
                                                        ) : (
                                                            <p className='text-right'>N/A</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        )}


                                    </TabsContent>
                                    <TabsContent className="w-[98%]" value="search">
                                        {edit ? (
                                            <>
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[98%]'>

                                                    {ClientDetailsFunction3().map((fee, index) => (
                                                        <div key={index} className="w-full max-w-sm items-center gap-1.5">
                                                            <Label htmlFor="email">{fee.placeHolder}</Label>
                                                            <Input
                                                                name={fee.name}
                                                                defaultValue={fee.value}

                                                                className='mt-2 h-8 text-black bg-white border-black focus:border-[#02a9ff]'
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <div className='grid grid-cols-1 md:grid-cols-2 justify-between gap-4 w-[98%]'>

                                                {ClientDetailsFunction3().map((fee, index) => (
                                                    <div key={index} className="w-full grid grid-cols-2 justify-between max-w-sm items-center gap-1.5">

                                                        <p>{fee.placeHolder}</p>
                                                        {fee.value ? (
                                                            <p className='text-right'>{fee.value}</p>
                                                        ) : (
                                                            <p className='text-right'>N/A</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        )}


                                    </TabsContent>
                                    <TabsContent className="w-[98%]" value="wishList">
                                        {edit ? (
                                            <>
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[98%]'>

                                                    {ClientDetailsFunction4().map((fee, index) => (
                                                        <div key={index} className="w-full max-w-sm items-center gap-1.5">
                                                            <Label htmlFor="email">{fee.placeHolder}</Label>
                                                            <Input
                                                                name={fee.name}
                                                                defaultValue={fee.value}

                                                                className='mt-2 h-8 text-black bg-white border-black focus:border-[#02a9ff]'
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <div className='grid grid-cols-1 md:grid-cols-2 justify-between gap-4 w-[98%]'>

                                                {ClientDetailsFunction4().map((fee, index) => (
                                                    <div key={index} className="w-full grid grid-cols-2 justify-between max-w-sm items-center gap-1.5">

                                                        <p>{fee.placeHolder}</p>
                                                        {fee.value ? (
                                                            <p className='text-right'>{fee.value}</p>
                                                        ) : (
                                                            <p className='text-right'>N/A</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        )}


                                    </TabsContent>
                                </Tabs>
                                <Button variant='outline' onClick={toggleColumns} className='mt-4'>Edit</Button>

                            </div>

                        </Form>
                    </DialogContent>
                </Dialog>
            )}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-white">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white"

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
export const meta: MetaFunction = () => {
    return [
        { title: 'Motorcycle Inventory - Dealer Sales Assistant' },
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
