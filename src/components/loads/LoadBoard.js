import moment from "moment"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { StatesArray } from "../../utilities/StatesArray"
import "../Table.css"

export const LoadBoard = ({ loads, userType, setCityFilter, syncLoads }) => {
    const history = useHistory()
    const [statesFilter, setStatesFilter] = useState("")

    const handleCitySearch = (event) => {
        setCityFilter(event.target.value)
    }

    return (
        <>
            <div className="is-size-3 mb-1">Load Board</div>
            <div className="box" style={{ width: "fit-content" }}>

                <div className="mb-5 is-size-4 is-flex-direction-row">
                    <label className="is-size-6">Filter by state:</label>
                    <select
                        onChange={(event) => setStatesFilter(event.target.value)}
                        className="input name m-auto"
                        name="dropoff_state"
                        style={{ width: "180px"}}>
                        <option value="">Show all states</option>
                        {
                            StatesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                    <label className="is-size-6" style={{marginLeft: "30px"}}>Search by city:</label>
                    <input
                        style={{ width: "180px"}}
                        onChange={handleCitySearch}
                        className="input name m-auto"
                        type="text"
                        name="pickup_city"
                        required
                    />
                </div>


                <table className="table is-bordered">
                    <thead>
                        <tr>
                            <th className="is-size-5">Load ID</th>
                            <th className="is-size-5">Distributor</th>
                            <th className="is-size-5" style={{ width: "350px" }}>Freight Types</th>
                            <th className="is-size-5">Pickup address</th>
                            <th className="is-size-5">Pickup city</th>
                            <th className="is-size-5">Pickup state</th>
                            <th className="is-size-5">Pickup date/time</th>
                            <th className="is-size-5">Dropoff address</th>
                            <th className="is-size-5">Dropoff city</th>
                            <th className="is-size-5">Dropoff state</th>
                            <th className="is-size-5">Dropoff date/time</th>
                            <th className="is-size-5">Distance (mi)</th>
                            <th className="is-size-5">Is Hazardous</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loads.map(load => {
                                const pickupDateTime = moment.utc(load.pickup_datetime).format('llll')
                                const dropoffDateTime = moment.utc(load.dropoff_datetime).format('llll')

                                const generateFreightTypeList = () => {
                                    const freightTypeLabelArr = []
                                    for (const freight of load.freight_types) {
                                        freightTypeLabelArr.push(freight.label)
                                    }
                                    return freightTypeLabelArr.join(", ")
                                }

                                const displayFreightTypeList = generateFreightTypeList()

                                if (statesFilter !== "") {
                                    if (load.pickup_state === statesFilter) {
                                        return (
                                            !load.is_booked
                                                ?
                                                <tr className="load-row" onClick={() => history.push(`/loads/${load.id}`)} key={load.id}>
                                                    <td>{load.id}</td>
                                                    <td>{load.distributor?.company}</td>
                                                    <td>{displayFreightTypeList}</td>
                                                    <td>{load.pickup_address}</td>
                                                    <td>{load.pickup_city}</td>
                                                    <td>{load.pickup_state}</td>
                                                    <td>{pickupDateTime}</td>
                                                    <td>{load.dropoff_address}</td>
                                                    <td>{load.dropoff_city}</td>
                                                    <td>{load.dropoff_state}</td>
                                                    <td>{dropoffDateTime}</td>
                                                    <td>{load.distance}</td>
                                                    <td>{load.is_hazardous ? "Yes" : "No"}</td>
                                                </tr>
                                                : null
                                        )
                                    }
                                }
                                else {
                                    return (
                                        !load.is_booked
                                            ?
                                            <tr className="load-row" onClick={() => history.push(`/loads/${load.id}`)} key={load.id}>
                                                <td>{load.id}</td>
                                                <td>{load.distributor?.company}</td>
                                                <td>{displayFreightTypeList}</td>
                                                <td>{load.pickup_address}</td>
                                                <td>{load.pickup_city}</td>
                                                <td>{load.pickup_state}</td>
                                                <td>{pickupDateTime}</td>
                                                <td>{load.dropoff_address}</td>
                                                <td>{load.dropoff_city}</td>
                                                <td>{load.dropoff_state}</td>
                                                <td>{dropoffDateTime}</td>
                                                <td>{load.distance}</td>
                                                <td>{load.is_hazardous ? "Yes" : "No"}</td>
                                            </tr>
                                            : null
                                    )
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}