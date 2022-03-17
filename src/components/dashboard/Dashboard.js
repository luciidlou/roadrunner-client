import moment from "moment"
import { useEffect, useState } from "react"
import { LoadRepository } from "../../repositories/LoadRepository"
import { QueryMaps } from "../../utilities/QueryMaps"
import "./Dashboard.css"

export const Dashboard = () => {
    const [bookedLoads, setBookedLoads] = useState([])

    useEffect(() => {
        LoadRepository.booked()
            .then(setBookedLoads)
    }, [])

    const drawRoute = (load) => {
        let url = ""
        if (load.load_status?.label === "Routing to pickup" || load.load_status?.label === "Delivered") {
            url = QueryMaps(load.pickup_city, load.pickup_state, load.dropoff_city, load.dropoff_state)
        }
        else if (load.load_status?.label === "Waiting to load" || load.load_status?.label === "Loading") {
            url = QueryMaps(load.pickup_city, load.pickup_state)
        }
        else if (load.load_status?.label === "Waiting to unload" || load.load_status?.label === "Unloading") {
            url = QueryMaps(load.dropoff_city, load.dropoff_state)
        }
        window.open(url)
    }

    const locateTruck = (load) => {
        let url = ""
        url = QueryMaps(load.assigned_truck?.current_city, load.assigned_truck?.current_state)
        window.open(url)
    }

    const generateRouteProgress = (load) => {
        if (load.load_status?.label === "Routing to pickup") {
            return <progress className="progress is-small is-primary" max="100">15%</progress>
        }
        else {
            return `HEY YOU NEED TO FINISH WRITING THIS FUNCTION`
        }
    }

    return (
        <>
            <div className="is-size-2 mb-5" style={{ borderBottom: "1px solid black" }}>Dashboard</div>
            <div className="is-flex is-justify-content-space-around">
                {
                    bookedLoads.map(l => {
                        const pickupDatetime = `${moment.utc(l.pickup_datetime).format('dddd')} ${moment.utc(l.pickup_datetime).format('ll')} @ ${moment.utc(l.pickup_datetime).format('LT')}`
                        const dropoffDatetime = `${moment.utc(l.dropoff_datetime).format('dddd')} ${moment.utc(l.dropoff_datetime).format('ll')} @ ${moment.utc(l.dropoff_datetime).format('LT')}`

                        return (
                            <div key={l.id} className="card my-3 " style={{ width: "40%" }}>
                                <div className="card-content">
                                    <div className="content">
                                        <div className="title is-3" style={{ marginBottom: "0px" }}>Load #{l.id}</div>
                                        <div className="is-size-5 mt-2 mb-3 is-italic">{l.pickup_city}, {l.pickup_state} ➡ {l.dropoff_city}, {l.dropoff_state}</div>
                                        <div className="is-size-5 my-3">Pickup on: {pickupDatetime}</div>
                                        <div className="is-size-5 my-3">Dropoff on: {dropoffDatetime}</div>
                                        <div className="is-size-5 my-3">Distributor: {l.distributor?.company}</div>
                                        <div className="is-size-5 my-3">Dispatcher: {l.assigned_truck?.dispatcher?.company}</div>
                                        <div className="is-size-5 my-3">Driver: {l.assigned_truck?.alias} ({l.assigned_truck?.current_city}, {l.assigned_truck?.current_state})</div>
                                        <div className="is-size-5 my-3">Status: {l.load_status?.label}</div>
                                        {generateRouteProgress(l)}
                                    </div>
                                    <button onClick={() => drawRoute(l)} className="button btn-large has-background-grey has-text-white mr-2">View route</button>
                                    <button onClick={() => locateTruck(l)} className="button btn-large has-background-grey has-text-white mr-2">Locate truck</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}