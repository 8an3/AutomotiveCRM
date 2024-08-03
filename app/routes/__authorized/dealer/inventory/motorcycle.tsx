import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/index";
import * as React from "react"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns, } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
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
import { Form, useLoaderData, useSubmit, useFetcher } from "@remix-run/react";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { type MetaFunction, redirect, type LoaderFunctionArgs, json, ActionFunction } from '@remix-run/node'
import { GetUser } from "~/utils/loader.server";
import { fuzzyFilter, fuzzySort, TableMeta, getTableMeta, DebouncedInput } from "~/components/actions/shared";
import { Cross2Icon, CaretSortIcon, CalendarIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import IndeterminateCheckbox, { EditableText, Filter } from '~/components/actions/shared'
import { X } from "lucide-react";
import { toast } from "sonner";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import UnitDialog from '~/components/dashboard/inventory/diaolog'

export const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className='border-primary mx-auto'
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className='border-primary mx-auto'
                />
            </div>
        ),
    },
    {
        accessorKey: "id",
        header: "id",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "unitInfo",
        cell: ({ row, column: { id } }) => {
            const data = row.original
            return (
                <UnitDialog data={data} />
            )
        },
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    },
    {
        accessorKey: "stockNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className='mx-auto justify-center'
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock #
                    <CaretSortIcon className="ml-2 h-4 w-4 " />
                </Button>
            )
        },
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
    },
    {
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
        accessorKey: "year",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className='mx-auto'

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Year
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },

    },
    {
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
        accessorKey: "make",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className=''

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Make
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
        sortingFn: fuzzySort,
        accessorKey: "subSubmodel",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sub SuB Model
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            )
        },

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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


    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        filterFn: fuzzyFilter,
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

    },
    {
        accessorKey: "packageNumber",
        header: "Package Number",
        id: 'packageNumber',
        footer: props => props.column.id,
    },
    {
        accessorKey: "packagePrice",
        header: "Package Price",

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
        header: "Stocked",
        id: 'stocked',
        cell: info => info.getValue(),
        footer: props => props.column.id,

    },
    {
        accessorKey: "stockedDate",
        header: "Stocked Date",
        id: 'stockedDate',
        cell: info => info.getValue(),
        footer: props => props.column.id,

    },
    {
        accessorKey: "isNew",
        header: "Is New",
        id: 'isNew',
        cell: info => info.getValue(),
        footer: props => props.column.id,

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
    {
        accessorKey: "length",
        header: "length",
    },

]

// Give our default column cell renderer editing superpowers!
export const defaultColumn = {
    cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
            <EditableText
                value={row.getValue(id)}
                fieldName="name"
                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
                buttonClassName="text-center py-1 px-2 text-foreground"
                buttonLabel={`Edit "${id}"`}
                inputLabel={`Edit "${id}"`}
            >
                <input type="hidden" name="intent" value='updateDefaultColumn' />
                <input type="hidden" name="id" value={data.id} />
                <input type="hidden" name="colName" value={id} />
            </EditableText>
        )
    },
}

export const loader = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const email = session.get("email")
    const user = await GetUser(email)
    const inventoryMotorcycle = await prisma.inventoryMotorcycle.findMany()

    if (!user) { redirect('/login') }
    return json({ user, inventoryMotorcycle });
}
export const action: ActionFunction = async ({ request, params }) => {
    const formPayload = Object.fromEntries(await request.formData());
    let formData = financeFormSchema.parse(formPayload)
    const userSession = await getSession(request.headers.get("Cookie"));
    if (!userSession) { return json({ status: 302, redirect: 'login' }); };
    const email = userSession.get("email");
    const user = await GetUser(email)
    const intent = formData.intent

    if (intent === 'updateUnit') {
        const update = await prisma.InventoryMotorcycle.update({
            where: { id: data.id },
            data: {
                packageNumber: formData.packageNumber,
                packagePrice: formData.packagePrice,
                stockNumber: formData.stockNumber,
                type: formData.type,
                class: formData.class,
                year: formData.year,
                make: formData.make,
                model: formData.model,
                modelName: formData.modelName,
                submodel: formData.submodel,
                subSubmodel: formData.subSubmodel,
                price: formData.price,
                exteriorColor: formData.exteriorColor,
                mileage: formData.mileage,
                consignment: formData.consignment,
                onOrder: formData.onOrder,
                expectedOn: formData.expectedOn,
                status: formData.status,
                orderStatus: formData.orderStatus,
                hdcFONumber: formData.hdcFONumber,
                hdmcFONumber: formData.hdmcFONumber,
                vin: formData.vin,
                age: formData.age,
                floorPlanDueDate: formData.floorPlanDueDate,
                location: formData.location,
                stocked: formData.stocked,
                stockedDate: formData.stockedDate,
                isNew: formData.isNew,
                actualCost: formData.actualCost,
                mfgSerialNumber: formData.mfgSerialNumber,
                engineNumber: formData.engineNumber,
                plates: formData.plates,
                keyNumber: formData.keyNumber,
                length: formData.length,
                width: formData.width,
                engine: formData.engine,
                fuelType: formData.fuelType,
                power: formData.power,
                chassisNumber: formData.chassisNumber,
                chassisYear: formData.chassisYear,
                chassisMake: formData.chassisMake,
                chassisModel: formData.chassisModel,
                chassisType: formData.chassisType,
                registrationState: formData.registrationState,
                registrationExpiry: formData.registrationExpiry,
                grossWeight: formData.grossWeight,
                netWeight: formData.netWeight,
                insuranceCompany: formData.insuranceCompany,
                policyNumber: formData.policyNumber,
                insuranceAgent: formData.insuranceAgent,
                insuranceStartDate: formData.insuranceStartDate,
                insuranceEndDate: formData.insuranceEndDate,
                sold: formData.sold,
            }
        })
        return json({ update })
    }
    return json({ message: 'Invalid intent' }, { status: 400 });
}

export default function UnitInv() {
    const { inventoryMotorcycle, user } = useLoaderData()
    const [data, setPaymentData,] = useState(inventoryMotorcycle);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        packageNumber: false,
        packagePrice: false,
        type: false,
        class: false,
        hdcFONumber: false,
        hdmcFONumber: false,
        //stocked: false,
        //stockedDate: false,
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
    });
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedModel, setSelectedModel] = useState({})
    const [filterBy, setFilterBy] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedGlobal, setSelectedGlobal] = useState(false);
    const [todayfilterBy, setTodayfilterBy] = useState(null);

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        filterFns: { fuzzy: fuzzyFilter, },
        globalFilterFn: 'fuzzy',

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        onGlobalFilterChange: setGlobalFilter,
        enableRowSelection: true,
    });

    // -------- my components --------  //
    const submit = useSubmit();
    const fetcher = useFetcher();

    // clears filters
    const setAllFilters = () => {
        setColumnFilters([]);
        setSorting([]);
        setFilterBy("");
        setGlobalFilter([]);
    };
    const toggleFilter = () => {
        setAllFilters()
        setShowFilter(!showFilter);
    };
    const setColumnFilterDropdown = (event) => {
        const columnId = event.target.getAttribute("data-value");
        setSelectedColumn(columnId);
        console.log("Selected column:", columnId);
        // Add your logic here to handle the column selection
    };
    const handleGlobalChange = (value) => {
        console.log("value", value);
        table.getColumn(selectedColumn)?.setFilterValue(value);
    };

    const CallsList = [
        {
            key: "inStock",
            name: "In Stock",
        },
        {
            key: "inStockArrived",
            name: "In Stock and Available",
        },
        {
            key: "newStock",
            name: "New Stock",
        },
        {
            key: "usedStock",
            name: "Used Stock",
        },
        {
            key: "sold",
            name: "Sold",
        },
        {
            key: "otd",
            name: "Out The Door",
        },
        {
            key: "deposits",
            name: "Sold Units - Waiting To Be Picked Up",
        },
    ];
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

        switch (selectedFilter) {
            case 'inStock':
                table.getColumn('status')?.setFilterValue('available');
                break;
            case 'inStockArrived':
                table.getColumn('status')?.setFilterValue('available');
                table.getColumn('orderStatus')?.setFilterValue('STOCK');
                break;
            case 'newStock':
                table.getColumn('new')?.setFilterValue(true);
                break;
            case 'usedStock':
                table.getColumn('new')?.setFilterValue(false);
                break;
            case 'sold':
                table.getColumn('status')?.setFilterValue('reserved');
                break;
            case 'otd':
                table.getColumn('status')?.setFilterValue('sold');
                break;
            case 'deposits':
                table.getColumn('status')?.setFilterValue('reserved');
                break;
            case 'customerOrders':
                table.getColumn('orderStatus')?.setFilterValue('WISH');
                break;
            case 'deliveredThisMonth':
                customerStateColumn?.setFilterValue('delivered');
                deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
                status?.setFilterValue('active');
                break;
            case 'todaysDeliveries':
                pickUpDate?.setFilterValue(getToday);
                status?.setFilterValue('active');
                sold?.setFilterValue(sold && sold.length > 3);
                delivered?.setFilterValue(null)
                break;
            case 'tomorowsDeliveries':
                pickUpDate?.setFilterValue(getTomorrow);
                status?.setFilterValue('active');
                depositMade?.setFilterValue(depositMade && depositMade.length > 3);
                sold?.setFilterValue(sold && sold.length > 3);
                delivered?.setFilterValue(null)
                break;
            case 'yestDeliveries':
                pickUpDate?.setFilterValue(getYesterday);
                status?.setFilterValue('active');
                depositMade?.setFilterValue(depositMade && depositMade.length > 3);
                sold?.setFilterValue(sold && sold.length > 3);
                delivered?.setFilterValue(null)
                break;

            case 'deliveredThisYear':
                customerStateColumn?.setFilterValue('delivered');
                deliveredDate?.setFilterValue(getThisYear);
                status?.setFilterValue('active');
                break;
            case 'depositsToday':
                status?.setFilterValue('active');
                depositMade?.setFilterValue('on');
                sold?.setFilterValue('on');
                delivered?.setFilterValue('off')
                signed?.setFilterValue('off')
                financeApp?.setFilterValue('off')
                break;


            default:
                null;
        }
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

    return (
        <div className="w-[95%] mt-[35px] mx-auto">
            <div className="flex items-center py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" >Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border border-border bg-background text-foreground">
                        <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() => setSelectedGlobal(true)}
                            >
                                Global Filter
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer">
                                    Default Filters
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                                        <DropdownMenuLabel>
                                            {todayfilterBy || "Default Filters"}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {CallsList.map((item) => (
                                            <DropdownMenuItem
                                                onSelect={(event) => {
                                                    const value =
                                                        event.currentTarget.getAttribute("data-value");
                                                    const item =
                                                        CallsList.find((i) => i.key === value) ||
                                                        DeliveriesList.find((i) => i.key === value) ||
                                                        DepositsTakenList.find((i) => i.key === value);
                                                    if (item) {
                                                        handleFilterChange(item.key);
                                                        setTodayfilterBy(item.name);
                                                    }
                                                }}
                                                data-value={item.key}
                                                textValue={item.key}
                                            >
                                                {item.name}
                                            </DropdownMenuItem>
                                        ))}
                                        {CallsList.map((item) => (
                                            <DropdownMenuItem
                                                onSelect={(event) => {
                                                    const value =
                                                        event.currentTarget.getAttribute("data-value");
                                                    const item =
                                                        CallsList.find((i) => i.key === value) ||
                                                        DeliveriesList.find((i) => i.key === value) ||
                                                        DepositsTakenList.find((i) => i.key === value);
                                                    if (item) {
                                                        handleFilterChange(item.key);
                                                        setTodayfilterBy(item.name);
                                                    }
                                                }}
                                                data-value={item.key}
                                                textValue={item.key}
                                            >
                                                {item.name}
                                            </DropdownMenuItem>
                                        ))}
                                        {CallsList.map((item) => (
                                            <DropdownMenuItem
                                                onSelect={(event) => {
                                                    const value =
                                                        event.currentTarget.getAttribute("data-value");
                                                    const item =
                                                        CallsList.find((i) => i.key === value) ||
                                                        DeliveriesList.find((i) => i.key === value) ||
                                                        DepositsTakenList.find((i) => i.key === value);
                                                    if (item) {
                                                        handleFilterChange(item.key);
                                                        setTodayfilterBy(item.name);
                                                    }
                                                }}
                                                data-value={item.key}
                                                textValue={item.key}
                                            >
                                                {item.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer">
                                    Global Filters
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => (
                                                <DropdownMenuItem
                                                    onSelect={(event) => {
                                                        setColumnFilterDropdown(event);
                                                    }}
                                                    data-value={column.id}
                                                    key={column.id}
                                                    className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline"
                                                >
                                                    {column.id}
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() => {
                                    setAllFilters([]);
                                    setSelectedGlobal(false);
                                }}
                            >
                                Clear
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={toggleFilter}
                            >
                                Toggle All Columns
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer">
                                    Column Toggle
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="cursor-pointer bg-background  capitalize text-foreground"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(value) =>
                                                            column.toggleVisibility(!!value)
                                                        }
                                                    >
                                                        {column.id}
                                                    </DropdownMenuCheckboxItem>
                                                );
                                            })}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {selectedColumn && (
                    <div className="relative flex-1 md:grow-0 ">

                        <Input
                            placeholder={`Filter ${selectedColumn}...`}
                            onChange={(e) => handleGlobalChange(e.target.value)}
                            className="ml-2 max-w-sm w-auto "
                            autoFocus
                        />
                        <Button
                            onClick={() => {
                                setAllFilters([]);
                                setSelectedGlobal(false);
                            }}
                            size="icon"
                            variant="ghost"
                            className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>

                            <X />
                        </Button>
                    </div>
                )}
                {selectedGlobal === true && (
                    <div className="relative flex-1 md:grow-0 ">
                        <DebouncedInput
                            value={globalFilter ?? ""}
                            onChange={(value) => setGlobalFilter(String(value))}
                            className="mx-1 ml-3 rounded-md border border-border bg-background p-2 text-foreground shadow max-w-sm w-auto"
                            placeholder="Search all columns..." autoFocus
                        />

                        <Button
                            onClick={() => {
                                setGlobalFilter([]);
                                setSelectedGlobal(false);
                            }}
                            size="icon"
                            variant="ghost"
                            className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                            <X size={16} />
                        </Button>
                    </div>
                )}
                <Button
                    variant="outline"
                    className='ml-3'
                    onClick={() => {
                        console.info('table.getSelectedRowModel().flatRows',)
                        setSelectedModel(table.getSelectedRowModel().flatRows[0].original);
                        /*   const formData = new FormData();
                           formData.append("stockNum", selectedModel.lockedId);
                           formData.append("financeId", finance.lockedId);
                           formData.append("year", selectedModel.year);
                           formData.append("color", selectedModel.color);
                           formData.append("model1", selectedModel.model1);
                           formData.append("model", selectedModel.model);
                           formData.append("vin", selectedModel.vin);
                           formData.append("bikeStatus", selectedModel.bikeStatus);
                           formData.append("location", selectedModel.location);
                           formData.append("make", selectedModel.make);
                           formData.append("modelName", selectedModel.modelName);
                           formData.append("color", selectedModel.color);
                           formData.append("msrp", selectedModel.msrp);
                           formData.append("mileage", selectedModel.mileage);
                           formData.append("expectedOn", selectedModel.expectedOn);
                           formData.append("orderStatus", selectedModel.orderStatus);
                           formData.append("age", selectedModel.age);
                           formData.append("isNew", selectedModel.isNew);
                           formData.append("keyNumber", selectedModel.keyNumber);
                           formData.append("onOrder", selectedModel.onOrder);
                           formData.append("vehicleIdWanted", selectedModel.vehicleIdWanted);
                           formData.append("intent", 'updateFinanceWanted');
                           submit(formData, { method: "post" });*/
                        toast.message('Unit has been saved to contract.', {
                            description: `finance.firstName}, finance.lastName}`,
                        })
                    }}
                >Assign Unit</Button>
            </div>
            <div className="container mx-auto py-5">
                <div className="rounded-md border">
                    <Table className='border border-border text-foreground bg-background'>
                        <TableHeader className='border border-border text-muted-foreground bg-background'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {header.column.getCanFilter() && showFilter && (
                                                    <div className="mx-auto items-center justify-center cursor-pointer text-center ">
                                                        <Filter column={header.column} table={table} />
                                                    </div>
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className='border border-border text-foreground bg-background'>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className='border border-border text-foreground bg-background'
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center border border-border text-foreground bg-background">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
};


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
