import moment from "moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { BidRepository } from "../../repositories/BidRepository"
import { LoadHistoryRepository } from "../../repositories/LoadHistoryRepository"
import { LoadRepository } from "../../repositories/LoadRepository"

export const BidDetails = ({ userType, syncLoads, syncLoadHistory }) => {
    const history = useHistory()
    const { loadId } = useParams()
    const { bidId } = useParams()
    const [bid, setBid] = useState({})
    const [load, setLoad] = useState({})

    useEffect(() => {
        BidRepository.retrieve(bidId)
            .then(setBid)
        LoadRepository.retrieve(loadId)
            .then(setLoad)
    }, [bidId]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleBidStatus = (id, obj) => {
        if (bid.is_accepted) {
            if (window.confirm(`Are you sure you want to cancel this booking?`) === true)
                BidRepository.accept(id, obj)
            LoadRepository.retrieve(loadId)
                .then(load => {
                    LoadHistoryRepository.create({
                        load: load.id,
                        load_status: 10,
                        city: load.pickup_city,
                        state: load.pickup_state
                    })
                })
                .then(() => syncLoadHistory(loadId))
                .then(syncLoads)
                .then(() => history.push(`/loads/${loadId}`))
        }
        else {
            if (window.confirm(`Are you sure you want to accept this bid?`) === true)
                if (bid.truck.is_assigned) {
                    window.alert(`Truck #${bid.truck?.id} (${bid.truck?.alias}) is no longer available`)
                }
                else {
                    BidRepository.accept(id, obj)
                    LoadRepository.retrieve(loadId)
                        .then(load => {
                            LoadHistoryRepository.create({
                                load: load.id,
                                load_status: 9,
                                city: load.pickup_city,
                                state: load.pickup_state
                            })
                        })
                    LoadRepository.retrieve(loadId)
                        .then(load => {
                            LoadHistoryRepository.create({
                                load: load.id,
                                load_status: load.load_status?.id,
                                city: load.pickup_city,
                                state: load.pickup_state
                            })
                        })
                        .then(() => syncLoadHistory(loadId))
                        .then(syncLoads)
                        .then(() => history.push(`/loads/${loadId}`))
                }
        }
    }

    const handleDeleteBid = (id, loadId) => {
        if (window.confirm(`Are you sure you want to delete your bid?`) === true)
            BidRepository.delete(id)
                .then(() => history.push(`/loads/${loadId}`))
    }

    return (
        <div className="box mx-auto" style={{ width: "50%" }}>
            <div className="title">Bid #{bid.id} details</div>
            <div className="is-size-5 py-2">Load # {bid.load?.id}</div>
            <div className="is-size-5 py-2">Offer: ${bid.dollar_amount}</div>
            <div className="is-size-5 py-2">Dispatcher: <Link to={`/users/${bid.dispatcher?.id}`}>{bid.dispatcher?.company}</Link></div>
            <div className="is-size-5 py-2">Truck: <Link to={`/trucks/${bid.truck?.id}`}>{bid.truck?.alias}</Link></div>
            <div className="is-size-5 py-2">Truck location: {bid.truck?.current_city}, {bid.truck?.current_state}</div>
            <div className="is-size-5 py-2">Trailer: {bid.truck?.trailer_type?.label}</div>
            <div className="is-size-5 py-2">Timestamp: {moment(bid.timestamp).format('llll')}</div>
            {
                userType === "distributor" && load.is_owner === true
                    ?
                    load.is_booked
                        ?
                        bid.is_accepted
                            ?
                            <div className="py-4">
                                <button onClick={() => handleBidStatus(bid.id, bid)} className="button btn-large mr-4 is-danger">Cancel booking</button>
                            </div>
                            :
                            <div className="py-4">
                                <button disabled onClick={() => handleBidStatus(bid.id, bid)} className="button mr-4 has-background-grey has-text-white">Closed</button>
                            </div>
                        :
                        <div className="py-4">
                            <button onClick={() => handleBidStatus(bid.id, bid)} className="button mr-4 is-success">Accept</button>
                        </div>
                    : ""
            }
            {
                bid.is_owner
                    ?
                    bid.is_accepted
                        ?
                        <div className="py-4">
                            <button disabled onClick={() => handleDeleteBid(bidId, bid.load?.id)} className="button is-danger">Delete</button>
                        </div>
                        :
                        <div className="py-4">
                            <button onClick={() => handleDeleteBid(bidId, bid.load?.id)} className="button is-danger">Delete</button>
                        </div>
                    : ""
            }
        </div>
    )

}