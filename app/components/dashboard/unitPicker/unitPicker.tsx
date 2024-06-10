import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/index";
import { ColumnDef, ColumnFiltersState, FilterFn, SortingFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { Checkbox } from "~/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { toast } from "sonner"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
import React, { useEffect, useState } from "react";
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { Form } from '@remix-run/react';
import { HelpCircle } from 'lucide-react';
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
          className=''
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock #
          <CaretSortIcon className="ml-2 h-4 w-4 " />
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
          className=''

          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase ">{row.getValue("year")}</div>,
  },
  {
    filterFn: 'fuzzy',
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("make")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("modelName")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("model2")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("submodel")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("price")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("exteriorColor")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("mileage")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("consignment")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("onOrder")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("expectedOn")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("status")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("orderStatus")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("vin")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("age")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("floorPlanDueDate")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("location")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("isNew")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("keyNumber")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("sold")}</div>,
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

async function getData() {
  const res = await fetch('/dashboard/inventory/moto')
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export function UnitPickerTable({ finance, }) {
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
  const [globalFilter, setGlobalFilter] = React.useState(finance.model.split(' ').pop())
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
    enableMultiRowSelection: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
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
      { name: "stockNumber", value: selectedRowData?.original.stockNum, placeHolder: "stockNumber" },
      { name: "year", value: selectedRowData?.original.year, placeHolder: "year" },
      { name: "make", value: selectedRowData?.original.brand, placeHolder: "make" },
      { name: "model", value: selectedRowData?.original.model, placeHolder: "model" },
      { name: "modelName", value: selectedRowData?.original.model1, placeHolder: "modelName" },
      { name: "model2", value: selectedRowData?.original.model2, placeHolder: "model2" },
      { name: "submodel", value: selectedRowData?.original.submodel, placeHolder: "submodel" },
      { name: "price", value: selectedRowData?.original.msrp, placeHolder: "price" },
      { name: "exteriorColor", value: selectedRowData?.original.color, placeHolder: "exteriorColor" },
      { name: "mileage", value: selectedRowData?.original.mileage, placeHolder: "mileage" },
      { name: "onOrder", value: selectedRowData?.original.onOrder, placeHolder: "onOrder" },
      { name: "expectedOn", value: selectedRowData?.original.expectedOn, placeHolder: "expectedOn" },
      { name: "bikeStatus", value: selectedRowData?.original.status, placeHolder: "status" },
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
  const [selectedModel, setSelectedModel] = useState()
  console.log(selectedModel, 'selceceted model')
  return (
    <div className="w-auto  ">
      <div className="flex items-center py-4">
        <Input
          value={globalFilter ?? ''}
          onChange={event => setGlobalFilter(event.target.value)}
          className="font-lg border-block w-[400px] border text-foreground bg-background border-border shadow"
          placeholder="Search all columns..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-3 text-foreground border-[#f2f2f2]">
              {todayfilterBy || "Default Filters"} <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='bg-white'>
            {DeliveriesList.map((item) => (
              <DropdownMenuCheckboxItem
                key={item.key}
                value={item.key}
                checked={todayfilterBy === item.key}
                onCheckedChange={() => {
                  handleFilterChange(item.key);
                  setTodayfilterBy(item.key);
                }}>
                {item.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="text-foreground bg-background border-[#f2f2f2] mx-2 my-auto h-7  cursor-pointer rounded   px-3 py-2  text-center text-xs  font-bold uppercase  shadow outline-none  transition-all duration-150 ease-linear  hover:shadow-md focus:outline-none"
        >
          Clear
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto text-foreground border-[#f2f2f2]">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='bg-white'>
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
      <div className="rounded-md border text-foreground bg-background border-border">
        <Table className='w-full overflow-x-auto text-foreground bg-background border-border'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className=' text-foreground bg-background border-border'
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
                  className='cursor-pointer text-foreground bg-background border-border'
                  onClick={() => {
                    handleRowClick(row)
                    console.log(row, 'row')
                  }}

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
                  className="h-24 cursor-pointer  text-center capitalize text-foreground bg-background border-border"

                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border rounded p-2 mb-2 mt-2 border-[#f2f2f2] text-foreground"
        onClick={() =>
          console.info(
            'table.getSelectedRowModel().flatRows',
            setSelectedModel(table.getSelectedRowModel().flatRows[0].original)
          )
        }
      >
        Select Unit
      </Button>
      <Form method='post'>


        <input type='hidden' name='stockNum' defaultValue={selectedModel?.stockNumber} />
        <input type='hidden' name='financeId' defaultValue={finance?.id} />
        <input type='hidden' name='year' defaultValue={selectedModel?.year} />
        <input type='hidden' name='color' defaultValue={selectedModel?.color} />
        <input type='hidden' name='model1' defaultValue={selectedModel?.modelName} />
        <input type='hidden' name='model' defaultValue={selectedModel?.model} />
        <input type='hidden' name='vin' defaultValue={selectedModel?.vin} />
        <input type='hidden' name='bikeStatus' defaultValue={selectedModel?.status} />
        <input type='hidden' name='location' defaultValue={selectedModel?.location} />
        <input type='hidden' name='make' defaultValue={selectedModel?.make} />
        <input type='hidden' name='modelName' defaultValue={selectedModel?.modelName} />
        <input type='hidden' name='color' defaultValue={selectedModel?.exteriorColor} />
        <input type='hidden' name='msrp' defaultValue={selectedModel?.price} />
        <input type='hidden' name='mileage' defaultValue={selectedModel?.mileage} />
        <input type='hidden' name='expectedOn' defaultValue={selectedModel?.expectedOn} />
        <input type='hidden' name='orderStatus' defaultValue={selectedModel?.orderStatus} />
        <input type='hidden' name='age' defaultValue={selectedModel?.age} />
        <input type='hidden' name='isNew' defaultValue={selectedModel?.isNew} />
        <input type='hidden' name='keyNumber' defaultValue={selectedModel?.keyNumber} />
        <input type='hidden' name='onOrder' defaultValue={selectedModel?.onOrder} />
        <input type='hidden' name='vehicleIdWanted' defaultValue={finance?.vehicleIdWanted} />
        <button
          className="border rounded p-2 mb-2 mt-2 mr-auto "
          type='submit'
          name='intent'
          value='updateFinanceWanted'
          onClick={() => {
            toast.message('Unit has been saved to contract.', {
              description: `${finance.firstName}, ${finance.lastName}`,
            })
          }}
        >
          Save Selection
        </button>
      </Form>
      < div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-foreground bg-background  ">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="  text-foreground bg-background border-[#f2f2f2]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-foreground bg-background border-[#f2f2f2]"

            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div >
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


export default function UnitPicker({ data }) {
  const onClose = () => { handleClose(false) }
  const finance = data
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root  >

      <Dialog.Trigger>
        <Button size="sm" variant="outline" className="h-8 gap-1 mr-3 border-[#f2f2f2] bg-background text-[#f2f2f2]"  >
          <Truck className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Assign Stock Unit
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50 bg-white/80 backdrop-blur-md currentEvent-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="text-foreground bg-background border-[#fafafab0] z-50  currentEvent-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-auto overflow-y  md:w-[95%] max-w-[80%] translate-x-[-50%] translate-y-[-50%] rounded-[6px]   p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none  ">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Confirm Unit for Current Client
            <TooltipProvider>
              <Tooltip open={isOpen} onOpenChange={setIsOpen}>
                <TooltipTrigger asChild>
                  <Button onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)} >
                    <HelpCircle strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom' data-state="closed" className='text-foreground bg-background border-border'>
                  <><p>Select unit the customer has picked.</p>
                    <p>Press select unit.</p>
                    <p>Then save with save selection.</p></>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Dialog.Title>
          <UnitPickerTable finance={finance} />
          <Dialog.Close asChild>
            <button className=" absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}
