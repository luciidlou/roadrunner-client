import { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { EndorsementRepository } from "../../repositories/EndorsementRepository"
import { TrailerTypeRepository } from "../../repositories/TrailerTypeRepository"
import { EditTruckForm } from "../trucks/EditTruckForm"
import { FleetManager } from "../trucks/FleetManager"
import { NewTruckForm } from "../trucks/NewTruckForm"
import { TruckDetails } from "../trucks/TruckDetails"

export const TruckRoutes = ({ trucks, syncTrucks }) => {
    const [trailerTypes, setTrailerTypes] = useState([])
    const [endorsements, setEndorsements] = useState([])

    const syncEndorsements = () => {
        EndorsementRepository.list()
            .then(setEndorsements)
    }

    useEffect(() => {
        syncEndorsements()
        TrailerTypeRepository.list()
            .then(setTrailerTypes)
    }, [])

    return (
        <>
            <Route exact path="/fleetmanager">
                <FleetManager trucks={trucks} />
            </Route>

            <Route exact path="/trucks/create">
                <NewTruckForm endorsements={endorsements} trailerTypes={trailerTypes} syncTrucks={syncTrucks} syncEndorsements={syncEndorsements} />
            </Route>

            <Route exact path="/trucks/:truckId(\d+)/edit">
                <EditTruckForm endorsements={endorsements} trailerTypes={trailerTypes} syncTrucks={syncTrucks} syncEndorsements={syncEndorsements} />
            </Route>

            <Route exact path="/trucks/:truckId(\d+)">
                <TruckDetails />
            </Route>
        </>
    )
}