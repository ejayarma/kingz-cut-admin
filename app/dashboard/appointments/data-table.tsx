// components/data-table.tsx

"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    VisibilityState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { DataTablePagination } from "@/components/data-table-pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility
        },
    })

    // Get unique values for filter dropdowns
    const uniqueStatuses = Array.from(
        new Set(data.map((item: any) => item.status))
    ).filter(Boolean)

    const uniqueBookingTypes = Array.from(
        new Set(data.map((item: any) => item.bookingType))
    ).filter(Boolean)

    const clearFilters = () => {
        table.resetColumnFilters()
    }

    const hasActiveFilters = columnFilters.length > 0

    return (
        <div>
            <div className="flex flex-col space-y-4 py-4">
                {/* Main search and view options */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Filter customers..."
                            value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("customerName")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        {/* Status Filter */}
                        <Select
                            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                            onValueChange={(value) =>
                                table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {uniqueStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        <div className="flex items-center space-x-2">
                                            <span className="capitalize">{status}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Booking Type Filter */}
                        <Select
                            value={(table.getColumn("bookingType")?.getFilterValue() as string) ?? ""}
                            onValueChange={(value) =>
                                table.getColumn("bookingType")?.setFilterValue(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {uniqueBookingTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        <span className="capitalize">
                                            {type === 'homeService' ? 'Home Service' : 'Walk-in Service'}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Clear filters button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="h-8 px-2 lg:px-3"
                            >
                                Reset
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <DataTableViewOptions table={table} />
                </div>

                {/* Active filters display */}
                {hasActiveFilters && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {columnFilters.map((filter) => (
                            <Badge key={filter.id} variant="secondary" className="rounded-sm px-1 font-normal">
                                {filter.id}: {filter.value as string}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            table.getColumn(filter.id)?.setFilterValue("")
                                        }
                                    }}
                                    onClick={() => table.getColumn(filter.id)?.setFilterValue("")}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-teal-600">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-3">
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}