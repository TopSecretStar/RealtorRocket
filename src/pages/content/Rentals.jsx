
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button} from "../../components/ui/button.tsx";
import {Plus, PlusIcon} from "lucide-react";
import RentalTable from "../../components/rentals/RentalTable.tsx";
import {selectTenantByLeaseId, selectUnitsByPropertyId} from "../../services/slices/objectSlice.js";


const Rentals = (props) => {
    const {propertySelection} = props;

    const navigate = useNavigate();
    const units = useSelector((state) => selectUnitsByPropertyId(state, propertySelection));


    if (!units || units.length === 0)  return (
        <div className="flex flex-col gap-4">
            You don't have any rental properties yet. You can create one by adding a new property using the button below.
            <Button variant="gradient" className="w-fit"
                    onClick={() => navigate("/properties/create")}
            >
                <Plus size={24} className="mr-2"/>
                Create Property
            </Button>
        </div>
    )

    return (
        <>
            <h1>
                Rental Units
            </h1>


            <div className="text-md mb-3">
                These are your rental properties, so the units of each property are displayed here. You can filter the units by property using the dropdown above.

            </div>

                <RentalTable units={units} />
        </>

    )
}

export default Rentals;