import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { BidRepository } from "../../repositories/BidRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import trashIcon from "../../images/trashIcon.png"
import moment from "moment"

export const BidForm = ({ trucks, userType }) => {
    const history = useHistory()
    const { loadId } = useParams()
    const [load, setLoad] = useState({})
    const [loadBids, setLoadBids] = useState([])
    const [bidBuilder, setBidBuilder] = useState({
        dollar_amount: 0,
        truck: 0
    })

    const syncLoadBids = () => {
        BidRepository.loadBids(loadId)
            .then(setLoadBids)
    }
    const syncLoad = () => {
        LoadRepository.retrieve(loadId)
            .then(setLoad)
    }

    useEffect(() => {
        syncLoad()
        syncLoadBids()
    }, [loadId])

    const handleOnChange = (e) => {
        const copy = { ...bidBuilder }
        copy[e.target.name] = e.target.value
        setBidBuilder(copy)
    }

    const handleSubmitBid = () => {
        if (bidBuilder.truck === 0) {
            window.alert('Please select a truck for this bid')
        }
        else {
            LoadRepository.placeBid(loadId, bidBuilder)
                .then(syncLoadBids)
                .then(syncLoad)
        }
    }

    const handleDeleteBid = (id) => {
        BidRepository.delete(id)
            .then(syncLoadBids)
            .then(syncLoad)
    }

    return (
        <div className="box mx-auto" style={{ width: "60%" }}>
            <div className="box is-flex is-flex-direction-row is-justify-content-space-around has-background-info has-text-white" style={{ width: "50%", margin: "2em auto" }}>
                {
                    load.bid_macros?.count
                        ?
                        <>
                            <div>Total bids: {load.bid_macros?.count}</div>
                            <div>Highest bid: ${load.bid_macros?.max}</div>
                            <div>Average bid: ${load.bid_macros?.avg}</div>
                            <div>Lowest bid: ${load.bid_macros?.min}</div>
                        </>
                        : "No bids have been made yet!"
                }
            </div>
            <div className="columns">
                {
                    userType === "dispatcher"
                        ?
                        <div className="column is-4">
                            <div className="title">Bidding is open!</div>
                            <progress className="progress is-small is-primary" max="100">15%</progress>
                            <form onSubmit={handleSubmitBid} className="form">
                                <div className="is-size-3">Place bid</div>
                                {/* dollar_amount */}
                                <fieldset className="my-5 is-size-5">
                                    <label htmlFor="dollar_amount">Dollar amount</label>
                                    <input
                                        placeholder="$0.00"
                                        onChange={handleOnChange}
                                        className="input name m-auto"
                                        type="number"
                                        step={.01}
                                        inputMode='decimal'
                                        min={0}
                                        name="dollar_amount"
                                        required autoFocus
                                    />
                                </fieldset>
                                {/* truck */}
                                <fieldset className="my-5 is-size-5">
                                    <label htmlFor="truck">Truck</label>
                                    <div>
                                        <select
                                            onChange={handleOnChange}
                                            className="input name m-auto"
                                            required
                                            name="truck">
                                            <option value={0} hidden>Select available truck</option>
                                            {
                                                trucks.map(t => {
                                                    if (t.is_assigned) {
                                                        return <option disabled key={t.id} value={t.id}>{t.alias} (Unavailable)</option>
                                                    }
                                                    return <option key={t.id} value={t.id}>{t.alias} ({t.current_city}, {t.current_state})</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </fieldset>
                                <div className="container">
                                    <button type="submit" className="button is-success">Confirm bid</button>
                                    <button type="reset" className="button ml-4" onClick={() => history.push(`/loads/${loadId}`)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                        :
                        <div className="column is-4">
                            <div className="title">Bidding is open!</div>
                            <progress className="progress is-small is-primary" max="100">15%</progress>
                        </div>
                }
                <div className="column is-1"></div>
                <div className="column is-7">
                    <div className="title">Bid history</div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="is-size-6">Bid #</th>
                                <th className="is-size-6">Offer</th>
                                <th className="is-size-6">Dispatcher</th>
                                <th className="is-size-6">Truck alias</th>
                                <th className="is-size-6">Trailer</th>
                                <th className="is-size-6">Truck location</th>
                                <th className="is-size-6">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loadBids.map(b => {
                                    return (
                                        <tr className="bid-row" key={b.id}>
                                            <td>{b.id}</td>
                                            <td>${b.dollar_amount}</td>
                                            <td>{b.dispatcher?.company}</td>
                                            <td>{b.truck?.alias}</td>
                                            <td>{b.truck?.trailer_type?.label}</td>
                                            <td>{b.truck?.current_city}, {b.truck?.current_state}</td>
                                            <td>{moment.utc(b.timestamp).format('llll')}</td>
                                            {
                                                b.is_owner
                                                    ?
                                                    <td><img onClick={() => handleDeleteBid(b.id)} id="trashIcon" src={trashIcon} /></td>
                                                    : ""
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
