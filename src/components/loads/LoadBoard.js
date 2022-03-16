import moment from "moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { LoadRepository } from "../../repositories/LoadRepository"
import "../Table.css"

export const LoadBoard = ({ loads, userType }) => {
    const history = useHistory()

    return (
        <>
            <div className="is-size-3 mb-1">Load Board</div>
            <div className="box" style={{ width: "fit-content" }}>
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
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}