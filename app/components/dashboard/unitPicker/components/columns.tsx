import {
  ColumnDef,
  FilterFn,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table'
import React from 'react'
import {
  rankItem,
  compareItems,
  RankingInfo,
} from '@tanstack/match-sorter-utils'
import { Button, Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, } from "~/components/ui/index";
import { Cross2Icon, CaretSortIcon, CalendarIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import IndeterminateCheckbox from '~/components/shared/shared'
export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className='border-primary'
      />
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
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("make")}</div>,
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
    cell: ({ row }) => <div className="uppercase">{row.getValue("model")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("modelName")}</div>,
  },
  {
    filterFn: fuzzyFilter,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("submodel")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("price")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("exteriorColor")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("mileage")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("consignment")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("onOrder")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("expectedOn")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("status")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("orderStatus")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("vin")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("age")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("floorPlanDueDate")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("location")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("isNew")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("keyNumber")}</div>,
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
    cell: ({ row }) => <div className="lowercase ">{row.getValue("sold")}</div>,
  },
  {
    accessorKey: "packageNumber",
    header: "Package Number",
    id: 'packageNumber',
    cell: info => info.getValue(),
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

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]! as RankingInfo,
      rowB.columnFiltersMeta[columnId]! as RankingInfo
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export type TableMeta = { updateData: (rowIndex: number, columnId: string, value: unknown) => void }

// Give our default column cell renderer editing superpowers!
export const defaultColumn = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      ; (table.options.meta as TableMeta).updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
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
export const getTableMeta = (setData: React.Dispatch<React.SetStateAction<Person[]>>, skipAutoResetPageIndex: () => void) =>
  ({
    updateData: (rowIndex, columnId, value) => {
      // Skip age index reset until after next rerender
      skipAutoResetPageIndex()
      setData(old =>
        old.map((row, index) => {
          if (index !== rowIndex) return row

          return {
            ...old[rowIndex]!,
            [columnId]: value,
          }
        })
      )
    },
  }) as TableMeta
