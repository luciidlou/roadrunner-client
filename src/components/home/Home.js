import { useEffect, useState } from "react"
import { LoadRepository } from "../../repositories/LoadRepository"
import "./Home.css"

export const Home = () => {
    const [bookedLoads, setBookedLoads] = useState([])

    useEffect(() => {
        LoadRepository.booked()
            .then(setBookedLoads)
    }, [])

    return (
        <div className="container">
            {
                bookedLoads.map(load => {
                    const truckLocation = `${load.assigned_truck?.current_city}, ${load.assigned_truck?.current_state}`
                    return (
                        <div key={load.id}>{load.assigned_truck?.alias} is assigned to load #{load.id} and is currently in {truckLocation}</div> 
                    )
                })
            }
        </div>
    )
}