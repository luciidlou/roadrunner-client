import moment from "moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { LoadHistoryRepository } from "../../repositories/LoadHistoryRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import { LoadStatusRepository } from "../../repositories/LoadStatusRepository"
import { QueryMaps } from "../../utilities/QueryMaps"
import { StatesArray } from "../../utilities/StatesArray"
import "./Dashboard.css"

export const Dashboard = ({ userType }) => {
    const [bookedLoads, setBookedLoads] = useState([])
    const [loadStatuses, setLoadStatuses] = useState([])
    const [updater, toggleUpdater] = useState({
        open: false,
        loadId: 0
    })
    const [statusBuilder, setStatusBuilder] = useState({
        load_status: 0,
        truck: 0,
        current_city: null,
        current_state: null
    })

    const syncBookedLoads = () => {
        LoadRepository.booked()
            .then(setBookedLoads)
    }

    useEffect(() => {
        syncBookedLoads()
        LoadStatusRepository.list()
            .then(setLoadStatuses)
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
        else {
            url = QueryMaps(load.assigned_truck?.current_city, load.assigned_truck?.current_state, load.dropoff_city, load.dropoff_state)
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
            return <progress className="progress is-small is-primary mx-auto mb-5" style={{ width: "90%" }} max="100">15%</progress>
        }
        else if (load.load_status?.label === "Waiting to load" || load.load_status?.label === "Waiting to unload" || load.load_status?.label === "Loading" || load.load_status?.label === "Unloading") {
            return <progress className="progress is-small is-warning mx-auto mb-5" style={{ width: "90%" }} max="100">15%</progress>
        }
        else if (load.load_status?.label === "On the road") {
            return <progress className="progress is-small is-primary mx-auto mb-5" style={{ width: "90%" }} value="50" max="100">15%</progress>
        }
        else {
            return <progress className="progress is-small is-primary mx-auto mb-5" style={{ width: "90%" }} value="100" max="100">15%</progress>
        }
    }

    const handleOnChange = (event) => {
        const copy = { ...statusBuilder }
        copy[event.target.name] = event.target.value
        setStatusBuilder(copy)
    }

    const handleUpdateLoad = (loadId, status, truck) => {
        if ((!status.current_city && status.current_state) || (status.current_city && !status.current_state)) {
            window.alert("you can't update location without specifying both city and state")
        }
        else {
            statusBuilder.truck = truck.id
            LoadRepository.changestatus(loadId, status)
            LoadHistoryRepository.create({
                load: loadId,
                load_status: status.load_status,
                city: truck.current_city,
                state: truck.current_state
            })
                .then(syncBookedLoads)
                .then(() => toggleUpdater(false))
        }
    }

    return (
        bookedLoads.length
            ?
            <>
                <div className="is-size-2 mb-5" style={{ borderBottom: "1px solid black" }}>Dashboard</div>
                <div className="is-flex is-justify-content-space-around">
                    {
                        bookedLoads.map(l => {
                            const pickupDatetime = `${moment.utc(l.pickup_datetime).format('dddd')} ${moment.utc(l.pickup_datetime).format('ll')} @ ${moment.utc(l.pickup_datetime).format('LT')}`
                            const dropoffDatetime = `${moment.utc(l.dropoff_datetime).format('dddd')} ${moment.utc(l.dropoff_datetime).format('ll')} @ ${moment.utc(l.dropoff_datetime).format('LT')}`

                            return (
                                <div key={l.id} className="card my-3 " style={{ width: "40%" }}>
                                    <div className="columns">
                                        <div className="column">
                                            <div className="card-content">
                                                <div className="content">
                                                    <div className="title is-3" style={{ marginBottom: "0px" }}><Link to={`/loads/${l.id}`}>Load #{l.id}</Link></div>
                                                    <div className="is-size-5 mt-2 mb-3 is-italic">{l.pickup_city}, {l.pickup_state} ➡ {l.dropoff_city}, {l.dropoff_state}</div>
                                                    <div className="is-size-5 my-3">Distance (miles): {l.distance}</div>
                                                    <div className="is-size-5 my-3">Pickup on: {pickupDatetime}</div>
                                                    <div className="is-size-5 my-3">Dropoff on: {dropoffDatetime}</div>
                                                    <div className="is-size-5 my-3">Distributor: <Link to={`/users/${l.distributor?.id}`}>{l.distributor?.company}</Link></div>
                                                    <div className="is-size-5 my-3">Dispatcher: <Link to={`/users/${l.assigned_truck?.dispatcher?.id}`}>{l.assigned_truck?.dispatcher?.company}</Link></div>
                                                    <div className="is-size-5 my-3">Truck: <Link to={`/trucks/${l.assigned_truck?.id}`}>{l.assigned_truck?.alias}</Link> ({l.assigned_truck?.current_city}, {l.assigned_truck?.current_state})</div>
                                                    <div className="is-size-5 my-3">Status: {l.load_status?.label}</div>
                                                </div>
                                                <button onClick={() => drawRoute(l)} className="button btn-large has-background-grey has-text-white mr-2">View route</button>
                                                <button onClick={() => locateTruck(l)} className="button btn-large has-background-grey has-text-white mr-2">Locate truck</button>
                                                {
                                                    userType === "dispatcher"
                                                        ?
                                                        !updater.open
                                                            ?
                                                            <button onClick={() => toggleUpdater({ open: true, loadId: l.id })} className="button btn-large is-info mr-2">Update</button>
                                                            :
                                                            updater.loadId !== l.id
                                                                ?
                                                                <button onClick={() => toggleUpdater({ open: true, loadId: l.id })} className="button btn-large is-info mr-2">Update</button>
                                                                : ""
                                                        : ""
                                                }
                                            </div>
                                        </div>
                                        {
                                            updater.open && updater.loadId === l.id
                                                ?
                                                <div className="column px-5">
                                                    <form onSubmit={() => handleUpdateLoad(l.id, statusBuilder, l.assigned_truck)}>
                                                        {/* current_city */}
                                                        <fieldset className="my-5 is-size-5">
                                                            <label htmlFor="current_state">Update city</label>
                                                            <input
                                                                onChange={handleOnChange}
                                                                className="input name m-auto"
                                                                type="text"
                                                                name="current_city" />
                                                        </fieldset>
                                                        {/* current_state */}
                                                        <fieldset className="my-5 is-size-5">
                                                            <label htmlFor="current_state">Update state</label>
                                                            <select
                                                                onChange={handleOnChange}
                                                                className="input name m-auto"
                                                                name="current_state">
                                                                <option hidden>Choose state...</option>
                                                                {
                                                                    StatesArray.map(state => {
                                                                        return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        </fieldset>
                                                        {/* load_status */}
                                                        <fieldset className="my-5 is-size-5">
                                                            <label htmlFor="load_status">Update Status</label>
                                                            <div>
                                                                <select
                                                                    onChange={handleOnChange}
                                                                    className="input name m-aut"
                                                                    name="load_status">
                                                                    <option value={0} hidden>Select status</option>
                                                                    {
                                                                        loadStatuses.map(s => {
                                                                            if (s.id < 8) {
                                                                                return <option key={s.id} value={s.id}>{s.label}</option>
                                                                            }
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </fieldset>
                                                        <button type="submit" className="button btn-large is-success mr-2">Confirm</button>
                                                        <button type="reset" onClick={() => toggleUpdater({ open: false, loadId: 0 })} className="button btn-large is-danger mr-2">Cancel</button>
                                                    </form>
                                                </div>
                                                : ""
                                        }
                                    </div>
                                    {
                                        generateRouteProgress(l)
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </>
            :
            <>
                <div className="is-size-2 mb-5" style={{ borderBottom: "1px solid black" }}>Dashboard</div>
                <div className="is-size-4">{userType === 'distributor' ? "You haven't booked any loads!" : "None of your bids have been accepted!"}</div>
            </>
    )
}