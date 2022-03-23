import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { TruckRepository } from "../repositories/TruckRepository"
import { Dashboard } from "./dashboard/Dashboard"
import { LoadRoutes } from "./routes/LoadRoutes"
import { TruckRoutes } from "./routes/TruckRoutes"
import { UserDetails } from "./users/UserDetails"


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

      <Route exact path="/users/:userId(\d+)">
        <UserDetails userType={userType} />
      </Route>

      <TruckRoutes trucks={trucks} syncTrucks={syncTrucks} userType={userType} />

      <LoadRoutes trucks={trucks} userType={userType} />
    </main>
  )
}
