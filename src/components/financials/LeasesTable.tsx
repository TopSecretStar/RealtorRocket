import {
    ColumnDef,
} from "@tanstack/react-table";
import {Checkbox} from "../ui/checkbox.tsx";
import {dateParser, moneyParser} from "../../utils/formatters.js";
import {DataTable} from "../ui/data-table.js";
import {Lease} from "../../utils/classes.ts";
import {Scroll} from "lucide-react";
import {LeaseStatusBadge} from "../../utils/statusBadges.js";
import {LeaseStatus} from "../../utils/magicNumbers.js";
import Link from "../general/Link.tsx";




const columns: ColumnDef<Lease>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                // @ts-expect-error - TS doesn't understand that we're using a custom accessor
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "lease",
        header: "Lease",
        cell: ({ row }) => (
            <div className="capitalize">#{row?.original?.id}</div>
        ),
        meta: {
            type: "number",
        },
        accessorFn: (row) => row?.id || "",
        enableSorting: true,
    },
    {
        id: "tenant",
        header: "Tenant",
        cell: ({ row }) => {
            if (row?.original?.tenantId) {
                return (
                    <Link id={row.original.tenantId} type={"tenant"} />
                )
            }
            else {
                return (
                    <div className="capitalize text-red-600/90 font-500">No Tenant</div>
                )
            }
        },
        accessorFn: (row) => (row?.tenant?.firstName + row?.tenant?.lastName) || "",
        meta: {
            type: "string",
        },
        enableSorting: true,
    },
    {
        id: "startDate",
        header: "Start Date",
        meta: {
            type: "date",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {dateParser(row?.original?.startDate)}
                </div>
            )
        },
        accessorFn: (row) => row?.startDate || "",
        enableSorting: true,

    },
    {
        id: "endDate",
        header: "End Date",
        meta: {
            type: "date",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {dateParser(row?.original?.endDate)}
                </div>
            )
        },
        accessorFn: (row) => row?.endDate || "",
        enableSorting: true,
    },
    {
        id: "rentalPrice",
        header: "Rental Price",
        meta: {
            type: "string",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {moneyParser(row?.original?.rentalPrice)}
                </div>
            )
        },
        accessorFn: (row) => row?.rentalPrice || "",
        enableSorting: true,
    },
    {
        id: "unit",
        header: "Unit",
        cell: ({ row }) => {
            if (row?.original?.unitId) {
                return (
                    <Link id={row.original.unitId} type={"unit"}  />
                )
            }
            else {
                return (
                    <div className="capitalize text-red-500">No Unit</div>
                )
            }
        },
        accessorFn: (row) => row?.unit?.unitIdentifier || "",
        meta: {
            type: "string",
        },
        enableSorting: true,
    },
    {
        id: "status",
        header: "Status",
        meta: {
            type: "enum",
            options: Object.values(LeaseStatus)
        },
        cell: ({ row }) => {
            return (
                <LeaseStatusBadge status={row?.original?.status} />
            )
        },
        accessorFn: (row) => row?.status || undefined,
        enableSorting: true,
    },
    {
        id: "paymentFrequency",
        header: "Payment Frequency",
        meta: {
            type: "string",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row?.original?.paymentFrequency?.toLowerCase()}
                </div>
            )
        },
        accessorFn: (row) => row?.paymentFrequency || "",
        enableSorting: true,
    },
    {
        id: "notes",
        header: "Notes",
        meta: {
            type: "string",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row?.original?.notes}
                </div>
            )
        },
        accessorFn: (row) => row?.notes || "",
        enableSorting: true,
    },
    {
        id: "specialTerms",
        header: "Special Terms",
        meta: {
            type: "string",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row?.original?.specialTerms}
                </div>
            )
        },
        accessorFn: (row) => row?.specialTerms || "",
        enableSorting: true,
    },
    /*
    {
        id: "totalRentDue",
        header: "Total Rent Due",
        meta: {
            type: "number",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {moneyParser(row?.original?.totalRentDue)}
                </div>
            )
        },
        accessorFn: (row) => row?.totalRentDue || "",
        enableSorting: true,

    },
    {
        id: "totalRentPaid",
        header: "Total Rent Paid",
        meta: {
            type: "number",
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {moneyParser(row?.original?.rentPaid)}
                </div>
            )
        },
        accessorFn: (row) => row?.rentPaid || "",
        enableSorting: true,

    },
     */


]

const LeasesTable = ({ leases }) => {
    return (
        <div className={"border-2 border-border p-4 rounded-lg "}>

            <DataTable
                data={leases}
                columns={columns}
                title="Leases"
                subtitle="These are all your leases."
                icon={<Scroll className={"w-5 h-5"} />}
                defaultSort={{id: "lease", desc: true}}


            />
        </div>

    )
}

export default LeasesTable;