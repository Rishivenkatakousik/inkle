import { createColumnHelper } from "@tanstack/react-table";
import { TableRow } from "@/types/table";
import { formatDate } from "@/lib/date";
import { CiFilter } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";


const columnHelper = createColumnHelper<TableRow>();

export const columns = ({ onToggleFilter }: { onToggleFilter: () => void }) => [
  columnHelper.accessor("entity", {
    header: "Entity",
    cell: (info) => (
      <span className="text-indigo-600 font-medium">
        {info.getValue() ?? "-"}
      </span>
    ),
  }),

  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";

      const normalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      const isMale = normalizedValue.toLowerCase() === "male";

      return (
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium
            ${
              isMale ? "bg-red-light text-red-dark" : "bg-blue-light text-blue-dark"
            }`}
        >
          {normalizedValue}
        </span>
      );
    },
  }),

  columnHelper.accessor("requestDate", {
    header: "Request date",
    cell: (info) => (
      <span className="text-black-soft">
        {formatDate(info.getValue())}
      </span>
    ),
  }),

  columnHelper.accessor("country", {
    header: () => (
      <div className="flex items-center justify-between">
        <span>Country</span>
        <button onClick={onToggleFilter}>
          <LuFilter className="h-5 w-5 text-indigo-600 cursor-pointer" />
        </button>
      </div>
    ),
    cell: (info) => (
      <span className="text-purple-deep">
        {info.getValue() ?? "-"}
      </span>
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  }),

  columnHelper.display({
    id: "actions",
    header: "",
    cell: () => (
      <button>
        <FiEdit className="h-4 w-4 text-grey-primary font-extrabold cursor-pointer" />
      </button>
    ),
  }),
];
