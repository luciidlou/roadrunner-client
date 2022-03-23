import moment from "moment"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router-dom"
import { LoadHistoryRepository } from "../../repositories/LoadHistoryRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import { QueryMaps } from "../../utilities/QueryMaps"
import { StatesArray } from "../../utilities/StatesArray"

export const EditLoadForm = ({ freightTypes, syncFreightTypes, syncLoads, syncLoadHistory }) => {
    const { loadId } = useParams()
    const history = useHistory()
    const [loadBuilder, setLoadBuilder] = useState({
        pickup_address: "",
        pickup_city: "",
        pickup_state: "",
        pickup_datetime: "",
        dropoff_address: "",
        dropoff_city: "",
        dropoff_state: "",
        dropoff_datetime: "",
        distance: 0,
        is_hazardous: false,
        freight_types: []
    })

    useEffect(() => {
        LoadRepository.retrieve(loadId)
            .then(load => {
                const freightTypeIdArr = []

                if (load.freight_types?.length > 0) {
                    load.freight_types.forEach(type => freightTypeIdArr.push(type.id))
                }

                setLoadBuilder({
                    pickup_address: load.pickup_address,
                    pickup_city: load.pickup_city,
                    pickup_state: load.pickup_state,
                    pickup_datetime: load.pickup_datetime,
                    dropoff_address: load.dropoff_address,
                    dropoff_city: load.dropoff_city,
                    dropoff_state: load.dropoff_state,
                    dropoff_datetime: load.dropoff_datetime,
                    distance: load.distance,
                    is_hazardous: load.is_hazardous,
                    freight_types: freightTypeIdArr
                })
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleOnChange = (event) => {
        const copy = { ...loadBuilder }
        copy[event.target.name] = event.target.value
        setLoadBuilder(copy)
    }

    const handleFreightTypeTags = (f) => {
        if (!loadBuilder.freight_types.includes(f.id)) {
            const copy = { ...loadBuilder }
            copy.freight_types.push(f.id)
            setLoadBuilder(copy)
            syncFreightTypes()
        }
        else {
            const index = loadBuilder.freight_types.indexOf(f.id)
            loadBuilder.freight_types.splice(index, 1)
            syncFreightTypes()
        }
    }

    const generateHazardMessage = () => {
        for (const type of freightTypes) {
            for (const loadFreightId of loadBuilder.freight_types) {
                if (type.id === loadFreightId) {
                    if (type.endorsement?.letter === "H") {
                        return <div className="has-text-danger my-4">This load is hazardous!</div>
                    }
                }
            }
        }
    }
    const displayHazardMessage = generateHazardMessage()

    const routeIsBuilt = () => {
        if (
            loadBuilder.pickup_address !== ""
            && loadBuilder.pickup_city !== ""
            && loadBuilder.pickup_state !== ""
            && loadBuilder.pickup_datetime !== ""
            && loadBuilder.dropoff_address !== ""
            && loadBuilder.dropoff_city !== ""
            && loadBuilder.dropoff_state !== ""
            && loadBuilder.dropoff_datetime !== ""
        )
            return true
    }

    const drawRoute = (event) => {
        event.preventDefault()
        const url = QueryMaps(loadBuilder.pickup_city, loadBuilder.pickup_state, loadBuilder.dropoff_city, loadBuilder.dropoff_state)
        window.open(url)
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault()
        if (displayHazardMessage !== undefined) {
            loadBuilder.is_hazardous = true
        }
        else {
            loadBuilder.is_hazardous = false
        }
        LoadRepository.update(loadId, loadBuilder)
        LoadRepository.retrieve(loadId)
            .then(load => {
                LoadHistoryRepository.create({
                    load: load.id,
                    load_status: 8,
                    city: load.pickup_city,
                    state: load.pickup_state
                })
            })
            .then(syncLoads)
            .then(() => syncLoadHistory(loadId))
            .then(() => history.push(`/loads/${loadId}`))
    }

    return (
        <div className="box mx-auto" style={{ width: "35%" }}>
            <form onSubmit={handleSubmitEdit} className="form">
                <div className="title">Edit load #{loadId}</div>
                <div className="has-text-grey is-size-4">Pickup Info:</div>
                {/* pickup_address */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="pickup_address">Pickup address</label>
                    <input
                        value={loadBuilder.pickup_address}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="pickup_address"
                        required autoFocus
                    />
                </fieldset>
                {/* pickup_city */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="pickup_city">Pickup city</label>
                    <input
                        value={loadBuilder.pickup_city}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="pickup_city"
                        required
                    />
                </fieldset>
                {/* pickup_state */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="pickup_state">Pickup state</label>
                    <select
                        value={loadBuilder.pickup_state}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        name="pickup_state"
                        required>
                        <option hidden>Choose state...</option>
                        {
                            StatesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                </fieldset>
                {/* pickup_datetime */}
                <fieldset style={{ borderBottom: "1px solid grey" }} className="my-5 pb-6 is-size-5">
                    <label htmlFor="pickup_datetime">Pickup date/time</label>
                    <input
                        value={moment.utc(loadBuilder.pickup_datetime).format('YYYY-MM-DDTHH:mm')}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="datetime-local"
                        name="pickup_datetime"
                        required
                    />
                </fieldset>
                <div className="has-text-grey is-size-4">Dropoff Info:</div>
                {/* dropoff_address */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="dropoff_address">Dropoff address</label>
                    <input
                        value={loadBuilder.dropoff_address}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="dropoff_address"
                        required
                    />
                </fieldset>
                {/* dropoff_city */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="dropoff_city">Dropoff city</label>
                    <input
                        value={loadBuilder.dropoff_city}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="dropoff_city"
                        required
                    />
                </fieldset>
                {/* dropoff_state */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="dropoff_state">Dropoff state</label>
                    <select
                        value={loadBuilder.dropoff_state}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        name="dropoff_state"
                        required>
                        <option hidden>Choose state...</option>
                        {
                            StatesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                </fieldset>
                {/* dropoff_datetime */}
                <fieldset style={{ borderBottom: "1px solid grey" }} className="my-5 pb-6 is-size-5">
                    <label htmlFor="dropoff_datetime">Dropoff date/time</label>
                    <input
                        value={moment.utc(loadBuilder.dropoff_datetime).format('YYYY-MM-DDTHH:mm')}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="datetime-local"
                        name="dropoff_datetime"
                        required
                    />
                </fieldset>
                {
                    routeIsBuilt()
                        ?
                        <div>
                            <button onClick={drawRoute} className="button is-info">Map it!</button>
                        </div>
                        : ""
                }
                {/* distance */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="distance">Distance (miles)</label>
                    <input
                        value={loadBuilder.distance}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="number"
                        min={0}
                        name="distance"
                        required
                    />
                </fieldset>
                <fieldset className="mt-5 mb-4 is-size-5">
                    <div>
                        <label htmlFor="distance">Type of freight</label>
                    </div>
                    <div className="mb-2">
                        <span className="is-size-7 is-italic">Select all that apply</span>
                    </div>
                    {
                        freightTypes.map(f => {
                            if (!loadBuilder.freight_types.includes(f.id)) {
                                return <span onClick={() => handleFreightTypeTags(f)} key={f.id} className="tag mx-2 mt-2 is-clickable">{f.label}</span>
                            }
                            else {
                                return <span onClick={() => handleFreightTypeTags(f)} key={f.id} className="tag mx-2 mt-2 is-clickable has-delete is-info">{f.label}</span>
                            }
                        })
                    }
                </fieldset>
                {displayHazardMessage}
                <div className="container">
                    <button type="submit" className="button is-success">Save load</button>
                    <button type="reset" className="button ml-4" onClick={() => history.push(`/loads/${loadId}`)}>Cancel edit</button>
                </div>
            </form>
        </div>
    )
}