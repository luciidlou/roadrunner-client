import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { FreightTypeRepository } from "../../repositories/FreightTypeRepository"
import { LoadRepository } from "../../repositories/LoadRepository"
import { QueryMaps } from "../../utilities/QueryMaps"

export const NewLoadForm = () => {
    const history = useHistory()
    const [freightTypes, setFreightTypes] = useState([])
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

    const syncFreightTypes = () => {
        FreightTypeRepository.list()
            .then(setFreightTypes)
    }

    useEffect(() => {
        syncFreightTypes()
    }, [])

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
                    if (type.endorsement?.id === 3) {
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

    const drawRoute = () => {
        const url = QueryMaps(loadBuilder.pickup_city, loadBuilder.pickup_state, loadBuilder.dropoff_city, loadBuilder.dropoff_state)
        window.open(url)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (displayHazardMessage) {
            const copy = { ...loadBuilder }
            copy.is_hazardous = true
            setLoadBuilder(copy)
        }
        LoadRepository.create(loadBuilder)
            .then(() => history.push("/loadboard"))
    }


    const statesArray = [
        {
            state: 'Alabama',
            abbr: 'AL'
        },
        {
            state: 'Alaska',
            abbr: 'AK'
        },
        {
            state: 'Arizona',
            abbr: 'AZ'
        },
        {
            state: 'Arizona',
            abbr: 'AR'
        },
        {
            state: 'California',
            abbr: 'CA'
        },
        {
            state: 'Colorado',
            abbr: 'CO'
        },
        {
            state: 'Connecticut',
            abbr: 'CT'
        },
        {
            state: 'Delaware',
            abbr: 'DE'
        },
        {
            state: 'Florida',
            abbr: 'FL'
        },
        {
            state: 'Georgia',
            abbr: 'GA'
        },
        {
            state: 'Hawaii',
            abbr: 'HI'
        },
        {
            state: 'Idaho',
            abbr: 'ID'
        },
        {
            state: 'Illinois',
            abbr: 'IL'
        },
        {
            state: 'Indiana',
            abbr: 'IN'
        },
        {
            state: 'Iowa',
            abbr: 'IA'
        },
        {
            state: 'Kansas',
            abbr: 'KS'
        },
        {
            state: 'Kentucky',
            abbr: 'KY'
        },
        {
            state: 'Louisiana',
            abbr: 'LA'
        },
        {
            state: 'Maine',
            abbr: 'ME'
        },
        {
            state: 'Maryland',
            abbr: 'MD'
        },
        {
            state: 'Massassachusetts',
            abbr: 'MA'
        },
        {
            state: 'Michigan',
            abbr: 'MI'
        },
        {
            state: 'Minnesota',
            abbr: 'MN'
        },
        {
            state: 'Mississippi',
            abbr: 'MS'
        },
        {
            state: 'Missouri',
            abbr: 'MO'
        },
        {
            state: 'Montana',
            abbr: 'MT'
        },
        {
            state: 'Nebraska',
            abbr: 'NE'
        },
        {
            state: 'Nevada',
            abbr: 'NV'
        },
        {
            state: 'New Hampshire',
            abbr: 'NH'
        },
        {
            state: 'New Jersey',
            abbr: 'NJ'
        },
        {
            state: 'New Mexico',
            abbr: 'NM'
        },
        {
            state: 'New York',
            abbr: 'NY'
        },
        {
            state: 'North Carolina',
            abbr: 'NC'
        },
        {
            state: 'North Dakota',
            abbr: 'ND'
        },
        {
            state: 'Ohio',
            abbr: 'OH'
        },
        {
            state: 'Oklahoma',
            abbr: 'OK'
        },
        {
            state: 'Oregon',
            abbr: 'OR'
        },
        {
            state: 'Pennsylvania',
            abbr: 'PA'
        },
        {
            state: 'Rhode Island',
            abbr: 'RI'
        },
        {
            state: 'South Carolina',
            abbr: 'SC'
        },
        {
            state: 'South Dakota',
            abbr: 'SD'
        },
        {
            state: 'Tennessee',
            abbr: 'TN'
        },
        {
            state: 'Texas',
            abbr: 'TX'
        },
        {
            state: 'Utah',
            abbr: 'UT'
        },
        {
            state: 'Vermont',
            abbr: 'VT'
        },
        {
            state: 'Virginia',
            abbr: 'VA'
        },
        {
            state: 'Washington',
            abbr: 'WA'
        },
        {
            state: 'West Virginia',
            abbr: 'WV'
        },
        {
            state: 'Wisconsin',
            abbr: 'WI'
        },
        {
            state: 'Wyoming',
            abbr: 'WY'
        }
    ]


    return (
        <div className="box mx-auto" style={{ width: "50%" }}>
            <form onSubmit={handleSubmit} className="form">
                <div className="title">New load form</div>
                <div className="has-text-grey is-size-4">Pickup Info:</div>
                {/* pickup_address */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="pickup_address">Pickup address</label>
                    <input
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
                        onChange={handleOnChange}
                        className="input name m-auto"
                        name="pickup_state"
                        required>
                        <option hidden>Choose state...</option>
                        {
                            statesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                </fieldset>
                {/* pickup_datetime */}
                <fieldset style={{ borderBottom: "1px solid grey" }} className="my-5 pb-6 is-size-5">
                    <label htmlFor="pickup_datetime">Pickup date/time</label>
                    <input
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
                        onChange={handleOnChange}
                        className="input name m-auto"
                        name="dropoff_state"
                        required>
                        <option hidden>Choose state...</option>
                        {
                            statesArray.map(state => {
                                return <option key={state.abbr} value={state.abbr}>{state.abbr} - {state.state}</option>
                            })
                        }
                    </select>
                </fieldset>
                {/* dropoff_datetime */}
                <fieldset style={{ borderBottom: "1px solid grey" }} className="my-5 pb-6 is-size-5">
                    <label htmlFor="dropoff_datetime">Dropoff date/time</label>
                    <input
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
                            <button onClick={drawRoute} className="button is-info">Calculate route</button>
                        </div>
                        : ""
                }
                {/* distance */}
                <fieldset className="my-5 is-size-5">
                    <label htmlFor="distance">Distance (miles)</label>
                    <input
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
                                return <span onClick={() => handleFreightTypeTags(f)} key={f.id} className="tag mx-2 mt-2 is-clickable has-delete is-success">{f.label}</span>
                            }
                        })
                    }
                </fieldset>
                {displayHazardMessage}
                <div className="container">
                    <button type="submit" className="button is-success">Confirm load</button>
                    <button type="reset" className="button ml-4"><Link to="/loadboard">Cancel Load</Link></button>
                </div>
            </form>
        </div>
    )
}