import React, { HTMLAttributes, HTMLProps, useState, useEffect, Suspense, useRef, } from 'react'
import { Await, Form, Link, useActionData, useFetcher, useLoaderData, useLocation, useNavigation, useSubmit } from '@remix-run/react'

import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import { type LinksFunction, type DataFunctionArgs, json } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction } from "~/components/actions/dashboardCalls";
import { ButtonLoading } from "~/components/ui/button-loading";
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import secondary from "~/styles/secondary.css";

import { SmDataTable } from '~/components/smData-table';
import SmClientCard from '~/components/dashboard/calls/smClientCard';
import PresetFollowUpDay from '~/components/dashboard/calls/presetFollowUpDay';
import IndeterminateCheckbox, { EditableText } from '~/components/actions/shared'
import {
  Button,
  Input,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
} from "~/components/ui/index";

import {

  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,

  getSortedRowModel,
  sortingFns,

  getFilteredRowModel,

  ColumnResizeMode,
  ColumnResizeDirection,
} from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  CalendarCheck,
  Search,
  MailWarning,
  UserPlus,
  MessageSquare,
  Mail,
} from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { X } from "lucide-react";
import useSWR from 'swr';
import ClientDialog from '~/components/dashboard/admin/clientDialog';
import { GetUser } from '~/utils/loader.server';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { redirect, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { prisma } from '~/libs';



export default function MainDashbaord() {
  const { user, clients, deFees, salesPerson } = useLoaderData();
  const [data, setPaymentData,] = useState(clients);
  /**
    useEffect(() => {
      const data = async () => {
        const result = await getData();
        setPaymentData(result);
      };
      data()
    }, []); */
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data: swrData } = useSWR(isSubmitting ? 'http://localhost:3000/dealer/api/clientfilesadmin' : null, dataFetcher, {})

  useEffect(() => {
    if (swrData) {
      setPaymentData(swrData);
    }
  }, [swrData]);

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex mx-auto my-auto'>
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
    },
    {
      id: 'clientDialog',
      accessorKey: "clientDialog",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Client" />
        </>
      },
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <ClientDialog data={data} user={user} deFees={deFees} salesPerson={salesPerson} />
        )
      },
    },
    {
      id: 'firstName',
      accessorKey: "firstName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="First Name" />
        </>
      },
    },
    {
      id: 'lastName',
      accessorKey: "lastName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LastName" />
      ),
    },
    {
      id: 'email',
      accessorKey: "email",
      filterFn: 'equalsString',
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Email" />
        </>
      },
    },
    {
      id: 'phone',
      accessorKey: "phone",
      filterFn: 'equalsString',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      id: 'address',
      accessorKey: "address",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
    },
    {
      id: 'city',
      accessorKey: "city",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City" />
      ),
    },
    {
      id: 'postal',
      accessorKey: "postal",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Postal" />
      ),
    },
    {
      id: 'province',
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Province" />
      ),
    },
    {
      id: 'dl',
      accessorKey: "dl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Drivers License" />
      ),
    },
    {
      id: 'typeOfContact',
      accessorKey: "typeOfContact",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type Of Contact" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
            <Select name='typeOfContact' defaultValue={data.typeOfContact} >
              <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=' bg-background text-foreground border border-border' >
                <SelectGroup>
                  <SelectLabel>Contact Method</SelectLabel>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="InPerson">In-Person</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      id: 'timeToContact',
      accessorKey: "timeToContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time To Contact" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
            <Select name='timeToContact' defaultValue={data.timeToContact}  >
              <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=' bg-background text-foreground border border-border' >
                <SelectGroup>
                  <SelectLabel>Best Time To Contact</SelectLabel>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
  ]
  const smColumns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex mx-auto my-auto'>
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
    },
    {
      id: 'firstName',
      accessorKey: "firstName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="First Name" />
        </>
      },
    },
    {
      id: 'lastName',
      accessorKey: "lastName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LastName" />
      ),
    },
    {
      id: 'email',
      accessorKey: "email",
      filterFn: 'equalsString',
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Email" />
        </>
      },
    },
    {
      id: 'phone',
      accessorKey: "phone",
      filterFn: 'equalsString',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      id: 'address',
      accessorKey: "address",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
    },
    {
      id: 'city',
      accessorKey: "city",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City" />
      ),
    },
    {
      id: 'postal',
      accessorKey: "postal",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Postal" />
      ),
    },
    {
      id: 'province',
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Province" />
      ),
    },
    {
      id: 'dl',
      accessorKey: "dl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Drivers License" />
      ),
    },
    {
      id: 'typeOfContact',
      accessorKey: "typeOfContact",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type Of Contact" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
            <Select name='typeOfContact' defaultValue={data.typeOfContact} >
              <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=' bg-background text-foreground border border-border' >
                <SelectGroup>
                  <SelectLabel>Contact Method</SelectLabel>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="InPerson">In-Person</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      id: 'timeToContact',
      accessorKey: "timeToContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time To Contact" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
            <Select name='timeToContact' defaultValue={data.timeToContact}  >
              <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className=' bg-background text-foreground border border-border' >
                <SelectGroup>
                  <SelectLabel>Best Time To Contact</SelectLabel>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
  ]
  return (
    <div>
      <div className="block md:hidden">
        <SmDataTable columns={smColumns} data={data} />
      </div>
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={data}
          user={user}
        />
      </div>
    </div>
  )
}


export function DataTable({ columns, data, user }) {



  const savedVisibility = user.ColumnStateInventory.state

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(savedVisibility);

  useEffect(() => {
    fetcher.submit(
      { state: JSON.stringify(columnVisibility), intent: 'columnState' },
      { method: "post" }
    );
  }, [columnVisibility]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    initialState: { columnVisibility },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    globalFilterFn: "fuzzy",
  });

  const [filterBy, setFilterBy] = useState("");
  const handleInputChange = (name) => {
    setFilterBy(columnId);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}`;
  };
  const now = new Date();
  const formattedDate = formatDate(now);
  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    console.log(formatDate(today), "today");
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
    setAllFilters();
    const customerStateColumn = table.getColumn("customerState");
    const nextAppointmentColumn = table.getColumn("nextAppointment");
    const deliveredDate = table.getColumn("deliveredDate");
    const pickUpDate = table.getColumn("pickUpDate");
    const status = table.getColumn("status");
    const depositMade = table.getColumn("depositMade");
    const sold = table.getColumn("sold");
    const delivered = table.getColumn("delivered");
    const signed = table.getColumn("signed");
    const financeApp = table.getColumn("financeApp");

    if (selectedFilter === "deliveredThisMonth") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "deliveredLastMonth") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "deliveredThisYear") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getThisYear);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "pendingCalls") {
      customerStateColumn?.setFilterValue("Pending");
      status?.setFilterValue("active");
    }

    if (selectedFilter === "todaysCalls") {
      nextAppointmentColumn?.setFilterValue(getToday);
      console.log(nextAppointmentColumn, "nextAppointmentColumn");
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "tomorowsCalls") {
      nextAppointmentColumn?.setFilterValue(getTomorrow);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "yestCalls") {
      nextAppointmentColumn?.setFilterValue(getYesterday);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCalls") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsLastMonth") {
      nextAppointmentColumn?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsTwoMonths") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfTwoMonthsAgo);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsYear") {
      nextAppointmentColumn?.setFilterValue(getThisYear);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "todaysDeliveries") {
      pickUpDate?.setFilterValue(getToday);
      status?.setFilterValue("active");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "tomorowsDeliveries") {
      pickUpDate?.setFilterValue(getTomorrow);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "yestDeliveries") {
      pickUpDate?.setFilterValue(getYesterday);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "depositsToday") {
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
      signed?.setFilterValue("off");
      financeApp?.setFilterValue("off");
    }
  };

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setFilterBy("");
    setGlobalFilter([]);
  };

  // toggle column filters
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const fetcher = useFetcher();

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(false);

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
  //apply the fuzzy sort if the fullName column is being filtered
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="w-[95%] mt-[15px] mx-auto">
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
        <Button size='sm' variant="outline" className='mr-3' onClick={() => {

        }} >Work Orders</Button>
        <Button size='sm' variant="outline" className='mr-3' onClick={() => {

        }} >PAC Orders</Button>

      </div>
      <div className="container mx-auto py-3">
        <div className="rounded-md border border-border    h-auto max-h-[600px] overflow-y-auto  ">
          <ShadTable className='border border-border text-foreground bg-background'>
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
          </ShadTable>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}


export async function getData(): Promise<dashBoardType[]> {

  //turn into dynamic route and have them call the right loader like q  uote qand overview http://localhost:3000
  const res = await fetch('/dealer/api/clientfilesadmin')
  console.log(res, 'res')
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res//.json();
}
export type Payment = {
  id: string
  fiannceId: string//
  userEmail: string//
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
  nextAppointment: string//
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
export const meta = () => {
  return [
    { title: 'Admin - All Clients - Dealer Sales Assistant' },
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
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
];

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const clients = await prisma.clientfile.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      financeId: true,
      userId: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postal: true,
      province: true,
      dl: true,
      typeOfContact: true,
      timeToContact: true,
      conversationId: true,
      billingAddress: true,

      AccOrder: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          userEmail: true,
          userName: true,
          dept: true,
          sellingDept: true,
          total: true,
          discount: true,
          discPer: true,
          paid: true,
          paidDate: true,
          status: true,
          workOrderId: true,
          note: true,
          financeId: true,
          clientfileId: true,

          AccHandoff: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              sendTo: true,
              handOffTime: true,
              status: true,
              sendToCompleted: true,
              completedTime: true,
              notes: true,
              handOffDept: true,
              AccOrderId: true,
            }
          },

          AccessoriesOnOrders: {
            select: {
              id: true,
              quantity: true,
              accOrderId: true,
              status: true,
              orderNumber: true,
              OrderInvId: true,
              accessoryId: true,
              service: true,
              hour: true,

              accessory: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  partNumber: true,
                  brand: true,
                  name: true,
                  price: true,
                  cost: true,
                  quantity: true,
                  minQuantity: true,
                  description: true,
                  category: true,
                  subCategory: true,
                  onOrder: true,
                  distributer: true,
                  location: true,
                  note: true,
                  workOrderSuggestion: true,
                }
              }
            }
          },

          Payments: {
            select: {
              id: true,
              createdAt: true,
              paymentType: true,
              cardType: true,
              amountPaid: true,
              cardNum: true,
              receiptId: true,
              financeId: true,
              userEmail: true,
              accOrderId: true,
              workOrderId: true,
            }
          },
        },
      },
      WorkOrder: {
        select: {
          workOrderId: true,
          unit: true,
          mileage: true,
          vin: true,
          tag: true,
          motor: true,
          color: true,
          budget: true,
          waiter: true,
          totalLabour: true,
          totalParts: true,
          subTotal: true,
          total: true,
          writer: true,
          userEmail: true,
          tech: true,
          techEmail: true,
          notes: true,
          customerSig: true,
          status: true,
          location: true,
          quoted: true,
          paid: true,
          remaining: true,
          FinanceUnitId: true,
          ServiceUnitId: true,
          financeId: true,
          clientfileId: true,
          note: true,
          closedAt: true,
          createdAt: true,
          updatedAt: true,

          FinanceUnit: {
            select: {
              paintPrem: true,
              licensing: true,
              stockNum: true,
              options: true,
              accessories: true,
              freight: true,
              labour: true,
              year: true,
              brand: true,
              mileage: true,
              model: true,
              model1: true,
              color: true,
              modelCode: true,
              msrp: true,
              trim: true,
              vin: true,
              bikeStatus: true,
              invId: true,
              location: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              financeId: true,
            }
          },

          ServiceUnit: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              price: true,
              brand: true,
              model: true,
              color: true,
              accessories: true,
              options: true,
              year: true,
              vin: true,
              trim: true,
              mileage: true,
              location: true,
              condition: true,
              repairs: true,
              stockNum: true,
              motor: true,
              tag: true,
              licensing: true,
              tradeEval: true,
              clientfileId: true,
            }
          },

          AccOrders: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              userEmail: true,
              userName: true,
              dept: true,
              sellingDept: true,
              total: true,
              discount: true,
              discPer: true,
              paid: true,
              paidDate: true,
              status: true,
              workOrderId: true,
              note: true,
              financeId: true,
              clientfileId: true,
              AccessoriesOnOrders: {
                select: {
                  id: true,
                  quantity: true,
                  accOrderId: true,
                  status: true,
                  orderNumber: true,
                  OrderInvId: true,
                  accessoryId: true,
                  service: true,
                  hour: true,
                }
              },
              Payments: {
                select: {
                  id: true,
                  createdAt: true,
                  paymentType: true,
                  cardType: true,
                  amountPaid: true,
                  cardNum: true,
                  receiptId: true,
                  financeId: true,
                  userEmail: true,
                  accOrderId: true,
                  workOrderId: true,
                }
              },
            }
          },

          ServicesOnWorkOrders: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              quantity: true,
              hr: true,
              status: true,
              workOrderId: true,
              serviceId: true,
              service: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  description: true,
                  estHr: true,
                  service: true,
                  price: true,
                }
              },
            }
          },

          Payments: {
            select: {
              id: true,
              createdAt: true,
              paymentType: true,
              cardType: true,
              amountPaid: true,
              cardNum: true,
              receiptId: true,
              financeId: true,
              userEmail: true,
              accOrderId: true,
              workOrderId: true,
            }
          },

          WorkOrderApts: {
            select: {
              id: true,
              tech: true,
              techEmail: true,
              writer: true,
              start: true,
              end: true,
              title: true,
              workOrderId: true,
              completed: true,
              resourceId: true,
              unit: true,
              mileage: true,
              vin: true,
              tag: true,
              motor: true,
              color: true,
              location: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          WorkOrderClockEntries: {
            select: {
              id: true,
              start: true,
              end: true,
              userEmail: true,
              username: true,
              workOrderId: true,
              createdAt: true,
              updatedAt: true,

            }
          },
        },
      },
      Finance: {
        select: {
          financeManager: true,
          userEmail: true,
          userName: true,
          financeManagerName: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          name: true,
          address: true,
          city: true,
          postal: true,
          province: true,
          dl: true,
          typeOfContact: true,
          timeToContact: true,
          dob: true,
          othTax: true,
          optionsTotal: true,
          lienPayout: true,
          leadNote: true,
          sendToFinanceNow: true,
          dealNumber: true,
          iRate: true,
          months: true,
          discount: true,
          total: true,
          onTax: true,
          on60: true,
          biweekly: true,
          weekly: true,
          weeklyOth: true,
          biweekOth: true,
          oth60: true,
          weeklyqc: true,
          biweeklyqc: true,
          qc60: true,
          deposit: true,
          biweeklNatWOptions: true,
          weeklylNatWOptions: true,
          nat60WOptions: true,
          weeklyOthWOptions: true,
          biweekOthWOptions: true,
          oth60WOptions: true,
          biweeklNat: true,
          weeklylNat: true,
          nat60: true,
          qcTax: true,
          otherTax: true,
          totalWithOptions: true,
          otherTaxWithOptions: true,
          desiredPayments: true,
          admin: true,
          commodity: true,
          pdi: true,
          discountPer: true,
          userLoanProt: true,
          userTireandRim: true,
          userGap: true,
          userExtWarr: true,
          userServicespkg: true,
          deliveryCharge: true,
          vinE: true,
          lifeDisability: true,
          rustProofing: true,
          userOther: true,
          referral: true,
          visited: true,
          bookedApt: true,
          aptShowed: true,
          aptNoShowed: true,
          testDrive: true,
          metService: true,
          metManager: true,
          metParts: true,
          sold: true,
          depositMade: true,
          refund: true,
          turnOver: true,
          financeApp: true,
          approved: true,
          signed: true,
          pickUpSet: true,
          demoed: true,
          lastContact: true,
          status: true,
          customerState: true,
          result: true,
          timesContacted: true,
          nextAppointment: true,
          followUpDay: true,
          deliveryDate: true,
          delivered: true,
          deliveredDate: true,
          notes: true,
          visits: true,
          progress: true,
          metSalesperson: true,
          metFinance: true,
          financeApplication: true,
          pickUpDate: true,
          pickUpTime: true,
          depositTakenDate: true,
          docsSigned: true,
          tradeRepairs: true,
          seenTrade: true,
          lastNote: true,
          applicationDone: true,
          licensingSent: true,
          liceningDone: true,
          refunded: true,
          cancelled: true,
          lost: true,
          dLCopy: true,
          insCopy: true,
          testDrForm: true,
          voidChq: true,
          loanOther: true,
          signBill: true,
          ucda: true,
          tradeInsp: true,
          customerWS: true,
          otherDocs: true,
          urgentFinanceNote: true,
          funded: true,
          leadSource: true,
          financeDeptProductsTotal: true,
          bank: true,
          loanNumber: true,
          idVerified: true,
          dealerCommission: true,
          financeCommission: true,
          salesCommission: true,
          firstPayment: true,
          loanMaturity: true,
          quoted: true,
          InPerson: true,
          Phone: true,
          SMS: true,
          Email: true,
          Other: true,
          paintPrem: true,
          licensing: true,
          stockNum: true,
          options: true,
          accessories: true,
          freight: true,
          labour: true,
          year: true,
          brand: true,
          mileage: true,
          model: true,
          model1: true,
          color: true,
          modelCode: true,
          msrp: true,
          trim: true,
          vin: true,
          bikeStatus: true,
          invId: true,
          motor: true,
          tag: true,
          tradeValue: true,
          tradeDesc: true,
          tradeColor: true,
          tradeYear: true,
          tradeMake: true,
          tradeVin: true,
          tradeTrim: true,
          tradeMileage: true,
          tradeLocation: true,
          lien: true,
          financeStorage: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              url: true,
              filePath: true,
              financeId: true,
            }
          },
          clientApts: {
            select: {
              id: true,
              financeId: true,
              title: true,
              start: true,
              end: true,
              contactMethod: true,
              completed: true,
              apptStatus: true,
              apptType: true,
              note: true,
              unit: true,
              brand: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              address: true,
              userEmail: true,
              userId: true,
              description: true,
              userName: true,
              attachments: true,
              direction: true,
              resultOfcall: true,
              resourceId: true,
              activixId: true,
              activixNoteId: true,
              createdAt: true,
              updatedAt: true,
              isPublished: true,
            }
          },
          Comm: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              userEmail: true,
              type: true,
              body: true,
              subject: true,
              userName: true,
              direction: true,
              result: true,
              financeId: true,
            },
          },
          FinanceDeptProducts: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              packageName: true,
              packagePrice: true,
              financeId: true,
            }
          },
          FinanceUnit: {
            select: {
              paintPrem: true,
              licensing: true,
              stockNum: true,
              options: true,
              accessories: true,
              freight: true,
              labour: true,
              year: true,
              brand: true,
              mileage: true,
              model: true,
              model1: true,
              color: true,
              modelCode: true,
              msrp: true,
              trim: true,
              vin: true,
              bikeStatus: true,
              invId: true,
              location: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              financeId: true,
            }
          },
          FinanceTradeUnit: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              financeId: true,
              price: true,
              brand: true,
              model: true,
              color: true,
              accessories: true,
              options: true,
              year: true,
              vin: true,
              trim: true,
              mileage: true,
              location: true,
              condition: true,
              repairs: true,
              stockNum: true,
              licensing: true,
              tradeEval: true,
            }
          },
          AccOrders: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              userEmail: true,
              userName: true,
              dept: true,
              sellingDept: true,
              total: true,
              discount: true,
              discPer: true,
              paid: true,
              paidDate: true,
              status: true,
              workOrderId: true,
              note: true,
              financeId: true,
              clientfileId: true,

              AccHandoff: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  sendTo: true,
                  handOffTime: true,
                  status: true,
                  sendToCompleted: true,
                  completedTime: true,
                  notes: true,
                  handOffDept: true,
                  AccOrderId: true,
                }
              },

              AccessoriesOnOrders: {
                select: {
                  id: true,
                  quantity: true,
                  accOrderId: true,
                  status: true,
                  orderNumber: true,
                  OrderInvId: true,
                  accessoryId: true,
                  service: true,
                  hour: true,

                  accessory: {
                    select: {
                      id: true,
                      createdAt: true,
                      updatedAt: true,
                      partNumber: true,
                      brand: true,
                      name: true,
                      price: true,
                      cost: true,
                      quantity: true,
                      minQuantity: true,
                      description: true,
                      category: true,
                      subCategory: true,
                      onOrder: true,
                      distributer: true,
                      location: true,
                      note: true,
                      workOrderSuggestion: true,
                    }
                  }
                }
              },

              Payments: {
                select: {
                  id: true,
                  createdAt: true,
                  paymentType: true,
                  cardType: true,
                  amountPaid: true,
                  cardNum: true,
                  receiptId: true,
                  financeId: true,
                  userEmail: true,
                  accOrderId: true,
                  workOrderId: true,
                }
              },
            },
          },
          WorkOrders: {
            select: {
              workOrderId: true,
              unit: true,
              mileage: true,
              vin: true,
              tag: true,
              motor: true,
              color: true,
              budget: true,
              waiter: true,
              totalLabour: true,
              totalParts: true,
              subTotal: true,
              total: true,
              writer: true,
              userEmail: true,
              tech: true,
              techEmail: true,
              notes: true,
              customerSig: true,
              status: true,
              location: true,
              quoted: true,
              paid: true,
              remaining: true,
              FinanceUnitId: true,
              ServiceUnitId: true,
              financeId: true,
              clientfileId: true,
              note: true,
              closedAt: true,
              createdAt: true,
              updatedAt: true,

              FinanceUnit: {
                select: {
                  paintPrem: true,
                  licensing: true,
                  stockNum: true,
                  options: true,
                  accessories: true,
                  freight: true,
                  labour: true,
                  year: true,
                  brand: true,
                  mileage: true,
                  model: true,
                  model1: true,
                  color: true,
                  modelCode: true,
                  msrp: true,
                  trim: true,
                  vin: true,
                  bikeStatus: true,
                  invId: true,
                  location: true,
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  financeId: true,
                }
              },

              ServiceUnit: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  price: true,
                  brand: true,
                  model: true,
                  color: true,
                  accessories: true,
                  options: true,
                  year: true,
                  vin: true,
                  trim: true,
                  mileage: true,
                  location: true,
                  condition: true,
                  repairs: true,
                  stockNum: true,
                  motor: true,
                  tag: true,
                  licensing: true,
                  tradeEval: true,
                  clientfileId: true,
                }
              },

              AccOrders: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  userEmail: true,
                  userName: true,
                  dept: true,
                  sellingDept: true,
                  total: true,
                  discount: true,
                  discPer: true,
                  paid: true,
                  paidDate: true,
                  status: true,
                  workOrderId: true,
                  note: true,
                  financeId: true,
                  clientfileId: true,
                  AccessoriesOnOrders: {
                    select: {
                      id: true,
                      quantity: true,
                      accOrderId: true,
                      status: true,
                      orderNumber: true,
                      OrderInvId: true,
                      accessoryId: true,
                      service: true,
                      hour: true,
                    }
                  },
                  Payments: {
                    select: {
                      id: true,
                      createdAt: true,
                      paymentType: true,
                      cardType: true,
                      amountPaid: true,
                      cardNum: true,
                      receiptId: true,
                      financeId: true,
                      userEmail: true,
                      accOrderId: true,
                      workOrderId: true,
                    }
                  },
                }
              },

              ServicesOnWorkOrders: {
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  quantity: true,
                  hr: true,
                  status: true,
                  workOrderId: true,
                  serviceId: true,
                  service: {
                    select: {
                      id: true,
                      createdAt: true,
                      updatedAt: true,
                      description: true,
                      estHr: true,
                      service: true,
                      price: true,
                    }
                  },
                }
              },

              Payments: {
                select: {
                  id: true,
                  createdAt: true,
                  paymentType: true,
                  cardType: true,
                  amountPaid: true,
                  cardNum: true,
                  receiptId: true,
                  financeId: true,
                  userEmail: true,
                  accOrderId: true,
                  workOrderId: true,
                }
              },

              WorkOrderApts: {
                select: {
                  id: true,
                  tech: true,
                  techEmail: true,
                  writer: true,
                  start: true,
                  end: true,
                  title: true,
                  workOrderId: true,
                  completed: true,
                  resourceId: true,
                  unit: true,
                  mileage: true,
                  vin: true,
                  tag: true,
                  motor: true,
                  color: true,
                  location: true,
                  createdAt: true,
                  updatedAt: true,
                }
              },
              WorkOrderClockEntries: {
                select: {
                  id: true,
                  start: true,
                  end: true,
                  userEmail: true,
                  username: true,
                  workOrderId: true,
                  createdAt: true,
                  updatedAt: true,

                }
              },
            },
          },
          Payments: {
            select: {
              id: true,
              createdAt: true,
              paymentType: true,
              cardType: true,
              amountPaid: true,
              cardNum: true,
              receiptId: true,
              financeId: true,
              userEmail: true,
              accOrderId: true,
              workOrderId: true,
            }
          },
          FinanceNote: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              body: true,
              userEmail: true,
              userName: true,
              clientfileId: true,
              financeId: true,
            }
          },
        }
      },
    }
  });
  const deFees = await prisma.dealer.findUnique({ where: { id: 1 } })
  const salesPerson = await prisma.user.findUnique({
    where: { email: user.email }
  })
  return json({ user, clients, deFees, salesPerson })
}

export let action = dashboardAction


declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const defaultColumn = {
  cell: ({ row, column: { id } }) => {
    const data = row.original
    return (
      <EditableText
        value={row.getValue(id)}
        fieldName="name"
        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
        buttonClassName="text-center py-1 px-2 text-foreground mx-auto flex justify-center"
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

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 rounded border shadow"
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

