import moment from "moment"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { UserRepository } from "../../repositories/UserRepository"

export const UserDetails = (userType) => {
    const { userId } = useParams()
    const [user, setUser] = useState({})

    useEffect(() => {
        UserRepository.retrieve(userId)
            .then(setUser)
    }, [])

    return (
        <div className="box mx-auto" style={{ width: "65%" }}>
            <div className="title">{user.company}</div>
            <div className="is-size-5 py-2">Established in: {moment(user.established).format('YYYY')}</div>
            <div className="is-size-5 py-2">Joined on: {moment(user.user?.date_joined).format('LL')}</div>
            <div className="is-size-5 py-2">Representative: {user.user?.first_name} {user.user?.last_name}</div>
            <div className="is-size-5 py-2">About: {user.about}</div>
        </div>
    )
}