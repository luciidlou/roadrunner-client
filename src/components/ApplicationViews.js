import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { TruckRepository } from "../repositories/TruckRepository"
import { Dashboard } from "./dashboard/Dashboard"
import { LoadRoutes } from "./routes/LoadRoutes"
import { TruckRoutes } from "./routes/TruckRoutes"


export const ApplicationViews = ({ userType }) => {
  const [trucks, setTrucks] = useState([])

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
        <Dashboard userType={userType} />
      </Route>

      <TruckRoutes trucks={trucks} syncTrucks={syncTrucks} />

      <LoadRoutes trucks={trucks} userType={userType} />
    </main>
  )
}
