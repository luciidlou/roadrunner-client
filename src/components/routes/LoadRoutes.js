import { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { FreightTypeRepository } from "../../repositories/FreightTypeRepository"
import { EditLoadForm } from "../loads/EditLoadForm"
import { LoadBoard } from "../loads/LoadBoard"
import { LoadDetails } from "../loads/LoadDetails"
import { NewLoadForm } from "../loads/NewLoadForm"

export const LoadRoutes = () => {
    const [freightTypes, setFreightTypes] = useState([])

    const syncFreightTypes = () => {
        FreightTypeRepository.list()
            .then(setFreightTypes)
    }

    useEffect(() => {
        syncFreightTypes()
    }, [])

    return (
        <>
            <Route exact path="/loadboard">
                <LoadBoard />
            </Route>
            <Route exact path="/newload">
                <NewLoadForm freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} />
            </Route>
            <Route exact path="/loads/:loadId(\d+)/edit">
                <EditLoadForm freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} />
            </Route>
            <Route exact path="/loads/:loadId(\d+)">
                <LoadDetails />
            </Route>
        </>
    )
}