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

export default function UnitPicker({ finance, tableData }) {


  console.log(finance, tableData, 'unitpicker')
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
        <StockUnit tableData={tableData} finance={finance} />
      </DialogContent>
    </Dialog>

  )
}
