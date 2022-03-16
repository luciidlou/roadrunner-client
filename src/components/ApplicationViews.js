import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Route } from "react-router-dom"
import { TruckRepository } from "../repositories/TruckRepository"
import { Home } from "./home/Home"
import { LoadRoutes } from "./routes/LoadRoutes"
import { FleetManager } from "./trucks/FleetManager"
import { NewTruckForm } from "./trucks/NewTruckForm"


export const ApplicationViews = ({ userType }) => {
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
    <main className="px-2">
      <Route exact path={["/", "/dashboard"]}>
        <Home />
      </Route>

      <Route exact path="/fleetmanager">
        <FleetManager trucks={trucks} />
      </Route>

      <Route exact path="/trucks/create">
        <NewTruckForm syncTrucks={syncTrucks} />
      </Route>

      <LoadRoutes trucks={trucks} userType={userType} />
    </main>
  )
}
