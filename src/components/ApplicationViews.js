import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { Home } from "./home/Home"
import { LoadBoard } from "./loads/LoadBoard"
import { NavBar } from "./nav/NavBar"


export const ApplicationViews = () => {

  return (
    <main className="px-2">
      <Route exact path={["/", "/dashboard"]}>
        <Home />
      </Route>
      <Route exact path="/loadboard">
        <LoadBoard />
      </Route>
    </main>
  )
}
