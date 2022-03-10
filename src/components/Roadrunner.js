import React, { useState } from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { NavBar } from "./nav/NavBar"
import "./Roadrunner.css"

export const Roadrunner = () => {
    const [token, setTokenState] = useState(localStorage.getItem('token'))

    const setToken = (newToken) => {
        localStorage.setItem('token', newToken)
        setTokenState(newToken)
    }

    return <>
        {
            token
                ?
                <Route>
                    <NavBar token={token} setToken={setToken} />
                    <ApplicationViews />
                </Route>
                :
                <Redirect to="/login" />
        }

        <Route exact path="/login" >
            {/* <NavBar token={token} setToken={setToken} /> */}
            <Login token={token} setToken={setToken} />
        </Route>

        <Route exact path="/register" >
            {/* <NavBar token={token} setToken={setToken} /> */}
            <Register token={token} setToken={setToken} />
        </Route>
    </>
}
