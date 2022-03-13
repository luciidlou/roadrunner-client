import moment from "moment"
import { useEffect, useState } from "react"
import { LoadRepository } from "../../repositories/LoadRepository"

export const LoadBoard = () => {
    const [unBookedLoads, setUnBookedLoads] = useState([])

    useEffect(() => {
        LoadRepository.unbooked()
            .then(setUnBookedLoads)
    }, [])

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Load ID</th>
                    <th>Distributor</th>
                    <th>Freight Types</th>
                    <th>Pickup address</th>
                    <th>Pickup city</th>
                    <th>Pickup state</th>
                    <th>Pickup date/time</th>
                    <th>Dropoff address</th>
                    <th>Dropoff city</th>
                    <th>Dropoff state</th>
                    <th>Dropoff date/time</th>
                    <th>Distance (mi)</th>
                    <th>Is Hazardous</th>
                </tr>
            </thead>
            <tbody>
                {
                    unBookedLoads.map(load => {
                        const pickupDateTime = moment(load.pickup_datetime).format('llll')
                        const dropoffDateTime = moment(load.dropoff_datetime).format('llll')

                        return (
                            !load.is_booked
                                ?
                                <tr key={load.id}>
                                    <td>{load.id}</td>
                                    <td>{load.distributor?.company}</td>
                                    <td>Freight types go here</td>
                                    <td>{load.pickup_address}</td>
                                    <td>{load.pickup_city}</td>
                                    <td>{load.pickup_state}</td>
                                    <td>{pickupDateTime}</td>
                                    <td>{load.dropoff_address}</td>
                                    <td>{load.dropoff_city}</td>
                                    <td>{load.dropoff_state}</td>
                                    <td>{dropoffDateTime}</td>
                                    <td>{load.distance}</td>
                                    <td>{load.is_hazardous ? "yes" : "no"}</td>
                                </tr>
                                : null
                        )
                    })
                }
            </tbody>
        </table>
    )
}