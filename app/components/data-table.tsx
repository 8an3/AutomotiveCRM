"use client";
import { Button, Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "~/components/ui/index";
import React, { useMemo, useEffect, useState, useRef } from "react";

import { ScrollArea } from "~/other/scrollarea";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, type SortingState, getSortedRowModel, sortingFns, SortingFn, FilterFns, FilterFn, type VisibilityState, getFilteredRowModel, type ColumnFiltersState, } from "@tanstack/react-table";
import { DataTablePagination } from "./dashboard/calls/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/other/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";
import { Form, Link, useFetcher, useLoaderData, useTransition, } from "@remix-run/react";
import AddCustomer from "./dashboard/calls/addCustomer";
import Filter from "./dashboard/calls/Filter";
import { Flex, Text, TextArea, TextField, Heading } from '@radix-ui/themes';
import { CalendarCheck, Search, MailWarning } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { env } from 'process';
import axios from 'axios';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dashData: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,

}: DataTableProps<TData, TValue>) {

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      oth60WOptions: false,
      weeklyOthWOptions: false,
      weeklylNatWOptions: false,
      biweekOthWOptions: false,
      desiredPayments: false,
      clientfileId: false,
      commodity: false,
      msrp: false,
      turnover: false,
      unitPicker: false,
      painPrem: false,
      freight: false,
      biweeklNatWOptions: false,
      nat60WOptions: false,
      deliveredDate: false,
      licensing: false,
      followUpDay: false,
      pdi: false,
      admin: false,
      accessories: false,
      labour: false,
      trailer: false,
      weeklyOth: false,
      biweekOth: false,
      months: false,
      depositMade: false,
      oth60: false,
      weeklylNat: false,
      on60: false,
      iRate: false,
      biweeklNat: false,
      nat60: false,
      biweekly: false,
      weeklyqc: false,
      biweeklyqc: false,
      weekly: false,
      qc60: false,
      financeId: false,
      province: false,
      userEmail: false,
      postal: false,
      address: false,
      city: false,
      phone: false,
      result: false,
      email: false,
      referral: false,
      visited: false,
      bookedApt: false,
      aptShowed: false,
      aptNoShowed: false,
      testDrive: false,
      metService: false,
      metManager: false,
      metParts: false,
      sold: false,
      contactMethod: false,
      refund: false,
      turnOver: false,
      financeApp: false,
      approved: false,
      signed: false,
      pickUpSet: false,
      demoed: false,
      delivered: false,
      tradeMake: false,
      tradeYear: false,
      tradeTrim: false,
      tradeColor: false,
      tradeVin: false,
      timesContacted: false,
      visits: false,
      financeApplication: false,
      progress: false,
      metFinance: false,
      metSalesperson: false,
      seenTrade: false,
      docsSigned: false,
      tradeRepairs: false,
      dl: false,
      timeOfDay: false,
      timeToContact: false,
      typeOfContact: false,
      discount: false,
      pickUpTime: false,
      total: false,
      onTax: false,
      deliveryCharge: false,
      userLoanProt: false,
      userTireandRim: false,
      userGap: false,
      userExtWarr: false,
      userServicespkg: false,
      vinE: false,
      lifeDisability: false,
      rustProofing: false,
      userOther: false,
      deposit: false,
      paintPrem: false,
      discountPer: false,
      qcTax: false,
      otherTax: false,
      totalWithOptions: false,
      otherTaxWithOptions: false,
      stockNum: false,
      model1: false,
      note: false,
      color: false,
      modelCode: false,
      lastNote: false,
      documentUpload: false,
      tradeValue: false,
      singleFinNote: false,
    });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({})

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
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
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };


  //defaultValue={todayfilterBy}>
  return (

    <div className="mb-[20px]  even:bg-myColor-900  rounded overflow-x-hidden   justify-center">
      <div className="flex items-center">

        <Select className='text-[#02a9ff] border-[#02a9ff]' onValueChange={(value) => {
          const item = CallsList.find(i => i.key === value) || DeliveriesList.find(i => i.key === value) || DepositsTakenList.find(i => i.key === value);
          if (item) {
            handleFilterChange(item.key);
            setTodayfilterBy(item.name);
          }
        }}>
          <SelectTrigger className="w-auto text-[#02a9ff] border-[#02a9ff]  mr-3 ">
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

        <Select onValueChange={(value) => handleInputChange(value)} >
          <SelectTrigger className='text-[#02a9ff] border-[#02a9ff] w-auto  mr-3'>
            Global Filter
          </SelectTrigger>
          <SelectContent align="end" className='bg-slate1 text-slate12 '>
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <SelectItem key={column.id} value={column.id} className="bg-[#fff] text-[#000] capitalize cursor-pointer  hover:underline hover:text-[#02a9ff]">
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

        <Button onClick={() => setAllFilters([])} className='bg-[#02a9ff] text-slate1 hover:text-slate1 mr-3' >
          Clear
        </Button>

        <Button onClick={toggleFilter} className='bg-[#02a9ff] text-slate1 hover:text-slate1 mr-3' >
          Toggle Col
        </Button>
        <div className="mx-2">
          <MassEmail table={table} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className="cursor-pointer my-auto  text-slate1 hover:text-[#02a9ff]  ">
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="bg-slat12" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate12 capitalize cursor-pointer  text-slate1 hover:underline hover:text-[#02a9ff]">
            <ScrollArea className="h-[500px] w-[200px] rounded-md  p-4">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="bg-slate12 capitalize cursor-pointer hover:text-[#02a9ff] text-slate1 hover:underline "
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
      </div >
      <div className="mt-[20px] rounded-md  border border-[#60646c] text-slate1">
        <Table className="rounded-md overflow-x-auto border-[#60646c]">
          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-[#60646c]'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <>
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

                      </>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-x-auto border-[#60646c]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`p-4 text-slate1 bg-slate12 border-[#60646c] capitalize cursor-pointer  ${index % 2 === 0 ? 'bg-slate12' : 'bg-[#2c3238]'}`}
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
                  className="h-24 text-center text-slate1 bg-slate12 capitalize cursor-pointer hover:text-[#02a9ff]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div >
  );
}

/*const FilterForm = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
            />
        </span>
    );
};

export default FilterForm;
*/

