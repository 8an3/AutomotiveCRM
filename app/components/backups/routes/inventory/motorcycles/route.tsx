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
import EditWishList from '~/components/dashboard/wishlist/WishListEdit';
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { type LinksFunction, type DataFunctionArgs } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

// dashboard
import { DataTable } from "~/components/data-table"
import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import { DocumentInputs } from '~/routes/_authorized/dealer/dashboard.customer.$custId'
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { ListSelection2 } from '../routes/quoteUtils/listSelection'

import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
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
import { model } from "~/models";




export let loader = dashboardLoader

export let action = dashboardAction

export const links: LinksFunction = () => [
    { rel: "icon", type: "image/svg", href: '/dashboard.svg' },
]
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
export default function Mainboard() {
    const [selectedTab, setSelectedTab] = useState("dashboard");
    const { user } = useRootLoaderData();
    //<TabsTrigger onClick={() => setSelectedTab("calendar")} value="calendar">Calendar</TabsTrigger>

    return (
        <>
            <Sidebar />
            <Tabs defaultValue="dashboard" >
                <TabsList className="ml-[19px] grid w-[300px] grid-cols-2 mt-[70px]">
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
                    <TabsTrigger onClick={() => setSelectedTab("search")} value="search">New Inventory</TabsTrigger>
                    <TabsTrigger onClick={() => setSelectedTab("wishList")} value="wishList">Used Inventory</TabsTrigger>

                </TabsList>
                {selectedTab === "dashboard" && (
                    <TabsContent className="w-[98%] mx-auto mt-5" value="dashboard">
                        <MainDashbaord />
                    </TabsContent>
                )}
                {selectedTab === "newLeads" && (
                    <TabsContent className="w-[98%]" value="newLeads">
                        <MainDashbaord />
                    </TabsContent>
                )}

            </Tabs>
        </>
    )
}
async function getData(): Promise<dashBoardType[]> {
    //turn into dynamic route and have them call the right loader like q  uote qand overview
    const res = await fetch('/dashboard/calls/loader')
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}


export function NewInventory() {
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
        accessorKey: "dealNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="Deal Number" />

            </>

        },
        cell: ({ row }) => {
            const data = row.original
            //
            return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-[#02a9ff]  hover:text-[#02a9ff]  focus:text-[#02a9ff] focus:outline-none">
                {(row.getValue("dealNum"))}
            </div>
        },


    },
    {
        accessorKey: "warrantyNum",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="warrantyNum" />
        ),
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent flex w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px]  uppercase leading-none text-[#EEEEEE] outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff]  focus:outline-none  active:bg-[#02a9ff] ">
                <a target="_blank" href={`/customer/${data.id}`} rel="noreferrer">
                    {(row.getValue("warrantyNum"))}
                </a>
            </div>
        },

    },
    {

        accessorKey: "stockNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="stockNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("stockNum"))}

            </div>
        },
    },
    {

        accessorKey: "customerName",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="customerName" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("customerName"))}

            </div>
        },
    },
    {

        accessorKey: "year",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="year" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("year"))}

            </div>
        },
    },
    {

        accessorKey: "make",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="make" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("make"))}

            </div>
        },
    },
    {

        accessorKey: "subModel",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="subModel" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("subModel"))}

            </div>
        },
    },

    {

        accessorKey: "subSubmodel",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="subSubmodel" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("subSubmodel"))}

            </div>
        },
    },
    {

        accessorKey: "amount",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="amount" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("amount"))}

            </div>
        },
    },
    {

        accessorKey: "status",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="status" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("status"))}

            </div>
        },
    },
    {

        accessorKey: "notes",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="notes" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("notes"))}

            </div>
        },
    },
    {

        accessorKey: "exteriorColor",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="exteriorColor" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("exteriorColor"))}

            </div>
        },
    },
    {

        accessorKey: "mileage",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="mileage" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("mileage"))}

            </div>
        },
    },
    {

        accessorKey: "consignment",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="consignment" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("consignment"))}

            </div>
        },
    },
    {

        accessorKey: "onOrder",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="onOrder" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("onOrder"))}

            </div>
        },
    },
    {

        accessorKey: "expectedOn",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="expectedOn" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("maexpectedOnke"))}

            </div>
        },
    },
    {

        accessorKey: "orderStatus",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="orderStatus" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("orderStatus"))}

            </div>
        },
    },
    {

        accessorKey: "hdcFONum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="hdcFONum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("hdcFONum"))}

            </div>
        },
    },
    {

        accessorKey: "hdmcFONum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="hdmcFONum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("hdmcFONum"))}

            </div>
        },
    },
    {

        accessorKey: "vin",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="vin" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("vin"))}

            </div>
        },
    },
    {

        accessorKey: "age",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="age" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("age"))}

            </div>
        },
    },
    {

        accessorKey: "floorPlanDueDate",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="floorPlanDueDate" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("floorPlanDueDate"))}

            </div>
        },
    },
    {

        accessorKey: "location",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="location" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("location"))}

            </div>
        },
    },
    {

        accessorKey: "stocked",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="stocked" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("stocked"))}

            </div>
        },
    },
    {

        accessorKey: "stockedDate",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="stockedDate" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("stockedDate"))}

            </div>
        },
    },
    {

        accessorKey: "isNew",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="isNew" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("isNew"))}

            </div>
        },
    },
    {

        accessorKey: "actualCost",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="actualCost" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("actualCost"))}

            </div>
        },
    },
    {

        accessorKey: "engineNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="engineNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("engineNum"))}

            </div>
        },
    },
    {

        accessorKey: "mfgSerialNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="mfgSerialNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("mfgSerialNum"))}

            </div>
        },
    },
    {

        accessorKey: "engineNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="engineNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("engineNum"))}

            </div>
        },
    },
    {

        accessorKey: "plates",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="plates" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("plates"))}

            </div>
        },
    },
    {

        accessorKey: "keyNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="keyNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("keyNum"))}

            </div>
        },
    },
    {

        accessorKey: "width",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="width" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("width"))}

            </div>
        },
    },
    {

        accessorKey: "engine",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="engine" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("engine"))}

            </div>
        },
    },
    {

        accessorKey: "fuelType",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="fuelType" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("fuelType"))}

            </div>
        },
    },
    {

        accessorKey: "power",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="power" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("power"))}

            </div>
        },
    },
    {

        accessorKey: "chassisNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="chassisNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("chassisNum"))}

            </div>
        },
    },
    {

        accessorKey: "chassisYear",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="chassisYear" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("chassisYear"))}

            </div>
        },
    },
    {

        accessorKey: "chassisMake",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="chassisMake" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("chassisMake"))}

            </div>
        },
    },
    {

        accessorKey: "chassisModel",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="chassisModel" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("chassisModel"))}

            </div>
        },
    },
    {

        accessorKey: "chassisType",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="chassisType" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("chassisType"))}

            </div>
        },
    },
    {

        accessorKey: "registrationState",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="registrationState" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("registrationState"))}

            </div>
        },
    },
    {

        accessorKey: "registrationExpiry",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="registrationExpiry" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("registrationExpiry"))}

            </div>
        },
    },
    {

        accessorKey: "grossWeight",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="grossWeight" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("grossWeight"))}

            </div>
        },
    },
    {

        accessorKey: "netWeight",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="netWeight" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("netWeight"))}

            </div>
        },
    },
    {

        accessorKey: "insuranceCompany",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="insuranceCompany" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("insuranceCompany"))}

            </div>
        },
    },
    {

        accessorKey: "policyNum",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="policyNum" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("policyNum"))}

            </div>
        },
    },
    {

        accessorKey: "insuranceAgent",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="insuranceAgent" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("insuranceAgent"))}

            </div>
        },
    },
    {

        accessorKey: "insuranceStartDate",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="insuranceStartDate" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("insuranceStartDate"))}

            </div>
        },
    },
    {

        accessorKey: "insuranceEndDate",
        header: ({ column }) => {
            return <>
                <DataTableColumnHeader column={column} title="insuranceEndDate" />
            </>
        },
        cell: ({ row }) => {
            const data = row.original
            return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-[#02a9ff] hover:text-[#02a9ff] focus:text-[#02a9ff] focus:outline-none  active:bg-[#02a9ff]">
                {(row.getValue("insuranceEndDate"))}

            </div>
        },
    },






]
