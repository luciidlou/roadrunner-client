import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BidRepository } from "../../repositories/BidRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import trashIcon from "../../images/trashIcon.png"
import handshakeIcon from "../../images/handshakeIcon.png"
import moment from "moment"

export const BidForm = ({ trucks, userType, syncLoad }) => {
    const { loadId } = useParams()
    const [load, setLoad] = useState({})
    const [warning, toggleWarning] = useState(false)
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
        LoadRepository.retrieve(loadId)
            .then(setLoad)
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

    const handleDeleteBid = (id) => {
        if (window.confirm(`Are you sure you want to delete your bid?`) === true)
            BidRepository.delete(id)
                .then(syncLoadBids)
                .then(syncLoad)
    }


    return (
        <>
            <div className="columns" style={{ borderTop: "1px solid black", marginTop: "30px", paddingTop: "30px" }}>
                {
                    userType === "dispatcher"
                        ?
                        <div className="column is-3">
                            <div className="title">Bidding is open!</div>
                            <progress className="progress is-small is-primary" max="100">15%</progress>
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
                                                    return <option key={t.id} value={t.id}>{t.alias} ({t.current_city}, {t.current_state})</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </fieldset>
                                <div className="container">
                                    <button type="submit" className="button is-success">Confirm bid</button>
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
                                <th className="is-size-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loadBids.map(b => {
                                    return (
                                        <tr className={"bid-row"} key={b.id}>
                                            <td>{b.id}</td>
                                            <td>${b.dollar_amount}</td>
                                            <td>{b.dispatcher?.company}</td>
                                            <td>{b.truck?.alias}</td>
                                            <td>{b.truck?.trailer_type?.label}</td>
                                            <td>{b.truck?.current_city}, {b.truck?.current_state}</td>
                                            <td >{moment(b.timestamp).format('llll')}</td>
                                            {
                                                userType === "dispatcher"
                                                    ?
                                                    b.is_owner
                                                        ?
                                                        <td>
                                                            <img
                                                                className={warning ? "bid-row has-background-danger" : "bid-row"}
                                                                // onMouseEnter={() => toggleWarning(true)}
                                                                // onMouseLeave={() => toggleWarning(false)}
                                                                onClick={() => handleDeleteBid(b.id)} id="trashIcon" src={trashIcon}
                                                                alt="trash can"
                                                            />
                                                        </td>
                                                        : <td></td>
                                                    :
                                                    load.is_owner
                                                        ?
                                                        <td>
                                                            <img
                                                                className={warning ? "bid-row has-background-danger" : "bid-row"}
                                                                // onMouseEnter={() => toggleWarning(true)}
                                                                // onMouseLeave={() => toggleWarning(false)}
                                                                onClick={() => handleDeleteBid(b.id)} id="trashIcon" src={handshakeIcon}
                                                                alt="handshake"
                                                            />
                                                        </td>
                                                        :
                                                        <td></td>
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
