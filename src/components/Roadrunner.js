import React, { useEffect, useState } from "react"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { NavBar } from "./nav/NavBar"
import "./Roadrunner.css"

export const Roadrunner = () => {
    const [token, setTokenState] = useState(localStorage.getItem('token'))
    const [userType, setUserTypeState] = useState(localStorage.getItem('userType'))

    const setToken = (newToken) => {
        localStorage.setItem('token', newToken)
        setTokenState(newToken)
    }

    const setUserType = (newUserType) => {
        localStorage.setItem('userType', newUserType)
        setUserTypeState(newUserType)
    }

    return <>
        {
            token
                ?
                <Route>
                    <NavBar token={token} setToken={setToken} userType={userType} setUserType={setUserType} />
                    <ApplicationViews userType={userType} />
                </Route>
                :
                <Redirect to="/login" />
        }

        <Route exact path="/login" >
            <Login setToken={setToken} setUserType={setUserType} />
        </Route>

        <Route exact path="/register" >
            <Register setToken={setToken} setUserType={setUserType} />
        </Route>
    </>
}
