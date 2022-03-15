import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { TruckRepository } from "../../repositories/TruckRepository"
import "../loads/LoadBoard.css"

export const FleetManager = () => {
    const [trucks, setTrucks] = useState([])
    const history = useHistory()

    const syncTrucks = () => {
        TruckRepository.list()
            .then(setTrucks)
    }

    useEffect(() => {
        syncTrucks()
    }, [])

    return (
        <>
            <div className="is-size-3 mb-1">Fleet Manager</div>
            <div className="box" style={{ width: "fit-content" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="is-size-5">Truck ID</th>
                            <th className="is-size-5">Alias</th>
                            <th className="is-size-5">Current trailer</th>
                            <th className="is-size-5">Current city</th>
                            <th className="is-size-5">Current state</th>
                            <th className="is-size-5">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trucks.map(truck => {
                                const status = truck.current_load?.load_status?.label
                                return (
                                    <tr className={truck.is_booked ? "row-booked" : "row"} onClick={() => history.push(`/trucks/${truck.id}`)} key={truck.id}>
                                        <td>{truck.id}</td>
                                        <td>{truck.alias}</td>
                                        <td>{truck.trailer_type?.label}</td>
                                        <td>{truck.current_city}</td>
                                        <td>{truck.current_state}</td>
                                        <td>{truck.is_assigned ? status : "Unassigned"}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}