"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import { fetchCountries, fetchTableData } from "@/lib/api";
import { TableRow } from "@/types/table";
import { columns as columnFactory } from "./columns";
import LoadingSpinner from "../loading";

export default function Table() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TableRow[], Error>({
    queryKey: ["table-data"],
    queryFn: fetchTableData,
  });

  // Fetch countries using react-query
  const {
    data: countriesApi = [],
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const columns = useMemo(
    () =>
      columnFactory({
        onToggleFilter: () => setOpen((prev) => !prev),
      }),
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const countryColumn = table.getColumn("country");

  // Use API countries if available, else fallback to table data
  const countries = useMemo(
    () =>
      countriesApi.length > 0
        ? countriesApi.filter((c: any) => c.name).map((c: any) => c.name)
        : Array.from(new Set(data.map((d) => d.country).filter(Boolean))) as string[],
    [countriesApi, data]
  );

  // show spinner while loading
  if (isLoading || isCountriesLoading) {
    return <LoadingSpinner />;
  }

  // show error state with retry
  if (isError) {
    const message = (error as Error)?.message ?? "Something went wrong.";
    return (
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm h-48 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-red-600 mb-3">Error: {message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Country dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-56 z-50 w-52 bg-white rounded-md shadow-md border border-gray-300 p-4"
        >
          <div className="max-h-32 overflow-y-auto space-y-4 scrollbar-hide">
            {countries.map((country) => {
              const current =
                (countryColumn?.getFilterValue() as string[]) || [];

              return (
                <label
                  key={country}
                  className="flex items-center gap-3 text-purple-deep text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-gray-300 accent-[#CFCDD6] focus:ring-indigo-500"
                    checked={current.includes(country)}
                    onChange={(e) => {
                      countryColumn?.setFilterValue(
                        e.target.checked
                          ? [...current, country]
                          : current.filter((v) => v !== country)
                      );
                    }}
                  />
                  {country}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="text-grey-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="h-14">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b border-gray-300 p-3 text-left font-medium min-w-24 max-w-145">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-200 text-black-soft">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 h-16">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 tracking-[0.25px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
