"use client";
import { Input, Separator, Button, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "~/components/ui/index";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { Flex, Text, TextArea, TextField, Heading, Select } from '@radix-ui/themes';

import { ScrollArea } from "~/other/scrollarea";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, type SortingState, getSortedRowModel, sortingFns, SortingFn, FilterFns, FilterFn, type VisibilityState, getFilteredRowModel, type ColumnFiltersState, } from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/other/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from "~/other/dropdown-menu";
import { Form, Link, useFetcher, useLoaderData, useTransition, } from "@remix-run/react";
import AddCustomer from "~/components/dashboard/calls/addCustomer";
import Filter from "~/components/dashboard/calls/Filter";
import { format } from 'date-fns';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dashData: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,

}: DataTableProps<TData, TValue>) {
  let lead = data.lead
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      oth60WOptions: false,
      weeklyOthWOptions: false,
      weeklylNatWOptions: false,
      biweekOthWOptions: false,
      desiredPayments: false,
      clientfileId: false,
      commodity: false,
      msrp: false,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
    setFilterBy(name);
  };

  function formatDate(dateString) {
    const options = { month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  function formatDateWithLeadingZeros(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}` //${hours}:${minutes}`;
  }
  const now = new Date(); // Current date and time
  const formattedDate = formatDateWithLeadingZeros(now);
  //console.log(formattedDate); // Output: "Wed, Nov 02, 2023, 09:05 AM"

  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    console.log(formatDateWithLeadingZeros(today), 'today')
    return formatDateWithLeadingZeros(today);

  }
  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateWithLeadingZeros(tomorrow);
  }

  function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateWithLeadingZeros(yesterday);
  }

  // get current month
  function getCurrentMonthAbbreviation() {
    const today = new Date();
    const monthOptions = { month: 'short' };
    return today.toLocaleDateString('en-US', monthOptions);
  }
  const currentMonthAbbreviation = getCurrentMonthAbbreviation();

  // get last month
  function getPreviousMonthAbbreviation() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const monthOptions = { month: 'short' };
    return today.toLocaleDateString('en-US', monthOptions);
  }
  const previousMonthAbbreviation = getPreviousMonthAbbreviation();

  // get 2 months ago
  function getTwoMonthsAgo() {
    const today = new Date();
    today.setMonth(today.getMonth() - 2);
    const monthOptions = { month: 'short' };
    return today.toLocaleDateString('en-US', monthOptions);
  }
  const getTwoMonthsAgoAbbr = getTwoMonthsAgo();


  function getYear() {
    const today = new Date();
    today.setDate(today.getDate());
    const year = today.getFullYear();
    return (year)
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
      deliveredDate?.setFilterValue(currentMonthAbbreviation);
      status?.setFilterValue('active');

    }

    if (selectedFilter === "deliveredLastMonth") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(previousMonthAbbreviation);
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
      nextAppointmentColumn?.setFilterValue(currentMonthAbbreviation);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsLastMonth") {
      nextAppointmentColumn?.setFilterValue(previousMonthAbbreviation);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsTwoMonths") {
      nextAppointmentColumn?.setFilterValue(getTwoMonthsAgoAbbr);
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

    <div className="mb-[20px] mt-[10px] even:bg-myColor-900 overflow-x-hidden rounded">
      <div className="flex justify-between items-center">
        {/* Item aligned to the left */}
        <Flex gap="3">



          <DropdownMenu>
            <DropdownMenuTrigger >

              <Button name='intent' value='2DaysFromNow' type='submit' className="bg-[#02a9ff] cursor-pointer  w-[115px] p-3 mr-1 text-white active:bg-black font-bold uppercase   text-xs whitespace-nowrap  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
                Default Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate1">
              <DropdownMenuLabel>Calls</DropdownMenuLabel>
              {CallsList.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.key}
                  name={item.name}
                  className="bg-slate1 capitalize cursor-pointer"
                  checked={item.name === todayfilterBy}
                  onCheckedChange={() => {
                    handleFilterChange(item.key);
                    setTodayfilterBy(item.name)
                  }} >
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel>Deliveries</DropdownMenuLabel>
              {DeliveriesList.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.key}
                  name={item.name}
                  className="bg-slate1 capitalize cursor-pointer"
                  checked={item.name === todayfilterBy}
                  onCheckedChange={() => {
                    handleFilterChange(item.key);
                    setTodayfilterBy(item.name)
                  }} >
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel>Deposit Taken</DropdownMenuLabel>
              {DepositsTakenList.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.key}
                  name={item.name}
                  className="bg-slate1 capitalize cursor-pointer"
                  checked={item.name === todayfilterBy}
                  onCheckedChange={() => {
                    handleFilterChange(item.key);
                    setTodayfilterBy(item.name)
                  }} >
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button name='intent' value='2DaysFromNow' type='submit'
                className="bg-[#02a9ff] whitespace-nowrap p-3 cursor-pointer w-[140px] mx-1 text-white active:bg-black font-bold uppercase  hover:text-slate1 text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
              >
                Global Filter
              </Button>
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
                        name="filterBy"
                        className="bg-slate1 capitalize  cursor-pointer"
                        checked={column.id === filterBy}
                        onCheckedChange={(value) =>
                          handleInputChange(column.id)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
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

          <Button onClick={() => setAllFilters([])} name='intent' type='submit' className="bg-[#02a9ff]  cursor-pointer w-[50px] mx-1 text-slate1 active:bg-black font-bold uppercase hover:text-slate1 whitespace-nowrap p-3 text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150">
            Clear
          </Button>

          <Button
            className="bg-[#02a9ff] w-[90px] hover:text-slate1 cursor-pointer my-auto mx-1 text-slate1 active:bg-black font-bold uppercase   text-xs  rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all text-center duration-150"
            onClick={toggleFilter}>
            Toggle Col
          </Button>

          <AddCustomer />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="cursor-pointer my-auto  hover:text-[#02a9ff] ">
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
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

          <p className="cursor-pointer my-auto ml-3 mr-3 hover:text-[#02a9ff]">
            <Link to='/calendar/sales'>
              <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Link>
          </p>

        </Flex>
      </div>
      <div className="mt-[20px] rounded-md rounded-2 border overflow-x-auto text-slate1">
        <Table className="rounded-md  rounded-2">
          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                          <div className="mx-auto items-center justify-center text-center cursor-pointer ">
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`p-4 ${index % 2 === 0 ? 'bg-slate12' : 'bg-[#2c3238]'}`}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
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
