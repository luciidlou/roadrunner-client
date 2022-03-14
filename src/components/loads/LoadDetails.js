import moment from "moment"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { LoadRepository } from "../../repositories/LoadRepository"
import { QueryMaps } from "../../utilities/QueryMaps"

export const LoadDetails = ({ syncLoads }) => {
    const { loadId } = useParams()
    const [load, setLoad] = useState({})
    const history = useHistory()

    useEffect(() => {
        LoadRepository.retrieve(loadId)
            .then(setLoad)
    }, [loadId])

    const generateFreightTypeList = () => {
        const freightTypeLabelArr = []
        if (load.freight_types?.length > 0) {
            for (const freight of load.freight_types) {
                freightTypeLabelArr.push(freight.label)
            }
            return freightTypeLabelArr.join(", ")
        }
        else {
            return "Freight not defined"
        }
    }

    const displayFreightTypeList = generateFreightTypeList()


    const checkIfHazardous = () => {
        const freightTypeLabelArr = []
        if (load.freight_types?.length > 0) {
            for (const freight of load.freight_types) {
                freightTypeLabelArr.push(freight.endorsement?.letter)
            }
            if (freightTypeLabelArr.includes("H")) {
                return true
            }
        }
        else {
            return false
        }
    }

    const isHazardous = checkIfHazardous()

    const displayPickupLocation = `${load.pickup_address} ${load.pickup_city}, ${load.pickup_state}`
    const displayDropoffLocation = `${load.dropoff_address} ${load.dropoff_city}, ${load.dropoff_state}`
    const pickupDateTime = moment(load.pickup_datetime).format('llll')
    const dropoffDateTime = moment(load.dropoff_datetime).format('llll')

    const drawRoute = () => {
        const url = QueryMaps(load.pickup_city, load.pickup_state, load.dropoff_city, load.dropoff_state)
        window.open(url)
    }

    const handleDelete = () => {
        LoadRepository.delete(loadId)
            .then(syncLoads)
            .then(() => history.push("/loadboard"))
    }

    return (
        <div className="box mx-auto" style={{ width: "50%" }}>
            <div className="title">Load #{load.id} details</div>
            <div className="is-size-5 py-2">Distributor: {load.distributor?.company}</div>
            <div className="is-size-5 py-2">Freight Types: {displayFreightTypeList}</div>
            <div className="is-size-5 py-2">Pickup location: {displayPickupLocation}</div>
            <div className="is-size-5 py-2">Pickup date/time: {pickupDateTime}</div>
            <div className="is-size-5 py-2">Dropoff location: {displayDropoffLocation}</div>
            <div className="is-size-5 py-2">Dropoff date/time: {dropoffDateTime}</div>
            <div className="is-size-5 py-2">Distance (mi): {load.distance}</div>
            <div className="is-size-5 py-2">Hazardous? {isHazardous ? "Yes" : "No"}</div>
            <div className="py-4">
                <button onClick={drawRoute} className="button is-info">Calculate route</button>
            </div>
            {
                load.is_owner
                    ?
                    <div className="py-4">
                        <button onClick={() => history.push(`/loads/${loadId}/edit`)} className="button mr-4 is-dark" style={{ width: '80px' }}>Edit</button>
                        <button onClick={handleDelete} className="button is-danger" style={{ width: '80px' }}>Delete</button>
                    </div>
                    : ""
            }
        </div>
    )
}