import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { Home } from "./home/Home"
import { LoadRoutes } from "./routes/LoadRoutes"
import { FleetManager } from "./trucks/FleetManager"


export const ApplicationViews = ({ userType }) => {

  return (
    <main className="px-2">
      <Route exact path={["/", "/dashboard"]}>
        <Home />
      </Route>

      <Route exact path="/fleetmanager">
        <FleetManager />
      </Route>

      <LoadRoutes userType={userType} />
    </main>
  )
}
