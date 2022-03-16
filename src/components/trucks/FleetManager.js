import moment from "moment"
import { useHistory } from "react-router-dom"
import "../loads/LoadBoard.css"

export const    FleetManager = ({ trucks }) => {
    const history = useHistory()

    return (
        <>
            <div className="is-size-3 mb-1">Fleet Manager</div>
            <div className="box" style={{ width: "fit-content" }}>
                <button className="button btn-large is-success mt-2 mb-5" onClick={() => history.push("/trucks/create")}>Truck Creator</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="is-size-5">Truck ID</th>
                            <th className="is-size-5">Alias</th>
                            <th className="is-size-5">Current trailer</th>
                            <th className="is-size-5">Current city</th>
                            <th className="is-size-5">Current state</th>
                            <th className="is-size-5">Status</th>
                            <th className="is-size-5">Driving since</th>
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
                                        <td>{moment.utc(truck.created_on).format('llll')}</td>
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