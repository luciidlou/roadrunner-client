import { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { FreightTypeRepository } from "../../repositories/FreightTypeRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import { EditLoadForm } from "../loads/EditLoadForm"
import { LoadBoard } from "../loads/LoadBoard"
import { LoadDetails } from "../loads/LoadDetails"
import { NewLoadForm } from "../loads/NewLoadForm"

export const LoadRoutes = () => {
    const [loads, setLoads] = useState([])
    const [freightTypes, setFreightTypes] = useState([])

    useEffect(() => {
        syncLoads()
    }, [])

    const syncLoads = () => {
        LoadRepository.list()
            .then(setLoads)
    }

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
                <LoadBoard loads={loads} />
            </Route>
            <Route exact path="/newload">
                <NewLoadForm freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} syncLoads={syncLoads} />
            </Route>
            <Route exact path="/loads/:loadId(\d+)/edit">
                <EditLoadForm freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} syncLoads={syncLoads} />
            </Route>
            <Route exact path="/loads/:loadId(\d+)">
                <LoadDetails syncLoads={syncLoads} />
            </Route>
        </>
    )
}