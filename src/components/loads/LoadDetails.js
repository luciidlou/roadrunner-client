import moment from "moment"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { LoadRepository } from "../../repositories/LoadRepository"
import { QueryMaps } from "../../utilities/QueryMaps"
import { BidForm } from "../bids/BidForm"
import expandIcon from "../../images/expandIcon.png"
import './LoadDetails.css'
export const LoadDetails = ({ syncLoads, userType, trucks }) => {
    const { loadId } = useParams()
    const [load, setLoad] = useState({})
    const [bidManager, toggleBidManager] = useState(false)
    const [isHovering, toggleIsHovering] = useState(false)
    const history = useHistory()

    const syncLoad = () => {
        LoadRepository.retrieve(loadId)
            .then(setLoad)
    }

    useEffect(() => {
        syncLoad()
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


    const drawRoute = () => {
        let url = ""
        if (load.is_booked === true) {
            if (load.load_status?.label === "Routing to pickup") {
                url = QueryMaps(load.assigned_truck?.current_city, load.assigned_truck?.current_state, load.pickup_city, load.pickup_state)
            }
            else if (load.load_status?.label === "Waiting to load" || load.load_status?.label === "Loading") {
                url = QueryMaps(load.pickup_city, load.pickup_state)
            }
            else if (load.load_status?.label === "On the road") {
                url = QueryMaps(load.assigned_truck?.current_city, load.assigned_truck?.current_state, load.dropoff_city, load.dropoff_state)
            }
            else if (load.load_status?.label === "Waiting to unload" || load.load_status?.label === "Unloading") {
                url = QueryMaps(load.pickup_city, load.pickup_state)
            }
        }
        else {
            url = QueryMaps(load.pickup_city, load.pickup_state, load.dropoff_city, load.dropoff_state)
        }
        window.open(url)
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete load #${loadId}?`) === true)
            LoadRepository.delete(loadId)
                .then(syncLoads)
                .then(() => history.push("/loadboard"))
    }

    const displayPickupLocation = `${load.pickup_address} ${load.pickup_city}, ${load.pickup_state}`
    const displayDropoffLocation = `${load.dropoff_address} ${load.dropoff_city}, ${load.dropoff_state}`
    const pickupDateTime = moment.utc(load.pickup_datetime).format('llll')
    const dropoffDateTime = moment.utc(load.dropoff_datetime).format('llll')


    return (
        <div className="box mx-auto" style={{ width: "65%" }}>
            <div className="title">Load #{load.id} details</div>
            <div className="is-size-5 py-2">Distributor: {load.distributor?.company}</div>
            <div className="is-size-5 py-2">Load status: {load.load_status === null ? "Not booked" : load.load_status?.label}</div>
            <div className="is-size-5 py-2">Freight Types: {displayFreightTypeList}</div>
            <div className="is-size-5 py-2">Pickup location: {displayPickupLocation}</div>
            <div className="is-size-5 py-2">Pickup date/time: {pickupDateTime}</div>
            <div className="is-size-5 py-2">Dropoff location: {displayDropoffLocation}</div>
            <div className="is-size-5 py-2">Dropoff date/time: {dropoffDateTime}</div>
            <div className="is-size-5 py-2">Distance (mi): {load.distance}</div>
            <div className="is-size-5 py-2">Hazardous? {isHazardous ? "Yes" : "No"}</div>
            <div className="py-4">
                {
                    load.load_status?.label !== "Delivered"
                        ?
                        <button onClick={drawRoute} className="button btn-large has-background-grey has-text-white">{load.is_booked ? 'Locate truck' : 'View route'}</button>
                        : ""
                }
            </div>
            {
                load.is_owner
                    ?
                    <div className="py-4">
                        <button onClick={() => history.push(`/loads/${loadId}/edit`)} className="button mr-4 is-dark">Edit</button>
                        <button onClick={handleDelete} className="button is-danger">Delete</button>
                    </div>
                    : ""
            }
            <div
                className={isHovering ? "box bid-macros-hover is-flex is-flex-direction-row is-justify-content-space-around" : "box bid-macros is-flex is-flex-direction-row is-justify-content-space-around"}
                style={{ width: "50%", margin: "2em 0" }}
                onClick={() => toggleBidManager(!bidManager)}>
                {
                    load.bid_macros?.count
                        ?
                        <>
                            <div className="is-size-5">Total bids: {load.bid_macros?.count}</div>
                            <div className="is-size-5">Highest bid: ${load.bid_macros?.max}</div>
                            <div className="is-size-5">Average bid: ${load.bid_macros?.avg}</div>
                            <div className="is-size-5">Lowest bid: ${load.bid_macros?.min}</div>
                            <div className="is-size-5">
                                <img
                                    className={bidManager ? "is-clickable expand-icon-rotate" : "is-clickable expand-icon"}
                                    onMouseEnter={() => toggleIsHovering(true)}
                                    onMouseLeave={() => toggleIsHovering(false)}
                                    src={expandIcon}
                                    alt="Expand icon" />
                            </div>
                        </>
                        :
                        <>
                            <div className="is-size-4">"No bids have been made yet!"</div>
                            <div className="is-size-5">
                                <img
                                    className={bidManager ? "is-clickable expand-icon-rotate" : "is-clickable expand-icon"}
                                    onMouseEnter={() => toggleIsHovering(true)}
                                    onMouseLeave={() => toggleIsHovering(false)}
                                    src={expandIcon}
                                    alt="Expand icon" />
                            </div>
                        </>
                }
            </div>

            {bidManager && <BidForm trucks={trucks} userType={userType} syncLoad={syncLoad} />}

        </div>
    )
}