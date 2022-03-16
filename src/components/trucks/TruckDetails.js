import moment from "moment"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { TruckRepository } from "../../repositories/TruckRepository"
import { QueryMaps } from "../../utilities/QueryMaps"

export const TruckDetails = () => {
    const history = useHistory()
    const { truckId } = useParams()
    const [truck, setTruck] = useState({})

    const syncTruck = () => {
        TruckRepository.retrieve(truckId)
            .then(setTruck)
    }

    useEffect(() => {
        syncTruck()
    }, [truckId])

    const generateEndorsementList = () => {
        const endorsementLabelArr = []
        if (truck.endorsements?.length > 0) {
            for (const endorsement of truck.endorsements) {
                endorsementLabelArr.push(endorsement.label)
            }
            return endorsementLabelArr.join(", ")
        }
    }
    const displayEndorsementList = generateEndorsementList()


    const drawRoute = () => {
        let url = ""
        url = QueryMaps(truck.current_city, truck.current_state)
        window.open(url)
    }

    const handleRetire = () => {
        if (truck.is_active) {
            if (window.confirm(`Are you sure you want to retire truck #${truckId} (${truck.alias})?`) === true)
                TruckRepository.retire(truckId, truck)
                    .then(syncTruck)
                }
                else {
            if (window.confirm(`Are you sure you want to reactivate truck #${truckId} (${truck.alias})?`) === true)
                TruckRepository.retire(truckId, truck)
                    .then(syncTruck)
        }
    }

    const generateTruckStatus = () => {
        const status = truck.current_load?.load_status?.label

        if (truck.is_active) {
            if (truck.is_assigned) {
                return status
            }
            else {
                return 'Unassigned'
            }
        }
        else {
            return 'Retired'
        }
    }
    const truckStatus = generateTruckStatus()

    return (
        <div className={truck.is_active ? "box mx-auto" : "box mx-auto has-background-red-light has-text-grey-light"} style={{ width: "50%" }}>
            <div className="title">{truck.is_active ? `Truck #${truck.id} details` : `Truck #${truck.id} details (RETIRED)`}</div>
            <div className="is-size-5 py-2">Truck ID: {truck.id}</div>
            <div className="is-size-5 py-2">Alias: {truck.alias}</div>
            <div className="is-size-5 py-2">Current trailer: {truck.trailer_type?.label}</div>
            <div className="is-size-5 py-2">Current city: {truck.is_active ? truck.current_city : "N/A"}</div>
            <div className="is-size-5 py-2">Current state: {truck.is_active ? truck.current_state : "N/A"}</div>
            <div className="is-size-5 py-2">Status: {truckStatus}</div>
            <div className="is-size-5 py-2">Endorsements: {truck.endorsements?.length > 0 ? displayEndorsementList : "None"}</div>
            <div className="is-size-5 py-2">Driving since: {moment(truck.created_on).format('ll')}</div>
            {
                truck.is_active !== true
                    ?
                    <div className="is-size-5 py-2">Retired on: {moment(truck.retired_on).format('ll')}</div>
                    : ""
            }
            <div className="is-size-5 py-2">Load count: 🙃</div>
            <div className="py-4">
                {
                    truck.truck_status?.label !== "Delivered"
                        ?
                        truck.is_active
                            ?
                            <button onClick={drawRoute} className={"button btn-large has-background-grey has-text-white"}>Locate truck</button>
                            :
                            <button disabled onClick={drawRoute} className={"button btn-large has-background-grey has-text-white"}>Locate truck</button>
                        : ""
                }
            </div>
            <div className="py-4">
                <button onClick={() => history.push(`/trucks/${truckId}/edit`)} className="button mr-4 is-dark">Edit</button>
                {
                    truck.is_active
                        ?
                        <button onClick={handleRetire} className="button is-danger">Retire</button>
                        :
                        <button onClick={handleRetire} className="button is-danger">Un-retire</button>
                }
            </div>
        </div>
    )
}