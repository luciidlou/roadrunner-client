import { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { FreightTypeRepository } from "../../repositories/FreightTypeRepository"
import { LoadHistoryRepository } from "../../repositories/LoadHistoryRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import { BidDetails } from "../bids/BidDetails"
import { EditLoadForm } from "../loads/EditLoadForm"
import { LoadBoard } from "../loads/LoadBoard"
import { LoadDetails } from "../loads/LoadDetails"
import { LoadManager } from "../loads/LoadManager"
import { NewLoadForm } from "../loads/NewLoadForm"

export const LoadRoutes = ({ userType, trucks }) => {
    const [loads, setLoads] = useState([])
    const [cityFilter, setCityFilter] = useState("")
    const [loadHistory, setLoadHistory] = useState([])
    const [freightTypes, setFreightTypes] = useState([])

    const syncLoads = () => {
        if (cityFilter !== "") {
            LoadRepository.searchByCity(cityFilter)
                .then(setLoads)
        }
        else {
            LoadRepository.list()
                .then(setLoads)
        }
    }

    const syncLoadHistory = (loadId) => {
        LoadHistoryRepository.retrieve(loadId)
            .then(setLoadHistory)
    }

    useEffect(() => {
        syncLoads()
    }, [cityFilter])

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
                <LoadBoard loads={loads} setCityFilter={setCityFilter} syncLoads={setLoads} />
            </Route>

            <Route exact path="/loads/create">
                <NewLoadForm loadHistory={loadHistory} syncLoadHistory={syncLoadHistory} freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} syncLoads={syncLoads} />
            </Route>

            <Route exact path="/loads/:loadId(\d+)/edit">
                <EditLoadForm loadHistory={loadHistory} syncLoadHistory={syncLoadHistory} freightTypes={freightTypes} syncFreightTypes={syncFreightTypes} syncLoads={syncLoads} />
            </Route>

            <Route exact path="/loads/:loadId(\d+)/bids/:bidId(\d+)">
                <BidDetails loadHistory={loadHistory} syncLoadHistory={syncLoadHistory} userType={userType} syncLoads={syncLoads} />
            </Route>

            <Route exact path="/loads/:loadId(\d+)">
                <LoadDetails loadHistory={loadHistory} syncLoadHistory={syncLoadHistory} syncLoads={syncLoads} userType={userType} trucks={trucks} />
            </Route>

            <Route exact path="/loadmanager">
                <LoadManager loads={loads} />
            </Route>
        </>
    )
}