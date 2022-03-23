import { useEffect, useState } from "react"
import { BidRepository } from "../../repositories/BidRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import moment from "moment"
import { useHistory } from "react-router-dom"

export const BidForm = ({ trucks, userType, syncLoad, load, loadId }) => {
    const history = useHistory()
    const [loadBids, setLoadBids] = useState([])
    const [bidBuilder, setBidBuilder] = useState({
        dollar_amount: 0.00,
        truck: 0
    })

    const syncLoadBids = () => {
        BidRepository.loadBids(loadId)
            .then(setLoadBids)
    }

    useEffect(() => {
        syncLoadBids()
    }, [loadId]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleOnChange = (e) => {
        const copy = { ...bidBuilder }
        copy[e.target.name] = e.target.value
        setBidBuilder(copy)
    }

    const handleSubmitBid = (e) => {
        e.preventDefault()
        if (bidBuilder.truck === 0) {
            window.alert('Please select a truck for this bid')
        }
        else {
            LoadRepository.placeBid(loadId, bidBuilder)
                .then(syncLoadBids)
                .then(syncLoad)
                .then(() => setBidBuilder({
                    dollar_amount: 0.00,
                    truck: 0
                }))
        }
    }


    const timerHasEnded = () => {
        const currentDatetime = Date.now()
        if (currentDatetime > moment(load.bid_ending).format('x')) {
            return true
        }
        else {
            return false
        }
    }

    return (
        <>
            <div className="columns" style={{ borderTop: "1px solid black", marginTop: "30px", paddingTop: "30px" }}>
                {
                    userType === "dispatcher"
                        ?
                        <div className="column is-3">
                            <div className="title">{load.is_booked || timerHasEnded() ? "Bidding is closed" : "Bidding is open!"}</div>
                            <div>Bidding {timerHasEnded() ? "closed" : "closes"} {moment.utc(load.bid_ending).endOf().fromNow()}</div>
                            {
                                load.is_booked === true || timerHasEnded()
                                    ?
                                    <progress class="progress is-danger" value="100" max="100"></progress>
                                    :
                                    <progress className="progress is-small is-primary" max="100"></progress>
                            }
                            {
                                load.is_booked || timerHasEnded()
                                    ? ""
                                    :
                                    <form onSubmit={handleSubmitBid} className="form">
                                        <div className="is-size-3">Place bid</div>
                                        {/* dollar_amount */}
                                        <fieldset className="my-5 is-size-5">
                                            <label htmlFor="dollar_amount">Dollar amount</label>
                                            <input
                                                value={bidBuilder.dollar_amount}
                                                onChange={handleOnChange}
                                                className="input name m-auto"
                                                type="number"
                                                step={.01}
                                                inputMode='decimal'
                                                min={0.00}
                                                name="dollar_amount"
                                                required
                                            />
                                        </fieldset>
                                        {/* truck */}
                                        <fieldset className="my-5 is-size-5">
                                            <label htmlFor="truck">Truck</label>
                                            <div>
                                                <select
                                                    value={bidBuilder.truck}
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
                                                            return <option key={t.id} value={t.id}>{t.alias} - {t.trailer_type?.label} ({t.current_city}, {t.current_state})</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </fieldset>
                                        <div className="container">
                                            <button type="submit" className="button is-success">Confirm bid</button>
                                        </div>
                                    </form>
                            }
                        </div>
                        :
                        <div className="column is-3">
                            <div className="title">{load.is_booked || timerHasEnded() ? "Bidding is closed" : "Bidding is open!"}</div>
                            <div>Bidding {timerHasEnded() ? "closed" : "closes"} {moment.utc(load.bid_ending).endOf().fromNow()}</div>
                            {
                                load.is_booked === true || timerHasEnded()
                                    ?
                                    <progress className="progress is-danger" value="100" max="100"></progress>
                                    :
                                    <progress className="progress is-small is-primary" max="100"></progress>
                            }
                        </div>
                }
                <div className="column is-1"></div>
                <div className="column is-8">
                    <div className="title">Bid history</div>
                    <table className={"table is-bordered"}>
                        <thead>
                            <tr>
                                <th className="is-size-6">Bid #</th>
                                <th className="is-size-6">Offer</th>
                                <th className="is-size-6">Dispatcher</th>
                                <th className="is-size-6">Truck alias</th>
                                <th className="is-size-6">Trailer</th>
                                <th className="is-size-6">Truck location</th>
                                <th className="is-size-6">Timestamp</th>
                                <th className="is-size-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loadBids.map(b => {
                                    return (
                                        <tr className={"bid-row is-clickable"} key={b.id} onClick={() => history.push(`/loads/${b.load?.id}/bids/${b.id}`)}>
                                            <td>{b.id}</td>
                                            <td>${b.dollar_amount}</td>
                                            <td>{b.dispatcher?.company}</td>
                                            <td>{b.truck?.alias}</td>
                                            <td>{b.truck?.trailer_type?.label}</td>
                                            <td>{b.truck?.current_city}, {b.truck?.current_state}</td>
                                            <td >{moment(b.timestamp).format('llll')}</td>
                                            {
                                                load.is_booked
                                                    ?
                                                    <td>{b.is_accepted ? "✅" : "❌"}</td>
                                                    :
                                                    <td>N/A</td>
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
