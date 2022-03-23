import { Rating } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DispatcherRatingRepository } from "../../repositories/DispatcherRatingRepository"
import { UserRepository } from "../../repositories/UserRepository"

export const UserDetails = ({ userType }) => {
    const { userId } = useParams()
    const [user, setUser] = useState({})
    const [dispatcherRating, setDispatcherRating] = useState(null)

    const syncUser = () => {
        UserRepository.retrieve(userId)
            .then(setUser)
    }

    const syncRating = () => {
        DispatcherRatingRepository.retrieve(userId)
            .then(rating => {
                if (rating !== "") {
                    setDispatcherRating(rating)
                }
                else {
                    setDispatcherRating(null)
                }
            })
    }

    useEffect(() => {
        syncUser()
        syncRating()
    }, [])


    const handleRating = (event) => {
        const newRating = {
            dispatcher: user.id,
            rating: parseFloat(event.target.value)
        }
        if (dispatcherRating === null) {
            DispatcherRatingRepository.create(newRating)
                .then(syncRating)
                .then(syncUser)
        }
        else {
            if (parseFloat(event.target.value) === dispatcherRating.rating) {
                DispatcherRatingRepository.delete(dispatcherRating.id)
                    .then(syncRating)
                    .then(syncUser)
            }
            else {
                DispatcherRatingRepository.update(dispatcherRating.id, newRating)
                    .then(syncRating)
                    .then(syncUser)
            }
        }
    }

    return (
        <div className="box mx-auto" style={{ width: "65%" }}>
            <div className="title">{user.company}</div>
            <div className="is-size-5 py-2">Established in: {moment(user.established).format('YYYY')}</div>
            <div className="is-size-5 py-2">Joined on: {moment(user.user?.date_joined).format('LL')}</div>
            <div className="is-size-5 py-2">Representative: {user.user?.first_name} {user.user?.last_name}</div>
            <div className="is-size-5 py-2">About: {user.about}</div>
            {
                userType === "distributor" && user.user_type === "dispatcher"
                    ?
                    <>
                        <div className="is-size-5 py-2">Your rating</div>
                        <Rating
                            name="size-large"
                            size="large"
                            onChange={handleRating}
                            value={dispatcherRating ? dispatcherRating.rating : 0}
                            precision={0.5} />
                        <div className="is-size-5 py-2">Average rating: {user.avg_rating} stars</div>
                    </>
                    : ""
            }
        </div>
    )
}