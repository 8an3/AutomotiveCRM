
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
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
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import StockUnit from '~/components/dashboard/unitPicker/table'

import type { LinksFunction, LoaderArgs, } from "@remix-run/node";
import { Input, Separator, PopoverTrigger, PopoverContent, Popover, TextArea, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, SelectGroup, SelectLabel, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/index";
import * as React from "react"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns, } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { useEffect, useState } from "react";
import { Form, useLoaderData, useSubmit, useFetcher, useNavigate } from "@remix-run/react";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { type MetaFunction, redirect, type LoaderFunctionArgs, json, ActionFunction } from '@remix-run/node'
import { GetUser } from "~/utils/loader.server";
import { fuzzyFilter, fuzzySort, TableMeta, getTableMeta, DebouncedInput } from "~/components/shared/shared";
import { Cross2Icon, CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import IndeterminateCheckbox, { EditableText, Filter } from '~/components/shared/shared'
import { X } from "lucide-react";
import { toast } from "sonner";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import UnitDialog from '~/components/dashboard/inventory/diaolog'
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { cn } from "~/components/ui/utils";
import AddUnitDialog from "~/components/dashboard/inventory/addUnitDiaolog";
import motoIcon from '~/images/favicons/moto.svg'

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: motoIcon, },
]
export default function UnitPicker({ finance, tableData, user }) {


  // console.log(finance, tableData, user, 'unitpicker')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 mr-3 border-border bg-background text-[#f2f2f2]"  >
          <Truck className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Assign Stock Unit
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] border border-border max-h-[700px] h-auto overflow-y-auto">
        <UnitInv finance={finance} tableData={tableData} user={user} />
      </DialogContent>
    </Dialog>

  )
}

/**export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const inventoryMotorcycle = await prisma.inventoryMotorcycle.findMany({})

  return json({ user, inventoryMotorcycle, });
} */
export const action: ActionFunction = async ({ request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload)
  const userSession = await getSession(request.headers.get("Cookie"));
  if (!userSession) { return json({ status: 302, redirect: 'login' }); };
  const email = userSession.get("email");
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      ColumnStateInventory: {
        select: {
          id: true,
          state: true,
        }
      }
    }
  })
  const intent = formData.intent


  return json({ message: 'Invalid intent' }, { status: 400 });
}

export function UnitInv({ finance, user, tableData }) {
  /// const { inventoryMotorcycle, user } = useLoaderData()


  const [data, setPaymentData] = useState([]);



  useEffect(() => {
    setPaymentData(tableData)

    /**     if (tableData) {
           const filtered = tableData.filter((moto) => moto.model === finance.model)
         } */
  }, []);

  const fetcher = useFetcher();
  const submit = useSubmit();
  const [referrer, setReferrer] = useState()
  useEffect(() => {
    const referer = document.referrer;
    if (referer) {
      setReferrer(referer)
    }
  }, []);
  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );

  let defaultColumn = {
    cell: ({ row, column: { id } }) => {
      const data = row.original
      return (
        <p
          className="text-center py-1 px-2 text-foreground mx-auto flex justify-center"
        >
          {row.getValue(id)}
        </p>
      )
    },
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const savedVisibility = user.ColumnStateInventory.state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(savedVisibility || {
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
    // consignment: false,
  });

  useEffect(() => {
    fetcher.submit(
      { state: JSON.stringify(columnVisibility), intent: 'columnState' },
      { method: "post" }
    );
  }, [columnVisibility]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState(finance.model)
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedModel, setSelectedModel] = useState({})
  const [filterBy, setFilterBy] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(true);
  const [todayfilterBy, setTodayfilterBy] = useState(null);
  const [models, setModels] = useState([]);
  const [modelName, setModelName] = useState([]);
  const [subModel, setSubModel] = useState([]);

  useEffect(() => {
    async function fetchModels() {
      const uniqueModels = [
        ...new Set(tableData.map(wishList => wishList.model))
      ];
      const uniqueModels2 = [
        ...new Set(tableData.map(wishList => wishList.modelName))
      ];
      const uniqueModels3 = [
        ...new Set(tableData.map(wishList => wishList.subModel))
      ];
      setModels(uniqueModels);
      setModelName(uniqueModels2);
      setSubModel(uniqueModels3);
    }

    fetchModels();
  }, []);

  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short"
  };

  const handleDropdownChange = (value) => {
    setGlobalFilter(value);
  };

  const assignUnit = useFetcher()
  const columns = [
    {
      id: 'Assign Unit',
      accessorKey: "Assign Unit",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <Button
            onClick={() => {
              const formData = new FormData();
              formData.append("id", data.id);
              formData.append("stockNum", data.stockNumber);
              formData.append("year", data.year);
              formData.append("brand", data.make);
              formData.append("model", data.model);
              formData.append("mileage", data.mileage);
              formData.append("color", data.exteriorColor);
              formData.append("model1", data.submodel);
              formData.append("msrp", data.price);
              formData.append("vin", data.vin);
              formData.append("financeId", finance.id);
              formData.append("intent", 'assignUnit');
              assignUnit.submit(formData, { method: "post" });
            }}
            variant="outline">Assign Unit</Button>

        )
      },
    },
    {
      id: 'Unit File',
      accessorKey: "Unit File",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <UnitDialog data={data} user={user} />
        )
      },
    },
    {
      accessorKey: "id",
      header: "id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    /**    {
          accessorKey: "unitInfo",
          cell: ({ row, column: { id } }) => {
            const data = row.original
            return (
              <UnitDialog data={data} />
            )
          },
          filterFn: fuzzyFilter,
          sortingFn: fuzzySort,
        }, */
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
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Model' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {models.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "modelName",
      header: ({ column }) => {
        return (
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Model Name' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {modelName.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "submodel",
      header: ({ column }) => {
        return (
          <Select name='model' onValueChange={handleDropdownChange}>
            <SelectTrigger className="  bg-background text-foreground border border-border">
              <SelectValue placeholder='Sub Model' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                {subModel.map((model, index) => (
                  <SelectItem key={index} value={model} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                    {model}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
      accessorKey: "sold",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("sold")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Sold' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.sold}</p>
        </div>
      },
    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "status",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("status")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.status}</p>
        </div>
      },

    },
    {
      filterFn: fuzzyFilter,
      sortingFn: fuzzySort,
      accessorKey: "orderStatus",
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("orderStatus")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Order Status' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="On Order">On Order</SelectItem>
              <SelectItem value="Stock">Stock</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Wish">Wish</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.orderStatus}</p>
        </div>
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
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("isNew")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Is New' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.isNew}</p>
        </div>
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
      header: ({ column }) => {
        return <>
          <Select onValueChange={(value) => {
            const status = table.getColumn("stocked")
            status?.setFilterValue(value)
          }}                                >
            <SelectTrigger className="w-full bg-background text-foreground border border-border">
              <SelectValue placeholder='Stocked' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </>
      },
      id: 'stocked',
      footer: props => props.column.id,
      cell: ({ row }) => {
        const data = row.original
        //

        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">

          <p>{data.stocked}</p>
        </div>
      },
    },
    {
      accessorKey: "stockedDate",
      header: "Stocked Date",
      id: 'stockedDate',
      footer: props => props.column.id,
      cell: ({ row }) => {
        const data = row.original
        return <div className="w-[175px] bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center  uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <p>{data.stockedDate ? new Date(data.stockedDate).toLocaleDateString("en-US", options2) : ''}</p>
        </div >
      },
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

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    filterFns: { fuzzy: fuzzyFilter, },
    globalFilterFn: 'fuzzy',
    initialState: { columnVisibility },

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
      key: "available",
      name: "Available",
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
        table.getColumn('onOrder')?.setFilterValue('false');
        break;
      case 'available':
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
  const now = new Date();
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
  const navigate = useNavigate()
  return (
    <div className="w-[95%] mt-[15px] mx-auto">

      <div className="container mx-auto py-3">
        <div className="flex items-center py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' variant="outline" className='mr-3' >Menu</Button>
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
                    <DropdownMenuSubContent className="h-auto max-h-[175px] overflow-y-auto border border-border bg-background text-foreground">
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
          {userIsManager && (
            <AddUnitDialog />
          )}
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
          {referrer === '/dealer/manager/inventory' && (
            <Button size='sm' variant="outline" className='mr-3' onClick={() => {
              navigate(-1)
            }} >Back to Manager Dash</Button>
          )}

        </div>
        <div className="rounded-md border border-border    h-auto max-h-[600px] overflow-y-auto  ">
          <Table className='border border-border text-foreground bg-background'>
            <TableHeader className='border border-border text-muted-foreground bg-background'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='border-border'>
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
                          <div className="sticky  z-5 mx-auto items-center justify-center cursor-pointer text-center ">
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className='border border-border text-foreground bg-background '>
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
        <DataTablePagination table={table} />

      </div>
    </div>
  );
};


export const meta: MetaFunction = () => {
  return [
    { title: 'Stock Unit - Dealer Sales Assistant' },
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
