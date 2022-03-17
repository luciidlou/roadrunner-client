import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { TruckRepository } from "../../repositories/TruckRepository"
import { StatesArray } from "../../utilities/StatesArray"


export const EditTruckForm = ({ endorsements, trailerTypes, syncTrucks, syncEndorsements }) => {
    const history = useHistory()
    const { truckId } = useParams()
    const [truckBuilder, setTruckBuilder] = useState({
        alias: "",
        trailer_type: 0,
        current_city: "",
        current_state: "",
        endorsements: []
    })

    useEffect(() => {
        TruckRepository.retrieve(truckId)
            .then(truck => {
                const endorsementIdArr = []

                if (truck.endorsements?.length > 0) {
                    truck.endorsements.forEach(e => endorsementIdArr.push(e.id))
                }

                setTruckBuilder({
                    alias: truck.alias,
                    trailer_type: truck.trailer_type?.id,
                    current_city: truck.current_city,
                    current_state: truck.current_state,
                    endorsements: endorsementIdArr
                })
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleEndorsementTags = (e) => {
        if (!truckBuilder.endorsements.includes(e.id)) {
            const copy = { ...truckBuilder }
            copy.endorsements.push(e.id)
            setTruckBuilder(copy)
            syncEndorsements()
        }
        else {
            const index = truckBuilder.endorsements.indexOf(e.id)
            truckBuilder.endorsements.splice(index, 1)
            syncEndorsements()
        }
    }

    const handleOnChange = (event) => {
        const copy = { ...truckBuilder }
        copy[event.target.name] = event.target.value
        setTruckBuilder(copy)
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault()
        if (truckBuilder.trailer_type === 0) {
            window.alert("Please specify ")
        }
        TruckRepository.update(truckId, truckBuilder)
            .then(syncTrucks)
            .then(() => history.push(`/fleetmanager`))
    }

    return (
        <div className="box mx-auto" style={{ width: "35%" }}>
            <form onSubmit={handleSubmitEdit} className="form">
                <div className="title">Add truck</div>
                {/* alias */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="alias">Alias</label>
                    <input
                        value={truckBuilder.alias}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="alias"
                        required autoFocus
                    />
                </fieldset>
                {/* trailer_type */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="trailer_type">Current trailer</label>
                    <div>
                        <select
                            value={truckBuilder.trailer_type}
                            onChange={handleOnChange}
                            className="input name m-aut"
                            required
                            name="trailer_type">
                            <option value={0} hidden>Select current trailer</option>
                            {
                                trailerTypes.map(t => {
                                    return <option key={t.id} value={t.id}>{t.label}</option>
                                })
                            }
                        </select>
                    </div>
                </fieldset>
                {/* current_city */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="current_city">Current city</label>
                    <input
                        value={truckBuilder.current_city}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        type="text"
                        name="current_city"
                        required
                        />
                </fieldset>
                {/* current_state */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="current_state">Current state</label>
                    <select
                        value={truckBuilder.current_state}
                        onChange={handleOnChange}
                        className="input name m-auto"
                        name="current_state"
                        required>
                        <option hidden>Choose state...</option>
                        {
                            StatesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                </fieldset>
                {/* endorsements */}
                <fieldset className="mt-5 mb-4 is-size-5">
                    <div>
                        <label htmlFor="distance">Endorsements</label>
                    </div>
                    <div className="mb-2">
                        <span className="is-size-7 is-italic">Select all that apply</span>
                    </div>
                    {
                        endorsements.map(e => {
                            if (!truckBuilder.endorsements.includes(e.id)) {
                                return <span onClick={() => handleEndorsementTags(e)} key={e.id} className="tag mx-2 mt-2 is-clickable">{e.label}</span>
                            }
                            else {
                                return <span onClick={() => handleEndorsementTags(e)} key={e.id} className="tag mx-2 mt-2 is-clickable has-delete is-info">{e.label}</span>
                            }
                        })
                    }
                </fieldset>
                <div className="container">
                    <button type="submit" className="button is-success">Confirm edit</button>
                    <button type="reset" className="button ml-4" onClick={() => history.push(`/trucks/${truckId}`)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}