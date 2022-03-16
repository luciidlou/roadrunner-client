import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Route } from "react-router-dom"
import { TruckRepository } from "../repositories/TruckRepository"
import { Home } from "./home/Home"
import { LoadRoutes } from "./routes/LoadRoutes"
import { TruckRoutes } from "./routes/TruckRoutes"


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

      <TruckRoutes trucks={trucks} syncTrucks={syncTrucks} />

      <LoadRoutes trucks={trucks} userType={userType} />
    </main>
  )
}
