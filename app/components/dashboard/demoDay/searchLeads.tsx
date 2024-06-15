import React, { useEffect, useState } from "react"
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons"
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, Table as Table2, Column, SortingFn, FilterFn, ExpandedState, FilterFns,
  sortingFns,
} from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import { Form, Link, useActionData, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "~/components/ui/dialog"
import { toast } from "sonner"
import { ButtonLoading } from "~/components/ui/button-loading";
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { ChevronsUpDown, FilePlus, Save, Trash2, Voicemail } from "lucide-react"
import { Target, X } from 'lucide-react';
import DialogTest from "./dialogTest"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components"
import { rankItem, compareItems } from "@tanstack/match-sorter-utils"
import { prisma } from "~/libs"

export default function SearchLeads() {
  const { user } = useLoaderData();
  const { searchData } = useLoaderData();
  // const data = getDemoDay
  /**  const data: Payment[] = [
      {
        id: "m5gr84i9",
        status: "success",
        email: "ken99@yahoo.com",
        userEmail: 'skylerzanth@outlook.com',
        firstName: "ken",
        lastName: "holmes",
        phone: "6136136134",
        brand: "H-D",
        brand2: "H-D",
        model: "model1",
        model2: "model2",
        leadNote: "ken",
        notified: "no",
      },
      {
        id: "3u1reuv4",
        status: "success",
        email: "Abe45@gmail.com",
        userEmail: 'skylerzanth@outlook.com',
        firstName: "Abe",
        lastName: "lincoln",
        phone: "6136136134",
        brand: "H-D",
        brand2: "H-D",
        model: "model1",
        model2: "model2",
        leadNote: "ken",
        notified: "no",
      },
      {
        id: "derv1ws0",
        status: "processing",
        email: "Monserrat44@gmail.com",
        userEmail: 'skylerzanth@outlook.com',
        firstName: "timmy",
        lastName: "Monserrat",
        phone: "6136136134",
        brand: "H-D",
        brand2: "H-D",
        model: "model1",
        model2: "model2",
        leadNote: "ken",
        notified: "no",
      },
      {
        id: "5kma53ae",
        status: "success",
        email: "Silas22@gmail.com",
        userEmail: 'skylerzanth@outlook.com',
        firstName: "Sly",
        lastName: "Silas",
        phone: "6136136134",
        brand: "H-D",
        brand2: "H-D",
        model: "model1",
        model2: "model2",
        leadNote: "ken",
        notified: "no",
      },
      {
        id: "bhqecj4p",
        status: "failed",
        email: "carmella@hotmail.com",
        userEmail: 'skylerzanth@outlook.com',
        firstName: "carmella",
        lastName: "Bing",
        phone: "6136136134",
        brand: "H-D",
        brand2: "H-D",
        model: "model1",
        model2: "model2",
        leadNote: "ken",
        notified: "no",
      },
    ] */
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit()

  const [openPop, setOpenPop] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [models, setModels] = useState([]);
  const [brand, setBrand] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelList, setModelList] = useState();
  const [brandId2, setBrandId2] = useState('');
  const [modelList2, setModelList2] = useState();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadNote, setLeadNote] = useState("");
  const [notified, setNotified] = useState("");

  const [filterBy, setFilterBy] = useState('');
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  type Payment = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    model: string
    model2: string
    leadNote: string
    userEmail: string
    brand: string
    brand2: string
    notified: string
  }
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
              Phone #
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      },
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
              Brand
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
        {row.getValue("brand")}
      </div>,
    },
    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "model",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Model
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="mx-auto justify-center text-center  lowercase">
        {row.getValue("model")}
      </div>,
    },

    {
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      accessorKey: "financeId",
      header: ({ column }) => {
        return (
          <div className="mx-auto justify-center text-center lowercase">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              financeId
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const data = row.original


        return (
          <>
            <Form method='post' >
              <input type="hidden" name="rowId" value={row.id} />
              <input type="hidden" name="intent" value='navToFinanceFile' />
              <input type='hidden' name='clientfileId' defaultValue={data.id} />
              <Button size='sm' className='mx-auto bg-primary' >
                Client's file
              </Button>
            </Form>

          </>
        )
      },
    },

  ]

  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([])
    setFilterBy('')
    setGlobalFilter('')
  };
  const handleDropdownChange = (event) => {
    setGlobalFilter(event.target.value);
  };

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };
  const handleBrand2 = (e) => {
    setBrandId2(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/dealer/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }


    if (brandId.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList(result);
        console.log(brandId, result); // Log the updated result
      };
      fetchData();
    }
    if (brandId2.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList2(result);
        console.log(brandId2, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId, brandId2]);

  useEffect(() => {
    async function fetchModels() {
      const uniqueModels = [
        ...new Set(data.map(wishList => wishList.model)),
        ...new Set(data.map(wishList => wishList.model2)) // Add this line
      ];
      setModels(uniqueModels);
    }

    fetchModels();
  }, []);

  const updateEditingRow = (rowIndex, columnId, value) => {
    switch (columnId) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'email': setEmail(value); break;
      case 'phone': setPhone(value); break;
      case 'leadNote': setLeadNote(value); break;
      case 'notified': setNotified(value); break;
      default: break;
    }
  };
  const [data, setData] = useState([])
  useEffect(() => {
    if (searchData) {
      setData(searchData)
    }
  }, [searchData]);

  const defaultColumn: Partial<ColumnDef<Payment>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
      }

      return (
        <p className='text-center'>{value as string}</p>
      )
    }
  }
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },

  })
  return (
    <div className="mx-auto mt-[10px] w-[95%] justify-center text-foreground">
      <div className="flex items-center py-4 justify-between">
        <div className='flex'>
          <Input
            value={globalFilter ?? ''}
            onChange={event => setGlobalFilter(event.target.value)} className="font-lg border-[#262626] w-[400px] border border-[#262626] bg-background p-2 text-foreground shadow"
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
            className="ml-2 max-w-sm border-[#262626] bg-background p-2 text-foreground"
          />
          <select value={filterBy} onChange={handleDropdownChange}
            className={`border-[#262626] bg-background p-2 text-foreground placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border   px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
          >
            <option value='' >Search By Model</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>

          <Button onClick={() => setAllFilters([])} name='intent' type='submit' variant='outline' className={`border-[#262626] bg-background p-2 text-foreground placeholder:text-blue-300  mx-auto ml-2  h-8 cursor-pointer rounded border   px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary`}
          >
            Clear
          </Button>
        </div>

      </div>
      <div className="rounded-md border border-[#262626]">
        <Table className=" border-[#262626] text-foreground">
          <TableHeader className=" border-[#262626] text-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" border-[#262626] text-foreground">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody className=" border-[#262626] text-foreground">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (

                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=" border-[#262626] text-foreground hover:bg-muted/50 rounded-md w-[97%] cursor-pointer"
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
              <TableRow className=" border-[#262626] text-foreground">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border text-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border text-foreground"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
          <Form method='post'>
            <DialogHeader className="px-4 pb-4 pt-5">
              <DialogTitle>Edit Customer Profile Info</DialogTitle>
            </DialogHeader>
            <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
            <div className="grid gap-3 mx-3 mb-3">
              <div className="relative mt-3">
                <Input
                  defaultValue={data.firstName} name='firstName'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.lastName} name='lastName'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Last Name</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.phone} name='phone'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.email} name='email'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.brand} name='brand'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.model} name='model'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-foc
                us:text-blue-500">Model</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.brand2} name='brand2'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand 2</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.model2} name='model2'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model 2</label>
              </div>
              <div className="relative mt-3">
                <Input
                  defaultValue={data.leadNote} name='leadNote'
                  type="text"
                  className="w-full bg-background border-border "
                />
                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note</label>
              </div>
              <input type='hidden' name='id' defaultValue={data.id} />
              <input type='hidden' name='userEmail' defaultValue={user.email} />
              <ButtonLoading
                size="sm"
                value="demoDayEdit"
                className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                name="intent"
                type="submit"
                isSubmitting={isSubmitting}
                onClick={() => toast.success(`${data.firstName}'s customer file is being...`)}
                loadingText={`${data.firstName}'s customer file is updated...`}
              >
                Continue
                <PaperPlaneIcon className="h-4 w-4 ml-2" />
              </ButtonLoading>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
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

export function Filter({
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
export function DebouncedInput({
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

