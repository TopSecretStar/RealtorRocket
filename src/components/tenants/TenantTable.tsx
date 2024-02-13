import {ColumnDef} from "@tanstack/react-table";
import {Tenant} from "../../utils/classes.ts";
import {Checkbox} from "../ui/checkbox.tsx";
import {dateParser} from "../../utils/formatters.js";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu.tsx";
import {Button} from "../ui/button.tsx";
import {MoreHorizontal, Pencil, Send, Trash2, UserRound} from "lucide-react";
import {DataTable} from "../ui/data-table.js";
import {Avatar, AvatarFallback} from "../ui/avatar.tsx";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUnitsByLeaseIds, selectUnitsByTenantId} from "../../services/slices/objectSlice.js";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/tooltip.tsx";
import {Badge} from "../ui/badge.tsx";
import {useDeleteTenantMutation} from "../../services/api/tenantApi.js";
import {isAfter, isBefore} from "date-fns";


const TenantTable = ({tenants}) => {
    const navigate = useNavigate();

    const [deleteTenant, {isLoading: isDeletingTenant}] = useDeleteTenantMutation()


    // Get all lease ids of our tenants
    const leaseIds = tenants?.map(tenant => tenant.leases[0].id);

    const relevantUnits = useSelector((state) => selectUnitsByLeaseIds(state, leaseIds));

    const mappedTenants = tenants?.map(tenant => {
        const unit = relevantUnits.find(unit => unit?.leases.map(lease => {
            return lease.id}).includes(tenant.leases[0].id))
        return {...tenant, unit}
    })

    // True if the user has an active lease (end date is after today or no end date at all)
    const getActiveLeases = (leases) => {
        return leases.filter(lease => {
            return isAfter(new Date(lease.endDate), new Date()) || !lease.endDate
        })
    }

    const TenantOptions = ({tenant}) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <MoreHorizontal className="h-5 w-5"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex flex-row text-sm gap-2" onClick={() => navigate(`/tenants/${tenant?.id}`)}>
                            <UserRound className="w-4 h-4 "/>
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-row text-sm gap-2" disabled>
                            <Pencil className="w-4 h-4"/>
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex flex-row text-sm gap-2 text-red-500"
                                          onClick={() => deleteTenant(tenant?.id)}
                        >
                            <Trash2 className="w-4 h-4"/>
                            Delete Tenant
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                </DropdownMenuContent>
            </DropdownMenu>
        )
    }


    const columns: ColumnDef<Tenant>[] = [
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
            id: "tenant",
            header: "Tenant",
            enableSorting: false,
            cell: ({ row }) => {

                const tenant = row.original;

                return (
                    <div className="flex flex-row items-center gap-2">
                        <Avatar className="cursor-pointer hover:border-2 hover:border-indigo-500" onClick={() => navigate("/tenants/" + tenant?.id)}>
                            <AvatarFallback>{tenant?.firstName[0]?.toUpperCase()}{tenant?.lastName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-500 text-md ">
                                {tenant?.firstName + " " + tenant?.lastName}
                            </p>
                            <p className="font-300 text-gray-500 text-sm">
                                {tenant?.email}
                            </p>
                        </div>
                    </div>
                )
            },
            meta: {
                type: "string"
            }
        },
        {
            accessorKey: "leaseStatus",
            header: "Lease Status",
            enableSorting: true,
            cell: ({ row }) => {
                const tenant = row.original;


                const getLeaseText = (lease) => {
                    if (lease?.endDate && isBefore(new Date(lease?.endDate), new Date())) {
                        return "Lease Ended on " + dateParser(lease?.endDate)
                    }
                    else if (lease?.endDate) {
                        return "Lease Ends on " + dateParser(lease?.endDate)
                    }
                    else {
                        return "No Lease End Date"
                    }
                }

                const activeLeases = getActiveLeases(tenant?.leases);

                return (
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-col">
                            <p className="font-500 text-md ">
                                {activeLeases.length ? "Active" : "Inactive"}
                            </p>
                            <p className="font-300 text-gray-500 text-sm">
                                {tenant?.leases?.length ? getLeaseText(tenant?.leases[0]) : "No Lease"}
                            </p>
                        </div>
                    </div>
                )
            },
            meta: {
                type: "string"
            },
            accessorFn: (row) => {
                const activeLeases = getActiveLeases(row?.leases);
                return activeLeases.length ? "Active" : "Inactive"
            }
        },
        {
            id: "mostRecentUnit",
            header: "Most Recent Unit",
            enableSorting: true,
            cell: ({ row }) => {
                const tenant = row.original;

                // @ts-expect-error - We added this above by mapping the tenants
                const mostRecentUnit = tenant.unit;



                return (
                    <div className="flex flex-col justify-center">
                        <p className="font-500 text-md text-gray-800">
                            {tenant?.leases?.length ? mostRecentUnit?.unitIdentifier : "No Lease"}
                        </p>
                    </div>
                )
            },
            meta: {
                type: "string"
            },
            accessorFn: (row) => {
                // @ts-expect-error - We added this above by mapping the tenants
                return row.unit?.unitIdentifier || undefined
            }
        },
        {
            accessorKey: "user",
            header: "User",
            cell: ({ row }) => {
                return (
                    <div className="flex w-fit items-start flex-col gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <Badge variant="negative" className="h-fit whitespace-nowrap" >
                                            Unverified Tenant
                                        </Badge>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        This tenant has not created an account yet.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button variant="indigo" size="md">
                            <Send className="mr-2 w-3 h-3"/>
                            Contact
                        </Button>
                    </div>
                )
            },
            meta: {
                type: "string"
            },
            enableSorting: true,
            accessorFn: (row) => row.userId ? "Verified" : "Unverified"
        },
        {
            id: "createdAt",
            header: "Created At",
            enableSorting: true,
            cell: ({ row }) => <div className="lowercase">{dateParser(row.getValue("createdAt"))}</div>,
            meta: {
                type: "date"
            },
            accessorFn: (row) => new Date(row.createdAt)
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const tenant = row.original

                return (
                    <TenantOptions tenant={tenant}/>
                )
            },
        },
    ]


    return (
        <DataTable
            data={mappedTenants}
            columns={columns}
            defaultSort={{id: "leaseStatus", desc: false}}
        />
    )
}

export default TenantTable;