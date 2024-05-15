/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, Outlet, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import * as Toast from '@radix-ui/react-toast';
import { Overview } from './_authorized.overview.$brandId'
import { RemixNavLink, Input, Separator, Button, TextArea, Label, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, CardContent, Card, CardHeader } from "~/components";
import { getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';
import { ActionFunction, json } from "@remix-run/node";
import { getClientFileById } from "~/utils/finance/get.server";
import { toast } from "sonner"
import React, { useState } from "react";
import { getExpandedRowModel, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, sortingFns } from "@tanstack/react-table";
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'
import { prisma } from "~/libs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
//import { authenticator } from "~/services";
import { model } from "~/models";
import { getSession } from "~/sessions/auth-session.server";


export async function loader({ request }) {
  const session = await getPref(request.headers.get("Cookie"))
  const clientfileId = session.get('clientfileId')
  const financeId = session.get('financeId')
  const finance = await getMergedFinanceOnFinance(financeId)
  const clientFile = await getClientFileById(clientfileId)
  return json({ clientFile, finance, })
}
export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  let formData = financeFormSchema.parse(formPayload)
  const intent = formData.intent
  const userId = user?.id
  const clientfileId = session.get('clientfileId')
  let financeId = formData.financeId

  if (!financeId) {
    financeId = session.get('financeId')
  }

  const notiFinance = await prisma.finance.findUnique({
    where: {
      id: financeId
    },
  });
  if (intent === 'createOrder') {
    let partNumbers = formData["partNumbers[]"];

    console.log(formData)
    try {
      // Create the PartsOrder first
      let partsOrder = await prisma.partsOrder.create({
        data: {
          userId: userId,
          clientfileId: clientfileId,
        },
      });

      // Then create a PartsOrderDetail for each part number
      for (let partNumber of partNumbers) {
        await prisma.partsOrderDetail.create({
          data: {
            orderNumber: partsOrder.orderNumber,
            partNumber,
          },
        });
      }

      return partsOrder
    } catch (error) {
      console.error(error);
      // Handle the error appropriately here
    } finally {
      // this code runs whether an error occurred or not
    }
  }
  return ('didnt work')
}
export function PartsTab({ timerRef, open, setOpen, user, }) {
  let fetcher = useFetcher();
  const { finance, clientFile } = useLoaderData()
  return (
    <div className="grow p-5 rounded-tl-md bg-myColor-900 text-[#fafafa] rounded-b-md outline-none  focus:shadow-black"
    >
      <div className="mb-8 grid grid-cols-1">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"  >
          <div className="rounded-t bg-[#09090b] mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-[#fafafa] text-xl font-bold uppercase">
                Order
              </h6>
            </div>
          </div>
          <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">
            <SearchTable />

          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0"  >
          <div className="rounded-t bg-[#09090b] mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-[#fafafa] text-xl font-bold uppercase">
                Purchasing
              </h6>
            </div>
          </div>
          <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">
            <fetcher.Form method="post">
              <Input type="hidden" defaultValue={finance[0].id} name="financeId" />
              <Input type="hidden" defaultValue={finance[0].id} name="id" />
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase mt-2 text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      className="w-full  rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                      defaultValue={finance[0].brand}
                      name='brand'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase mt-2 text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      model
                    </label>
                    <input
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].model}
                      name='model'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      year
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].year}
                      name='year'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Trim
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].trim}
                      name='trim'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Stock Number
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].stockNum}
                      name='stockNum'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Model Code
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].modelCode}
                      name='modelCode'
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].color}
                      name='color'
                    />
                  </div>
                </div>
                <div className="w-full  px-4">

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#fafafa] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      vin
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 h-8 bg-[#09090b] px-3 py-3 text-sm text-[#fafafa] placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#02a9ff]"
                      defaultValue={finance[0].vin}
                      name='vin'
                    />
                  </div>
                </div>
                <Toast.Provider swipeDirection="right">
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.clearTimeout(timerRef.current);
                      timerRef.current = window.setTimeout(() => {
                        setOpen(true);
                      }, 100);
                    }}
                    type="submit" name='intent' value='updateWantedUnit'
                    className="bg-[#2ebb98] cursor-pointer  mt-3 ml-auto text-[#fafafa] active:bg-[#1b6e59] font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  >
                    Update
                  </button>
                  <Toast.Root open={open} onOpenChange={setOpen} className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                    <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-[#fafafa] text-[15px]">
                      {finance[0].firstName}'s File Updated.
                    </Toast.Title>
                    <Toast.Description asChild>
                    </Toast.Description>
                  </Toast.Root>
                  <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
                </Toast.Provider>
              </div>
            </fetcher.Form>


          </div>
        </div>
      </div>

    </div>
  )
}


export function SearchTable() {
  const { parts } = useLoaderData();
  const data = parts
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
    React.useState<VisibilityState>({
      id: false,
      cost: false,
      subCategory: false,
    })
  const [rowSelection, setRowSelection] = React.useState({})

  const [inputValues, setInputValues] = useState({});

  const handleInputChangePurchase = (rowId, value) => {
    setInputValues(prevState => ({ ...prevState, [rowId]: value }));
  };
  const [currentInputValues, setcurrentInputValues] = useState('')
  const [savedValues, setSavedValues] = useState([]);

  React.useEffect(() => {
    console.log(savedValues);
    console.log(rowSelection, currentInputValues);

  }, [rowSelection, currentInputValues]);

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
      accessorKey: "partNumber",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              partNumber
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center  lowercase">
        {row.getValue("partNumber")}
      </div>

    },

    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "brand",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              brand
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center  lowercase">
        {row.getValue("brand")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("name")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              price
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("price")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "cost",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              cost
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("cost")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              quantity
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("quantity")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              description
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("description")}
      </div>,
    },

    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              category
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("category")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "subCategory",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              subCategory
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        {row.getValue("subCategory")}
      </div>,
    },
    {
      accessorKey: "purchaseAmount",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Amount
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-center lowercase">
        <Input
          name='purchaseAmount'
          className='text-black w-[50px] mx-auto'
          value={inputValues[row.id] || ''}
          onChange={e => handleInputChangePurchase(row.id, e.target.value)}
        />
      </div>

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

  const total = savedValues.reduce((sum, item) => sum + item.row.price * Object.values(item.inputs)[0], 0);


  return (
    <div className="mx-auto w-[95%] ">
      <div className="flex items-center py-4">
        <Input
          value={globalFilter ?? ''}
          onChange={event => setGlobalFilter(event.target.value)}
          className="font-lg border-block w-[400px] border border-[#878787] bg-[#363a3f] p-2 text-[#fff] shadow"
          placeholder="Search all columns..."
        />
        <Input
          placeholder={`Search part # ...`}
          value={
            (table.getColumn('partNumber')?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn('partNumber')?.setFilterValue(event.target.value)
          }
          className="ml-2 max-w-sm border-[#878787] bg-[#363a3f] text-[#fff]"
        />


        <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className="active:bg-black  mx-2 my-auto h-7  cursor-pointer rounded bg-[#09090b] px-3 py-2  text-center text-xs  font-bold uppercase text-[#fafafa] shadow outline-none  transition-all duration-150 ease-linear hover:border-[#02a9ff]  hover:text-[#02a9ff] hover:shadow-md focus:outline-none"
        >
          Clear
        </Button>
      </div>
      <div className="rounded-md border border-[#262626] ">
        <Table2 className='w-full overflow-x-auto border-[#262626] text-[#fafafa]'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-[#262626]'>
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
                        <div className="mx-auto cursor-pointer items-center justify-center border-[#262626] text-center">
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
                  className='cursor-pointer border-[#262626] bg-[#09090b] p-4 capitalize text-[#fafafa] hover:text-[#02a9ff]'
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
                  <TableCell>
                    <Button name='add' className='text-[#fafafa]' variant='outline' onClick={() => {
                      setRowSelection(row.original)
                      setcurrentInputValues(inputValues)
                      setSavedValues(prevValues => [...prevValues, { row: row.original, inputs: inputValues }])
                      setInputValues({})
                    }}>Add</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 cursor-pointer bg-[#09090b] text-center capitalize text-[#fafafa] hover:text-[#02a9ff]"
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
            className="border-slate1 text-[#fafafa]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            className="border-slate1 text-[#fafafa]"

            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div>
        <Card className="bg-[#09090b] w-[50%]">
          <CardHeader>
            Order Details
          </CardHeader>
          <CardContent>

            <div className='grid grid-cols-5 '>
              <p>Name</p>
              <p>Price</p>
              <p>partNumber</p>

              <p>Quantity</p>
              <p>Item Total</p>

            </div>
            <Form method='post'>
              {savedValues.map((item, index) => (
                <div key={index}>

                  <div className="grid grid-cols-5 ">
                    <p className='mx-auto'>{item.row.name}</p>
                    <p className='mx-auto'>{item.row.price}</p>
                    <p className='mx-auto'>{item.row.partNumber}</p>
                    <input type='hidden' name='partNumber' defaultValue={item.row.partNumber} />
                    <input type='hidden' name='quantity' defaultValue={Object.values(item.inputs)[0]} />
                    <p className='mx-auto'>{Object.values(item.inputs)[0]}</p>
                    <p className='mx-auto'>{item.row.price * Object.values(item.inputs)[0]}</p>
                  </div>
                </div>
              ))}
              <p className='mt-5'>Total: {total}</p>
              <p className=''>After Tax: {total}</p>
              <Button variant='outline' type='submit' value='createOrder' name='intent'>
                Create Order
              </Button>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>
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
